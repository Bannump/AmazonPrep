# Firebase Setup Guide

This app uses Firebase Authentication and Firestore to store user-specific progress data.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click on **Google** provider
3. Enable it and set your support email
4. Save the changes

## Step 3: Create Firestore Database

1. Go to **Firestore Database** in Firebase Console
2. Click "Create database"
3. Start in **test mode** (for development) or **production mode** (for production)
4. Choose a location for your database

## Step 4: Get Your Firebase Config

1. Go to **Project Settings** (gear icon) > **General**
2. Scroll down to "Your apps"
3. Click the web icon (`</>`) to add a web app
4. Register your app with a nickname
5. Copy the Firebase configuration object

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env` in the project root (already done if you ran the copy command).
2. Open `.env` and replace the placeholders with values from your **Firebase config object** (from Step 4). Use this mapping:

| Firebase config key | → | `.env` variable |
|---------------------|---|------------------|
| `apiKey`            | → | `VITE_FIREBASE_API_KEY` |
| `authDomain`        | → | `VITE_FIREBASE_AUTH_DOMAIN` |
| `projectId`         | → | `VITE_FIREBASE_PROJECT_ID` |
| `storageBucket`     | → | `VITE_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | → | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId`             | → | `VITE_FIREBASE_APP_ID` |

3. Your `.env` should look like this (use your real values, no quotes):

```env
VITE_FIREBASE_API_KEY=AIzaSy...your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-actual-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123...
```

## Step 6: Set Firestore Security Rules (Important!)

Go to **Firestore Database** > **Rules** and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 7: Install Dependencies

```bash
npm install
```

## Step 8: Run the App

```bash
npm run dev
```

**Important:** Restart the dev server after creating or editing `.env`; Vite only reads env vars at startup.

## Troubleshooting

- **"auth/api-key-not-valid"** or **"Firebase is not configured"**: Copy `.env.example` to `.env`, fill in your real Firebase config, then restart the dev server (`npm run dev`).
- **"Firebase: Error (auth/unauthorized-domain)"**: Add your domain to Firebase Console > Authentication > Settings > Authorized domains
- **"Permission denied"**: Check your Firestore security rules
- **"Firebase app not initialized"**: Make sure your `.env` file has all the correct values and you restarted the dev server after changing it
- **Works on localhost but not on Vercel**: (1) Add all `VITE_FIREBASE_*` env vars in Vercel Project → Settings → Environment Variables, then redeploy. (2) Add your Vercel domain (e.g. `your-app.vercel.app`) to Firebase → Authentication → Authorized domains. (3) Ensure `vercel.json` includes the SPA `rewrites` so routes serve `index.html`.

## Production Deployment (Vercel)

1. **Environment variables**  
   In Vercel: Project → **Settings** → **Environment Variables**. Add each `VITE_FIREBASE_*` from your `.env` (see Step 5). Apply to **Production**, **Preview**, and **Development**. Redeploy after changing them.

2. **Firebase Authorized Domains**  
   Firebase Console → **Authentication** → **Settings** → **Authorized domains**. Add your Vercel domain(s), e.g. `your-project.vercel.app`. Wildcards are not supported—add each domain you use (production and any preview URLs if you sign in there).

3. **SPA routing**  
   `vercel.json` already includes rewrites so all routes serve `index.html`. No extra config needed.

4. **Deploy**  
   Push to your linked Git repo, or run `vercel` / `vercel --prod` from the project root.

When deploying elsewhere (Netlify, etc.): set the same env vars, add your domain to Firebase authorized domains, and configure SPA fallback to `index.html`.
