# Email Verification Setup Guide

## Overview
This guide will help you set up the complete email verification system for CV Maker.

## Backend Setup ✅

### 1. Environment Configuration
The backend is already configured with email verification. Update your `.env.local` file:

```env
# Email Configuration
APP_EMAIL=your-email@gmail.com
APP_PASSWORD=your-app-specific-password  # Use Gmail App Password
```

### 2. Gmail App Password Setup
1. Go to your Google Account settings
2. Enable 2-factor authentication
3. Go to "App passwords" section
4. Generate a new app password for "CV Maker"
5. Use this password in `APP_PASSWORD`

### 3. Backend Dependencies
All required dependencies are already installed:
- `nodemailer` - Email sending
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT tokens
- `mongoose` - Database

## Frontend Setup ✅

### 1. Components Created
- `EmailVerification.tsx` - Verification code input component
- Updated `RegisterPage.tsx` - Shows verification step after registration
- Enhanced `useAuth.ts` - Added verification methods

### 2. API Integration
- Verification endpoints are properly connected
- Type-safe API calls with TypeScript
- Error handling and user feedback

## Complete Flow

### Registration Flow:
1. **User registers** → Account created, verification code sent
2. **Email sent** → 6-digit code (expires in 15 minutes)
3. **User enters code** → Email verified, auto-login
4. **Redirect to dashboard** → Full access granted

### API Endpoints:
- `POST /api/auth/signup` - Create account
- `POST /api/auth/verify-email` - Verify email with code
- `POST /api/auth/resend-verification` - Resend verification code

## Testing the System

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Registration
1. Go to `http://localhost:5173/register`
2. Enter email and password
3. Check email for 6-digit code
4. Enter code to verify
5. Should redirect to dashboard

## Features Included

### ✅ Email Verification
- 6-digit verification codes
- 15-minute expiry
- Resend functionality
- Beautiful UI with glass morphism

### ✅ Security
- Password hashing with bcrypt
- JWT authentication
- Input validation
- Error handling

### ✅ User Experience
- Loading states
- Error messages
- Success notifications
- Responsive design

### ✅ Backend Features
- Email templates
- Verification code generation
- User model with verification fields
- API documentation (Swagger)

## Troubleshooting

### Email Not Sending:
1. Check Gmail app password setup
2. Verify `APP_EMAIL` and `APP_PASSWORD` in `.env.local`
3. Check console for email errors

### Verification Code Invalid:
1. Check if code expired (15 minutes)
2. Verify email address format
3. Check backend logs for errors

### Frontend Issues:
1. Check API client configuration
2. Verify TypeScript types
3. Check browser console for errors

## Production Deployment

For production deployment:

1. **Email Service**: Consider using SendGrid, AWS SES, or similar
2. **Environment Variables**: Use secure environment variable management
3. **Rate Limiting**: Add rate limiting to email endpoints
4. **Monitoring**: Add email delivery monitoring

## Files Modified/Created

### Backend:
- ✅ `controller/auth.js` - Verification endpoints (already existed)
- ✅ `service/user.js` - Verification logic (already existed)
- ✅ `lib/email-api.js` - Email sending (already existed)
- ✅ `models/user.js` - Verification fields (already existed)
- ✅ `validator/auth.js` - Input validation (already existed)

### Frontend:
- ✅ `components/auth/EmailVerification.tsx` - New component
- ✅ `pages/auth/RegisterPage.tsx` - Updated with verification
- ✅ `hooks/useAuth.ts` - Added verification methods
- ✅ `types/api.ts` - Added verification types

The system is **fully functional** and ready to use! 🎉
