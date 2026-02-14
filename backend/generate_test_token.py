"""
Generate a test JWT token for API testing.

Run this after installing backend dependencies:
    cd backend
    venv\Scripts\activate
    python generate_test_token.py
"""
from jose import jwt
from datetime import datetime, timedelta

# Load secret from .env
SECRET_KEY = "sZAp8A6x8OH2Wi4ItyiiO0KSLrVo3KUyE3Z76XK_LEs"
ALGORITHM = "HS256"

# Create test token
payload = {
    "user_id": "test_user_123",
    "sub": "test_user_123",  # Alternative user ID field
    "exp": datetime.utcnow() + timedelta(days=7),
    "iat": datetime.utcnow(),
}

token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

print("=" * 80)
print("TEST JWT TOKEN GENERATED")
print("=" * 80)
print()
print("Token (valid for 7 days):")
print(f"Bearer {token}")
print()
print("=" * 80)
print("HOW TO USE:")
print("=" * 80)
print()
print("1. Copy the token above (including 'Bearer')")
print()
print("2. In Swagger UI (http://localhost:8000/docs):")
print("   - Click 'Authorize' button")
print("   - Paste the token")
print("   - Click 'Authorize'")
print()
print("3. In curl commands:")
print(f'   curl -H "Authorization: Bearer {token}" http://localhost:8000/api/v1/todos')
print()
print("=" * 80)
print("USER INFO IN TOKEN:")
print("=" * 80)
print(f"User ID: {payload['user_id']}")
print(f"Expires: {payload['exp']}")
print("=" * 80)
