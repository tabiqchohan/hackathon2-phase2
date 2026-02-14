# JWT Configuration Guide

## JWT Secret Key Kaise Generate Karein

### Method 1: Python se Generate Karein (Recommended)

```python
import secrets

# Generate a secure random secret key (32 bytes = 256 bits)
secret_key = secrets.token_urlsafe(32)
print(f"JWT_SECRET_KEY={secret_key}")
```

**Run karein:**
```bash
python -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_urlsafe(32))"
```

### Method 2: OpenSSL se Generate Karein

```bash
# Generate 32 bytes random key
openssl rand -base64 32
```

### Method 3: Online Generator (Development Only)

Development ke liye aap online tools use kar sakte hain:
- https://generate-secret.vercel.app/32
- https://randomkeygen.com/

**⚠️ Warning**: Production mein kabhi online generated keys use na karein!

---

## JWT Algorithm Kya Hai?

JWT Algorithm wo method hai jo token ko sign karne ke liye use hota hai.

### Common Algorithms:

1. **HS256 (HMAC with SHA-256)** - Recommended for this project
   - Symmetric algorithm (same key for signing and verification)
   - Fast and simple
   - Secret key se sign aur verify dono hote hain
   - **Use this if**: Backend khud tokens verify kar raha hai

2. **RS256 (RSA with SHA-256)**
   - Asymmetric algorithm (private key for signing, public key for verification)
   - More secure but slower
   - Private/Public key pair chahiye
   - **Use this if**: Multiple services tokens verify kar rahi hain

### Is Project Ke Liye:

```env
JWT_ALGORITHM=HS256
```

**Kyun HS256?**
- Simple setup
- Better Auth typically HS256 use karta hai
- Backend khud tokens verify kar raha hai
- Fast performance

---

## Better Auth Ke Saath Integration

### Important: Better Auth Configuration

Aapka backend **Better Auth se issued tokens ko verify** kar raha hai, isliye:

1. **JWT_SECRET_KEY** Better Auth ke configuration se match hona chahiye
2. **JWT_ALGORITHM** Better Auth jo use kar raha hai wahi hona chahiye

### Better Auth Setup:

Better Auth mein typically ye configuration hota hai:

```javascript
// Better Auth configuration (frontend/backend)
export const authConfig = {
  secret: process.env.AUTH_SECRET, // Ye wahi secret hai
  jwt: {
    algorithm: 'HS256', // Default algorithm
    expiresIn: '7d', // Token expiry
  }
}
```

### Steps:

1. **Better Auth Setup Karein** (agar nahi kiya):
   ```bash
   npm install better-auth
   ```

2. **Secret Generate Karein**:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

3. **Dono Jagah Same Secret Use Karein**:
   - Better Auth config mein: `AUTH_SECRET=<generated-key>`
   - Backend .env mein: `JWT_SECRET_KEY=<same-generated-key>`

---

## Current Configuration Check

Aapki current `.env` file mein:

```env
JWT_SECRET_KEY=your-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
```

### ⚠️ Action Required:

1. **Secure Secret Generate Karein**:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

2. **Backend .env Update Karein**:
   ```env
   JWT_SECRET_KEY=<generated-secure-key>
   JWT_ALGORITHM=HS256
   ```

3. **Better Auth Mein Same Secret Use Karein**

---

## Testing Ke Liye

Agar aap sirf backend test karna chahte hain (without Better Auth):

### Manual JWT Token Generate Karein:

```python
from jose import jwt
from datetime import datetime, timedelta

# Your secret key
SECRET_KEY = "your-secret-key-change-this-in-production"
ALGORITHM = "HS256"

# Create token
payload = {
    "user_id": "test_user_123",
    "exp": datetime.utcnow() + timedelta(days=7)
}

token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
print(f"Test Token: {token}")
```

**Run karein**:
```bash
cd backend
python -c "
from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = 'your-secret-key-change-this-in-production'
ALGORITHM = 'HS256'

payload = {
    'user_id': 'test_user_123',
    'exp': datetime.utcnow() + timedelta(days=7)
}

token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
print('Bearer ' + token)
"
```

Is token ko Swagger UI mein use kar sakte hain testing ke liye!

---

## Security Best Practices

1. ✅ **Strong Secret**: Minimum 32 bytes random key
2. ✅ **Never Commit**: `.env` file ko git mein commit na karein
3. ✅ **Different Keys**: Development aur production mein alag keys
4. ✅ **Rotate Keys**: Regularly secret keys change karein
5. ✅ **Environment Variables**: Secrets ko environment variables mein store karein

---

## Quick Commands

```bash
# Generate secure secret
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Generate test JWT token
cd backend
python -c "from jose import jwt; from datetime import datetime, timedelta; print('Bearer ' + jwt.encode({'user_id': 'test_user', 'exp': datetime.utcnow() + timedelta(days=7)}, 'your-secret-key-change-this-in-production', algorithm='HS256'))"
```

---

## Summary

1. **JWT_SECRET_KEY**: Random secure string (32+ bytes)
2. **JWT_ALGORITHM**: HS256 (recommended for this project)
3. **Better Auth Integration**: Same secret dono jagah use karein
4. **Testing**: Manual token generate kar sakte hain
