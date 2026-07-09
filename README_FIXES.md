# Fixes applied

## App-breaking bugs (would crash or silently misbehave)
1. **`authenticate_user` returned a raw JWT dict**, but every route treated
   `current_user` as a `UserSchema` and did `current_user.id`. That would
   `AttributeError` on literally every authenticated request. Now it decodes
   the token, looks up the real user row, and returns that.
2. **`TodoSchema` had no `deleted_at` column**, but every todo route filtered
   on `TodoSchema.deleted_at.is_(None)`. Added the column.
3. **`TodoSchema` was missing `priority`, `due_date`, `category`, `tags`,
   `reminder`, `notes`** even though `CreateTodo`/`TodoResponse` and the
   routes expected them. Added all six columns.
4. **`create_todo` / `update_todo` only ever set `content`/`is_completed`**,
   silently dropping the rest of the payload. Now all fields are saved.
5. **The `confirm_password` validator in `Register` was defined outside the
   class** (bad indentation), so it was dead code — passwords could mismatch
   with no error. Moved inside the class and fixed it (it also used to
   `return None`, which would have wiped the field).
6. **`decode_access_token` converted JWT errors to `ValueError`**, but
   `dependencies.py` caught `jwt.exceptions.InvalidTokenError` — a bad/expired
   token caused an unhandled 500 instead of a 401. Now it lets the real jwt
   exceptions propagate and the dependency catches them properly.
7. **`requirements.txt` never actually listed `passlib` or `PyJWT`**, both of
   which `helper.py` imports directly (it had an unrelated `pwdlib` package
   instead). Added `passlib`, `bcrypt`, `PyJWT`; removed unused/junk entries
   (`fastar`, `detect-installer`, `argon2-cffi*`, `sentry-sdk`, etc).

## Security issues
8. **JWTs embedded the user's hashed password** (`create_access_token({"email":
   ..., "password": ...})`). Anyone who decoded the token (e.g. jwt.io) could
   read the password hash. Token now only carries `email`.
9. **CORS used `allow_origins=["*"]` with `allow_credentials=True`** — this
   combination is invalid per spec and browsers reject it outright. Switched
   to an explicit origin list (edit to match your actual frontend).
10. `.env` had inline `# comments` directly after values on the same line,
    which is fragile with dotenv parsers. Cleaned up.

## Smaller cleanups
- `db.py` imported `declarative_base` from the deprecated
  `sqlalchemy.ext.declarative`; switched to `sqlalchemy.orm`.
- Removed `datetime.utcnow()` (deprecated) in favor of
  `datetime.now(timezone.utc)`.
- `app_config.py` switched from the old pydantic v1-style `class Config` to
  `model_config = SettingsConfigDict(...)`.
- `alembic.ini` pointed at a MySQL URL that didn't match the app's default
  sqlite DB — aligned them (swap back to MySQL if that's what you actually run).
- Unused import `from sqlalchemy import values` removed from `auth.py` model.

## Note on `requirements.txt` versions
I fixed the *missing/wrong packages*, but I didn't re-verify every single
version pin against what's actually on PyPI today — a couple of the original
pins looked slightly off (e.g. `starlette==1.3.1` doesn't correspond to a real
release). If `pip install -r requirements.txt` complains about a specific
version, just drop the `==x.y.z` for that package and let pip resolve it.
