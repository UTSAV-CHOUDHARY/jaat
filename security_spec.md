# Security Specification - ZenTask Pro

## Data Invariants
1. A task must belong to the authenticated user's subcollection.
2. Users can only read and write their own data.
3. Task priorities must be 'low', 'medium', or 'high'.
4. Timestamps must be handled securely.

## The Dirty Dozen Payloads (Unauthorized)
1. Write task to another user's path.
2. Read tasks of another user.
3. Update `id` task field (immutable).
4. Create task with 1MB title string.
5. Set `streak` manually to 999999 in stats.
6. Delete another user's stats document.
7. Create task without required 'category' field.
8. Injection of script tags into task titles.
9. List all user IDs in the system.
10. Update `createdAt` after creation.
11. Set priority to 'critical' (invalid enum).
12. Anonymous write (only verified Google users allowed).

## Test Runner Logic
The `firestore.rules` will enforce that `request.auth.uid == userId` for all paths starting with `/users/{userId}/`.
