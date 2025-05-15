# OAuth Redirect Configuration Guide

This guide explains how to properly configure OAuth redirects for your application in both development and production environments.

## The Problem

When using OAuth providers like Google or GitHub with Supabase authentication, the redirect URL needs to be properly configured to ensure users are redirected back to your application after successful authentication.

In development, this is typically `http://localhost:3000`, but in production, it needs to be your deployed URL (e.g., `https://your-app.vercel.app`).

## The Solution

We've implemented a solution that automatically detects the correct URL to use for redirects based on the environment:

1. In development, it uses `window.location.origin` (typically `http://localhost:3000`)
2. In production on Vercel, it uses the `VERCEL_URL` environment variable
3. If you have a custom domain, you can set `NEXT_PUBLIC_SITE_URL` in your environment variables

## Configuration Steps

### 1. Vercel Project Configuration

If you're using Vercel for deployment, make sure your project has the correct environment variables:

1. Go to your Vercel project dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Make sure the following variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - (Optional) `NEXT_PUBLIC_SITE_URL` if you're using a custom domain

### 2. Supabase Configuration

You also need to configure the allowed redirect URLs in your Supabase project:

1. Go to your Supabase dashboard
2. Navigate to "Authentication" > "URL Configuration"
3. Add your production URL to the "Site URL" field (e.g., `https://your-app.vercel.app`)
4. Under "Redirect URLs", add both your development and production URLs:
   - `http://localhost:3000/auth?provider=google`
   - `http://localhost:3000/auth?provider=github`
   - `https://your-app.vercel.app/auth?provider=google`
   - `https://your-app.vercel.app/auth?provider=github`
   - If you have a custom domain, add those URLs as well

### 3. OAuth Provider Configuration

For Google OAuth:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your project > "APIs & Services" > "Credentials"
3. Edit your OAuth 2.0 Client ID
4. Under "Authorized redirect URIs", add:
   - `https://jjzwaflmasypriukapfl.supabase.co/auth/v1/callback`

For GitHub OAuth:

1. Go to your GitHub account settings
2. Navigate to "Developer settings" > "OAuth Apps"
3. Edit your OAuth App
4. Under "Authorization callback URL", add:
   - `https://jjzwaflmasypriukapfl.supabase.co/auth/v1/callback`

## Testing

After making these changes:

1. Deploy your application to Vercel
2. Test the Google login flow in your production environment
3. Verify that after successful authentication, you are redirected to your dashboard page and not to localhost

## Troubleshooting

If you're still experiencing issues:

1. Check the browser console for any errors
2. Verify that all environment variables are correctly set
3. Make sure all redirect URLs are properly configured in Supabase and your OAuth providers
4. Clear your browser cache and cookies before testing again
