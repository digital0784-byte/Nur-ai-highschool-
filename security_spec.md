# SECURITY SPECIFICATION: NUR AI HIGH SCHOOL (PART 8)

## 1. Core Data Invariants & Access Control Policy

1. **Global Default Deny**: Any path or collection not explicitly authorized is denied by default (`match /{document=**} { allow read, write: if false; }`).
2. **Identity Integrity**:
   - Students can only read and write their own private records (`userId == request.auth.uid`).
   - Students cannot self-elevate their role (e.g., cannot set `role: 'admin'` or `role: 'teacher'`).
   - All document updates must preserve immutable author/owner and creation timestamps.
3. **Curriculum Master Gate**:
   - Students have strictly read-only access to **published** curriculum units, topics, questions, and knowledge maps (`status == 'published'`).
   - Only authenticated `ADMIN` users can create, update, delete, or change the publication status of curriculum items.
4. **Academic & Classroom Partitioning**:
   - Teachers can only read, grade, or manage classrooms, sections, and enrollments where they are an assigned instructor (`teacherId == request.auth.uid` or within `teacherIds`).
   - Teachers cannot access, inspect, or modify another teacher's unassigned classes or unrelated student records.
5. **Assessment & Grading Integrity**:
   - Students can only submit their own quiz/exam attempts (`studentUid == request.auth.uid`).
   - Once an exam/quiz attempt status is set to `'graded'` or `'completed'`, students cannot alter answers, scores, or timestamps.
6. **Audit & Traceability**:
   - All security-relevant administrative, role modification, curriculum publishing, and grading events generate immutable audit records in `audit_logs`.
   - `audit_logs` are read-only to verified `ADMIN` users and immutable/non-deletable by regular users.
7. **Zero Client Secrets & App Check**:
   - Gemini, OpenAI, YouTube, and Firebase Admin credentials reside exclusively in the secure Node.js backend.
   - All sensitive endpoints enforce Firebase App Check token verification and sliding-window rate limiting.

---

## 2. The "Dirty Dozen" Adversarial Attack Payloads

| ID | Attack Name | Target Collection | Vector Description | Expected Result |
|---|---|---|---|---|
| **D01** | Student Privilege Escalation | `/users/{studentUid}` | Student sends `role: 'admin'` or `role: 'teacher'` on registration or profile update. | **PERMISSION_DENIED** |
| **D02** | Cross-Student PII Scraping | `/users/{otherStudentUid}` | Student A attempts direct `get()` or `list()` on Student B's private user document. | **PERMISSION_DENIED** |
| **D03** | Unauthorized Curriculum Tampering | `/curriculum_units/{unitId}` | Student attempts to `update()` or `create()` a curriculum unit or alter lesson contents. | **PERMISSION_DENIED** |
| **D04** | Draft Curriculum Leakage | `/curriculum_units/{unitId}` | Student attempts to query or read a curriculum unit where `status: 'draft'`. | **PERMISSION_DENIED** |
| **D05** | Unauthorized Class Snoop | `/classes/{classId}` | Teacher A attempts to modify or inspect records of Class B taught exclusively by Teacher B. | **PERMISSION_DENIED** |
| **D06** | Student Impersonation in Progress | `/student_progress/{docId}` | Student A creates a progress doc where `userId: studentB_uid` to falsify learning records. | **PERMISSION_DENIED** |
| **D07** | Post-Completion Quiz Mutation | `/quiz_attempts/{attemptId}` | Student modifies submitted answers after the quiz status is transitioned to `'completed'`. | **PERMISSION_DENIED** |
| **D08** | Audit Log Deletion / Tampering | `/audit_logs/{logId}` | Attacker attempts to `delete()` or `update()` an administrative audit trail record. | **PERMISSION_DENIED** |
| **D09** | Broadcast Notification Spoofing | `/notifications/{notifId}` | Student calls `create()` with `recipientRole: 'all'` to send unauthorized spam. | **PERMISSION_DENIED** |
| **D10** | Storage Path Traversal & Theft | `/profile_images/{victimId}/pic`| Attacker uploads to another user's profile image directory. | **PERMISSION_DENIED** |
| **D11** | Backend App Check Token Forgery | `/api/admin/publish-curriculum` | Client makes sensitive administrative API call with missing or invalid `X-Firebase-AppCheck`. | **HTTP 401 UNAUTHORIZED** |
| **D12** | Excessive Rate Attack (DoS/Wallet) | `/api/ai/socratic-tutor` | Automated bot fires 100 rapid requests in 5 seconds to drain AI quota. | **HTTP 429 TOO_MANY_REQUESTS** |

---

## 3. Test Runner Mapping

The above test vectors are verified deterministically through:
1. `firestore.rules.test.ts` (unit tests against the security rules schema)
2. `server.security.test.ts` (backend middleware, rate limiting, and RBAC endpoint validation)
3. The in-app automated test runner mounted on `AdminSecurityDashboard.tsx` via `POST /api/security/verify-e2e`.
