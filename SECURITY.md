# Security Features & Implementation

## 🔐 Admin System Security

### Admin Access Control
- **Approved Emails Only**: Only `wangharrison2009@gmail.com` and `givingtreenonprofit@gmail.com` can have admin privileges
- **Role Hierarchy**: 
  - `wangharrison2009@gmail.com` → SUPER_ADMIN (highest privileges)
  - `givingtreenonprofit@gmail.com` → ADMIN (event management)
  - All others → USER (standard access)

### Admin Panel Features
- **Event Creation**: Only admins can create events via `/api/admin/events`
- **Event Management**: View all events (including inactive ones)
- **Security Headers**: All admin endpoints include security headers
- **Audit Logging**: All admin actions are logged with timestamps and user IDs

## 🛡️ Authentication Security

### Account Protection
- **Account Lockout**: 5 failed login attempts locks account for 30 minutes
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **JWT Tokens**: Secure token-based authentication
- **Active Account Check**: Deactivated accounts cannot login

### Security Validations
- **Token Verification**: All protected routes verify JWT tokens
- **Admin Verification**: Dual verification (JWT + admin email check)
- **Session Tracking**: Last login timestamps and attempt counters

## 🚫 Rate Limiting

### API Protection
- **Comment Posting**: 10 comments per 10 minutes per user
- **Like Actions**: 30 likes per 10 minutes per user
- **Admin Events**: 10 event creations per hour per IP
- **Contact Form**: Rate limited to prevent spam
- **Email Sending**: Rate limited for donation and contact emails

### Implementation
- Redis-based rate limiting (falls back gracefully if Redis unavailable)
- Per-user and per-IP tracking
- Configurable limits and time windows

## 🔍 Input Validation & Sanitization

### Data Validation
- **Event Data**: Title (200 chars), description (1000 chars), content (5000 chars)
- **Comment Content**: 1000 character limit, script tag removal
- **Email Validation**: Proper email format checking
- **URL Validation**: Only HTTP/HTTPS URLs allowed for images

### Security Measures
- **SQL Injection**: Prevented via Prisma ORM parameterized queries
- **XSS Prevention**: Input sanitization and output encoding
- **CSRF Protection**: Secure headers and token validation
- **Content Security**: Script tag filtering in user content

## 🌐 API Security

### Endpoint Protection
- **Authentication Required**: All write operations require valid JWT
- **Role-Based Access**: Admin endpoints verify admin status
- **Input Validation**: Comprehensive validation on all inputs
- **Error Handling**: Generic error messages to prevent information leakage

### Security Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

## 💾 Database Security

### Data Protection
- **Active User Filtering**: Only active users can perform actions
- **Soft Deletes**: Account deactivation instead of deletion
- **Relationship Integrity**: Cascade deletes for data consistency
- **Connection Security**: Encrypted database connections

### Privacy Measures
- **Password Exclusion**: Passwords never returned in API responses
- **Selective Data**: Only necessary fields exposed in API responses
- **User Isolation**: Users can only access their own data

## 🔄 Event System Security

### Content Management
- **Admin-Only Creation**: Only verified admins can create events
- **Content Validation**: Strict validation on all event fields
- **Image URL Validation**: Only valid HTTP/HTTPS URLs accepted
- **Active Event Filtering**: Public APIs only show active events

### Comment & Like Security
- **User Verification**: Only active, authenticated users can interact
- **Rate Limiting**: Prevents spam and abuse
- **Content Sanitization**: Removes malicious scripts from comments
- **Cascade Deletion**: Proper cleanup when events/users are removed

## 🚨 Security Monitoring

### Audit Logging
- **Admin Actions**: All admin activities logged with context
- **Failed Logins**: Tracked and logged for security monitoring
- **Rate Limit Violations**: Logged for abuse detection
- **Error Tracking**: Comprehensive error logging without sensitive data

### Security Events
- **Account Lockouts**: Logged with user ID and timestamp
- **Admin Access**: Logged when admin privileges are used
- **Suspicious Activity**: Multiple failed attempts, unusual patterns

## 🔧 Deployment Security

### Environment Variables
- **Secret Management**: All secrets in environment variables
- **Database URLs**: Secure connection strings
- **JWT Secrets**: Strong, unique secret keys
- **Email Credentials**: Secure app passwords (not regular passwords)

### Production Checklist
- [ ] Strong JWT secret (min 32 characters)
- [ ] Secure database connection (SSL enabled)
- [ ] Redis connection secured (if used)
- [ ] Gmail app passwords configured
- [ ] All environment variables set in hosting platform
- [ ] HTTPS enforced
- [ ] Security headers configured

## 🛠️ Setup Instructions

### 1. Database Setup
```bash
# Push schema with new security fields
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### 2. Admin Setup
```bash
# Run admin setup script (after users register)
npm run setup-admin
```

### 3. Environment Variables
```env
POSTGRES_PRISMA_URL="your-secure-database-url"
NEXTAUTH_SECRET="your-strong-jwt-secret-min-32-chars"
REDIS_URL="your-redis-url" # Optional
GMAIL_USER="your-admin-email@gmail.com"
GMAIL_APP_PASSWORD="your-gmail-app-password"
```

### 4. Verification
- Admin users register normally
- Run setup script to grant admin roles
- Test admin panel access in dashboard
- Verify event creation works for admins only

## ⚠️ Security Considerations

### Known Limitations
- Email domain verification relies on hardcoded list
- Redis fallback means some rate limiting may be bypassed
- Client-side role checks are for UX only (server-side is authoritative)

### Best Practices
- Regularly rotate JWT secrets
- Monitor admin action logs
- Review rate limiting effectiveness
- Update dependency security patches
- Regular security audits of admin actions

### Incident Response
1. **Suspicious Activity**: Check logs for patterns
2. **Account Compromise**: Deactivate account, reset password
3. **Admin Abuse**: Revoke admin role, investigate actions
4. **Rate Limit Bypass**: Implement additional controls
5. **Data Breach**: Follow data protection protocols

## 📞 Security Contact
For security concerns or vulnerabilities, contact the site administrators through the approved admin emails.
