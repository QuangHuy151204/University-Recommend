# QA Recommendation Test Cases

> **Total: 50 cases** — covers single-filter, multi-filter, boundary, and negative scenarios.
> **API endpoint:** `POST /api/recommendations`
> **Backend file:** `backend/src/recommendations/recommendations.service.ts`
> **DTO:** `{ expected_score, subject_combination, interests, preferred_location?, budget_range?, budget_max_yearly?, career_goal?, method_code? }`

## Scoring weight reference

| Factor | Weight |
|--------|--------|
| Score fit | 35% |
| Interest/major match | 30% |
| Location | 15% |
| Budget | 10% |
| Career goal | 10% |

---

## A. Single-filter cases (RC01–RC08)

| ID | Input | Expected behavior | Pass criteria |
|----|-------|-------------------|---------------|
| RC01 | `expected_score=25, subject_combination=A00, interests=CNTT` | Return CNTT majors where cutoff ≤ ~27 via THPT. Top results should be "safety" tier. | Results contain only CNTT-related majors; all have A00 cutoff data; matchScore > 30 |
| RC02 | `expected_score=25, subject_combination=A00, interests=Kinh tế` | Return economics/business majors matching A00 combo | Results are economics-related; no IT/engineering majors in top results |
| RC03 | `expected_score=20, subject_combination=B00, interests=Y dược` | Return medical/pharmacy majors matching B00 | Results are medical/pharmacy; B00 cutoff data present |
| RC04 | `expected_score=25, subject_combination=D01, interests=Ngoại ngữ` | Return foreign language majors matching D01 | Results contain language/linguistics majors |
| RC05 | `expected_score=22, subject_combination=A00, interests=Cơ khí` | Return mechanical engineering majors | Results are engineering-related |
| RC06 | `expected_score=25, subject_combination=A00, interests=CNTT, budget_range=low` | Filter by low budget (≤15M/year) | All returned universities have avg tuition ≤ 15M |
| RC07 | `expected_score=25, subject_combination=A00, interests=CNTT, preferred_location=Phường Bạch Mai` | Filter by ward | Top results should include universities in Bạch Mai (HUST, NEU) |
| RC08 | `expected_score=25, subject_combination=A00, interests=CNTT, method_code=DGNL` | Filter by ĐGNL method | Results should use ĐGNL cutoff scores, not THPT |

## B. Two-filter combinations (RC09–RC18)

| ID | Input | Expected behavior | Pass criteria |
|----|-------|-------------------|---------------|
| RC09 | `score=25, combo=A00, interests=CNTT, preferred_location=Phường Cầu Giấy` | CNTT + Cầu Giấy ward | Results near Cầu Giấy get 15% location bonus |
| RC10 | `score=25, combo=A00, interests=CNTT, budget_max_yearly=20000000` | CNTT + max 20M tuition | Only universities with avg tuition ≤ 20M get full budget score |
| RC11 | `score=28, combo=A00, interests=CNTT` | High score CNTT | Results include top universities (HUST, VNU-UET, PTIT); tier should be "safety" for most |
| RC12 | `score=25, combo=A00, interests=Kinh tế, preferred_location=Phường Bạch Mai` | Economics + Bạch Mai | NEU should rank high (economics + Bạch Mai location match) |
| RC13 | `score=25, combo=A00, interests=CNTT, career_goal=lập trình viên` | CNTT + career goal | Career goal "lập trình viên" boosts IT majors with matching career_orientation |
| RC14 | `score=22, combo=A00, interests=Kinh tế, budget_range=low` | Economics + low budget | Budget-friendly economics programs returned |
| RC15 | `score=25, combo=D01, interests=Luật, preferred_location=Phường Cầu Giấy` | Law + Cầu Giấy | Law-related programs near Cầu Giấy prioritized |
| RC16 | `score=25, combo=A00, interests=Xây dựng, budget_range=medium` | Construction + medium budget | Construction/civil engineering programs returned |
| RC17 | `score=25, combo=A01, interests=CNTT` | CNTT with A01 combo | Results have A01 cutoff data; different from A00 results |
| RC18 | `score=25, combo=A00, interests=Marketing, career_goal=truyền thông` | Marketing + career goal | Marketing/communication majors returned |

## C. Multi-filter combinations (RC19–RC28)

| ID | Input | Expected behavior | Pass criteria |
|----|-------|-------------------|---------------|
| RC19 | `score=25, combo=A00, interests=CNTT, location=Phường Bạch Mai, budget_range=medium` | CNTT + Bạch Mai + medium budget | HUST should rank high; medium budget filter applied |
| RC20 | `score=24, combo=A00, interests=Kinh tế, location=Phường Bạch Mai, budget_max_yearly=30000000` | Economics + Bạch Mai + 30M max | NEU should appear; budget check against 30M threshold |
| RC21 | `score=26, combo=A00, interests=CNTT, location=Phường Cầu Giấy, budget_range=high, career_goal=kỹ sư phần mềm` | All filters | Full scoring with all 5 weight components; verify total adds to ≤100 |
| RC22 | `score=25, combo=A00, interests=CNTT, budget_max_yearly=25000000, career_goal=data scientist` | CNTT + budget + career | Budget and career orientation both considered |
| RC23 | `score=20, combo=B00, interests=Y dược, location=Phường Bạch Mai, budget_range=medium` | Medical + location + budget | Medical programs near Bạch Mai within medium budget |
| RC24 | `score=25, combo=A00, interests=Điện tử viễn thông, method_code=THPT, career_goal=kỹ sư` | Electronics + career + method | Electronics/telecom majors via THPT method |
| RC25 | `score=27, combo=A00, interests=CNTT, location=Phường Bạch Mai, budget_range=medium, career_goal=developer, method_code=THPT` | All 7 fields | Complete recommendation with all filters |
| RC26 | `score=22, combo=D01, interests=Ngôn ngữ Anh, location=Phường Cầu Giấy, budget_range=low` | English + Cầu Giấy + low budget | English language programs affordable in Cầu Giấy area |
| RC27 | `score=25, combo=A00, interests=Tài chính ngân hàng, budget_max_yearly=30000000` | Finance + specific budget | Finance/banking majors within 30M |
| RC28 | `score=23, combo=A00, interests=Quản trị kinh doanh, location=Phường Kim Liên` | Business admin + Kim Liên | Business programs in Kim Liên area |

## D. Boundary cases (RC29–RC40)

| ID | Input | Expected behavior | Pass criteria |
|----|-------|-------------------|---------------|
| RC29 | `score=10, combo=A00, interests=CNTT` | Very low score | Few or no results; most CNTT cutoffs are 20+. emptyReason or only low-cutoff schools |
| RC30 | `score=30, combo=A00, interests=CNTT` | Maximum score | All CNTT programs should be "safety" tier; top-tier schools included |
| RC31 | `score=0, combo=A00, interests=CNTT` | Zero score | No matches or only programs with very low cutoffs |
| RC32 | `score=27.35, combo=A00, interests=CNTT` | Score exactly equal to HUST CNTT 2024 cutoff (27.35) | HUST CNTT should appear as "safety" (diff=0); tier classification correct |
| RC33 | `score=27.34, combo=A00, interests=CNTT` | Score slightly below HUST CNTT cutoff | HUST CNTT should appear as "reach" (diff=-0.01); tier should be careful |
| RC34 | `score=27.36, combo=A00, interests=CNTT` | Score slightly above HUST cutoff | HUST CNTT should appear as "safety" (diff=+0.01) |
| RC35 | `score=25, combo=A00, interests=CNTT, budget_max_yearly=0` | Zero budget | Only free (military/police) programs should pass budget filter |
| RC36 | `score=25, combo=A00, interests=CNTT, budget_max_yearly=999000000` | Very high budget | Budget filter should not eliminate anyone |
| RC37 | `score=15, combo=A00, interests=CNTT` | Score 15 — below most CNTT cutoffs | Very few results; check if low-cutoff programs are found or emptyReason returned |
| RC38 | `score=25, combo=A00, interests=CNTT, preferred_location=Phường Bạch Mai` | Location with many universities (Bạch Mai) | Multiple results from Bạch Mai area |
| RC39 | `score=25, combo=A00, interests=CNTT, preferred_location=Xã Hoà Lạc` | Location with few universities (Hoà Lạc) | FPT/USTH/VNU area results prioritized |
| RC40 | `score=25, combo=A00, interests=An toàn thông tin` | Major with few matching universities | Cybersecurity results; limited but correct |

## E. Negative / no-result cases (RC41–RC50)

| ID | Input | Expected behavior | Pass criteria |
|----|-------|-------------------|---------------|
| RC41 | `score=5, combo=A00, interests=Y khoa` | Score way too low for medical | emptyReason='no_score_match' or empty results; no hallucinated results |
| RC42 | `score=25, combo=A00, interests=Vũ trụ học` | Major does not exist in DB | emptyReason='no_interest_match'; empty results |
| RC43 | `score=25, combo=Z99, interests=CNTT` | Invalid subject combination | emptyReason='no_subject_combination'; no Z99 in data |
| RC44 | `score=25, combo=A00, interests=CNTT, preferred_location=Quận 1 TP.HCM` | Location outside Hanoi | No ward match but should still return results (ward bonus=5 instead of 15) |
| RC45 | `score=25, combo=A00, interests=CNTT, budget_max_yearly=1000000` | Tuition too low (1M) | All avg tuitions exceed 1M; budget score=2 for all; still returns results but low budget match |
| RC46 | `score=-5, combo=A00, interests=CNTT` | Negative score | DTO validation should reject (Min=0); HTTP 400 expected |
| RC47 | `score=35, combo=A00, interests=CNTT` | Score above max (>30) | DTO validation should reject (Max=30); HTTP 400 expected |
| RC48 | `(empty body)` | No input at all | HTTP 400; validation errors for required fields |
| RC49 | `score=25, combo=A00, interests=` | Empty interests string | Should handle gracefully; interests treated as not provided |
| RC50 | `score=25, combo=A00, interests=<script>alert(1)</script>` | XSS in interests | No script execution; treated as non-matching interest; safe handling |

---

## Pass/Fail Criteria Per Case

For each case, verify:

1. **HTTP status** — 200 for valid inputs, 400 for validation failures
2. **Response structure** — `{ results: [], meta: { totalCandidates, filtersApplied, emptyReason, diversified } }`
3. **Result correctness** — each result satisfies filters
4. **Score logic** — matchScore reflects weight distribution
5. **Tier classification** — safety/reach/match correctly based on scoreDiff
6. **No duplicates** — same university+major not repeated
7. **Diversity cap** — max majors per university enforced
8. **No hallucination** — all data from DB, not invented
9. **Field completeness** — university name, major name, cutoffScores, matchScore, admissionTier, reason all present
10. **Empty handling** — emptyReason is meaningful when results=[]
