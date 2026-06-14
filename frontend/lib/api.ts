import type { ApiError } from '@/types';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export class ApiClientError extends Error {
    status: number;
    body: ApiError | null;

    constructor(message: string, status: number, body: ApiError | null) {
        super(message);
        this.name = 'ApiClientError';
        this.status = status;
        this.body = body;
    }
}

type QueryValue = string | number | boolean | undefined | null;
type Query = Record<string, QueryValue> | object;

type FetchOptions = Omit<RequestInit, 'body'> & {
    body?: unknown;
    token?: string;
    query?: Query;
};

function buildUrl(path: string, query?: Query): string {
    const url = new URL(
        path.startsWith('http') ? path : `${API_BASE_URL}${path}`,
    );
    if (query) {
        for (const [key, value] of Object.entries(query as Record<string, unknown>)) {
            if (value === undefined || value === null || value === '') continue;
            url.searchParams.set(key, String(value));
        }
    }
    return url.toString();
}

export async function apiFetch<T>(
    path: string,
    options: FetchOptions = {},
): Promise<T> {
    const { body, token, query, headers, ...rest } = options;

    const finalHeaders: Record<string, string> = {
        Accept: 'application/json',
        ...(headers as Record<string, string> | undefined),
    };
    if (body !== undefined) finalHeaders['Content-Type'] = 'application/json';
    if (token && token !== 'cookie-session') {
        finalHeaders['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(buildUrl(path, query), {
        ...rest,
        headers: finalHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        cache: rest.cache ?? 'no-store',
        credentials: rest.credentials ?? 'include',
    });

    if (!res.ok) {
        let errBody: ApiError | null = null;
        try {
            errBody = (await res.json()) as ApiError;
        } catch {
            // ignore non-JSON error bodies
        }
        const msg = Array.isArray(errBody?.message)
            ? errBody?.message.join('; ')
            : errBody?.message ?? `Request failed (${res.status})`;
        throw new ApiClientError(msg, res.status, errBody);
    }

    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
}

export const api = {
    get: <T>(path: string, opts?: Omit<FetchOptions, 'body'>) =>
        apiFetch<T>(path, { ...opts, method: 'GET' }),
    post: <T>(path: string, body?: unknown, opts?: FetchOptions) =>
        apiFetch<T>(path, { ...opts, method: 'POST', body }),
    patch: <T>(path: string, body?: unknown, opts?: FetchOptions) =>
        apiFetch<T>(path, { ...opts, method: 'PATCH', body }),
    put: <T>(path: string, body?: unknown, opts?: FetchOptions) =>
        apiFetch<T>(path, { ...opts, method: 'PUT', body }),
    delete: <T>(path: string, opts?: FetchOptions) =>
        apiFetch<T>(path, { ...opts, method: 'DELETE' }),
};
