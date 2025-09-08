# LTI Integration Setup Guide

This guide explains how to set up LTI (Learning Tools Interoperability) integration for the Citation & Bibliography Manager.

## Architecture Overview

The LTI implementation is cleanly separated from the core citation app:

- **Core App**: Your existing citation manager (unchanged)
- **LTI Layer**: Separate middleware that handles LTI authentication and launches
- **Bridge**: Minimal integration that provides LTI context to the app

## Setup Steps

### 1. Environment Configuration

1. Copy `.env.example` to `.env`
2. Update the environment variables:

```bash
# Replace with your LMS platform details
LTI_PLATFORM_URL=https://your-lms.instructure.com
LTI_PLATFORM_NAME="Your LMS Name"
LTI_CLIENT_ID=your-client-id-from-lms

# Update with your actual app URL
LTI_LAUNCH_URL=https://your-app.vercel.app/lti/launch
LTI_OIDC_URL=https://your-app.vercel.app/lti/login
LTI_PUBLIC_JWK_URL=https://your-app.vercel.app/lti/keys

# Generate a strong encryption key
LTI_ENCRYPTION_KEY=your-very-secure-random-key-here
```

### 2. LMS Platform Registration

#### Canvas Instructions:

1. Go to Admin → Developer Keys
2. Click "+ Developer Key" → "LTI Key"
3. Configure the key:
   - **Key Name**: Citation & Bibliography Manager
   - **Owner Email**: your-email@domain.com
   - **Redirect URLs**: `https://your-app.vercel.app/lti/launch`
   - **Method**: Manual Entry
   - **Title**: Citation Manager
   - **Description**: Create and manage citations in multiple formats
   - **Target Link URI**: `https://your-app.vercel.app/lti/launch`
   - **OpenID Connect Initiation Url**: `https://your-app.vercel.app/lti/login`
   - **JWK Method**: Public JWK URL
   - **Public JWK URL**: `https://your-app.vercel.app/lti/keys`

4. Configure Placements:
   - **Assignment Selection**: Enable
   - **Link Selection**: Enable  
   - **Course Navigation**: Enable (optional)

5. Save and note the generated **Client ID**

### 3. Deployment

1. Deploy to Vercel with environment variables:

```bash
vercel env add LTI_PLATFORM_URL
vercel env add LTI_CLIENT_ID
vercel env add LTI_ENCRYPTION_KEY
# ... add all other LTI_* variables
```

2. Or add them through Vercel dashboard under Settings → Environment Variables

### 4. Testing

1. In your LMS, create an assignment or add an external tool
2. Configure it to use your LTI tool
3. Launch the tool - you should see:
   - LTI context banner at the top
   - User information from the LMS
   - Full citation manager functionality

## LTI Endpoints

Your app provides these LTI endpoints:

- `GET/POST /lti/login` - OIDC login initiation
- `POST /lti/launch` - LTI launch endpoint
- `GET /lti/keys` - Public JWK key set
- `GET /lti/config` - Tool configuration JSON

## How It Works

1. **LMS Launch**: User clicks the tool in their LMS
2. **OIDC Login**: LMS redirects to `/lti/login`
3. **Authentication**: App redirects to LMS for authentication
4. **Launch**: LMS posts back to `/lti/launch` with user data
5. **Context**: App stores LTI context and shows the tool
6. **Bridge**: LTI context is available to the app via stores

## Customization

### User-Specific Storage

The LTI integration provides user-specific storage:

```typescript
import { getLTIStorageKey } from '$lib/lti/context';

// Get user-specific storage key
const storageKey = getLTIStorageKey('citations', $ltiContext?.user.id);
```

### Role-Based Features

```typescript
import { ltiContext } from '$lib/lti/context';

// Check user role
$: if ($ltiContext?.isInstructor) {
  // Show instructor-only features
}
```

## Database Configuration (Production)

For production, replace the memory database in `src/lib/lti/provider.ts`:

```typescript
// Replace this:
await this.ltiProvider.setup('mongodb://localhost:27017/ltidb', {
  plugin: lti.MemoryDb
});

// With a real database:
await this.ltiProvider.setup(process.env.LTI_DATABASE_URL);
```

## Security Notes

- The encryption key should be a strong, random string
- All communication happens over HTTPS
- LTI tokens are validated before use
- Session data is stored in httpOnly cookies

## Troubleshooting

1. **Launch fails**: Check that all environment variables are set
2. **Authentication issues**: Verify the Client ID matches your LMS registration
3. **Key errors**: Ensure the JWK endpoint is accessible
4. **CORS issues**: LTI launches should work in iframes, but test in different browsers