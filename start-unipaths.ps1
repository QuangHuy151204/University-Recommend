# UniPaths demo: Ollama + backend + frontend + Cloudflare Tunnel
# Run:  .\start-unipaths.ps1
# First time: .\start-unipaths.ps1 -Build

param(
  [switch]$Build
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Backend = Join-Path $Root "backend"
$Frontend = Join-Path $Root "frontend"

$Cloudflared = @(
  "${env:ProgramFiles(x86)}\cloudflared\cloudflared.exe",
  "$env:ProgramFiles\cloudflared\cloudflared.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $Cloudflared) {
  $cmd = Get-Command cloudflared -ErrorAction SilentlyContinue
  if ($cmd) { $Cloudflared = $cmd.Source }
}

Write-Host "==> UniPaths start (unipaths.net)" -ForegroundColor Cyan

function Test-PortOpen([int]$Port) {
  $c = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  return $null -ne $c
}

function Stop-Port([int]$Port) {
  $conns = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  foreach ($c in $conns) {
    try {
      Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue
      Write-Host ("    Stopped PID {0} on port {1}" -f $c.OwningProcess, $Port) -ForegroundColor DarkYellow
    } catch {}
  }
}

if ($Build) {
  Write-Host "==> Build backend..." -ForegroundColor Yellow
  Push-Location $Backend
  # Delete dist + tsbuildinfo so incremental tsc does not skip emit.
  if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
  if (Test-Path "tsconfig.build.tsbuildinfo") { Remove-Item -Force "tsconfig.build.tsbuildinfo" }
  npm run build
  if ($LASTEXITCODE -ne 0) { Pop-Location; exit 1 }
  if (-not (Test-Path "dist\main.js")) {
    Write-Host "Build finished but dist\main.js is missing" -ForegroundColor Red
    Pop-Location
    exit 1
  }
  Pop-Location

  Write-Host "==> Build frontend..." -ForegroundColor Yellow
  Push-Location $Frontend
  if (-not (Test-Path ".env.production")) {
    Write-Host "Missing frontend\.env.production" -ForegroundColor Red
    Pop-Location
    exit 1
  }
  # Override .env.local so browser calls public domain, not localhost
  $env:NEXT_PUBLIC_API_URL = "https://unipaths.net/api"
  npm run build
  if ($LASTEXITCODE -ne 0) { Pop-Location; exit 1 }
  Pop-Location
}

$envProd = Join-Path $Frontend ".env.production"
if (-not (Test-Path $envProd)) {
  Write-Host "Missing frontend\.env.production" -ForegroundColor Red
  exit 1
}

$config = Join-Path $env:USERPROFILE ".cloudflared\config.yml"
if (-not (Test-Path $config)) {
  Write-Host "Missing cloudflared config.yml" -ForegroundColor Red
  exit 1
}

if (-not $Cloudflared) {
  Write-Host "cloudflared.exe not found. Reinstall: winget install Cloudflare.cloudflared" -ForegroundColor Red
  exit 1
}

$mainJs = Join-Path $Backend "dist\main.js"
if (-not (Test-Path $mainJs)) {
  Write-Host "==> Missing dist\main.js - building backend..." -ForegroundColor Yellow
  Push-Location $Backend
  if (Test-Path "tsconfig.build.tsbuildinfo") { Remove-Item -Force "tsconfig.build.tsbuildinfo" }
  npm run build
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path "dist\main.js")) {
    Write-Host "Backend build failed. Run: .\start-unipaths.ps1 -Build" -ForegroundColor Red
    Pop-Location
    exit 1
  }
  Pop-Location
}

# Free app ports if leftover processes
Stop-Port 3000
Stop-Port 3001
Start-Sleep -Seconds 1

if (Test-PortOpen 11434) {
  Write-Host "==> Ollama already running on :11434 (skip)" -ForegroundColor Green
} else {
  Write-Host "==> Starting Ollama..." -ForegroundColor Yellow
  Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "ollama serve"
  )
  Start-Sleep -Seconds 2
}

Write-Host "==> Starting Backend :3001 ..." -ForegroundColor Yellow
$backendCmd = "Set-Location '" + $Backend + "'; `$env:NODE_ENV='production'; npm run start:prod"
Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  $backendCmd
)

Start-Sleep -Seconds 5

Write-Host "==> Starting Frontend :3000 ..." -ForegroundColor Yellow
$frontendCmd = "Set-Location '" + $Frontend + "'; npm run start"
Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  $frontendCmd
)

Start-Sleep -Seconds 3

Write-Host "==> Starting Cloudflare Tunnel..." -ForegroundColor Yellow
# http2 = TCP (works on corp networks that block UDP/QUIC)
$cfPath = $Cloudflared.Replace("'", "''")
$tunnelCmd = "& '$cfPath' tunnel --protocol http2 run unipaths"
Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  $tunnelCmd
)

Write-Host ""
Write-Host "Opened windows. After ~30s open:" -ForegroundColor Green
Write-Host "  https://unipaths.net"
Write-Host "  http://localhost:3000"
Write-Host ""
Write-Host "First time / after code change: .\start-unipaths.ps1 -Build" -ForegroundColor DarkGray
