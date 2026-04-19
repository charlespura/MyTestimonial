# React + Firebase Firestore + Tailwind (Testimonials)

This app posts and displays testimonials using a Firestore collection named `testimonials`.

## Fields

- `name` (optional)
- `rating` (required, 1–5; 5 is highest)
- `message` (required)
- `role` (default: `Student`)
- `headline` (optional)
- `createdAt` (server timestamp)

## Setup

1. Create a Firebase project → add a **Web App** → copy the config values.
2. Create a local env file:

   ```bash
   cp .env.example .env
   ```

3. Fill in `.env` with your Firebase values.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

Opening Firestore will show your existing collections untouched; this app only adds/uses `testimonials`.

## Important notes

- GitHub Pages cannot run PHP. If you deploy on GitHub Pages, use the Firebase client SDK (this app) and Firestore security rules.
- Firebase web config (including the API key) is not a “server secret” — it will be visible in the built JS. Security must be enforced with Firestore rules (and optionally App Check).

## Firestore rules (example)

Use your own rules. This is a simple starting point:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /testimonials/{doc} {
      allow read: if true;
      allow create: if request.resource.data.message is string
        && request.resource.data.message.size() > 0
        && request.resource.data.rating in [1,2,3,4,5];
      allow update, delete: if false;
    }
  }
}
```

## GitHub Pages env via Secrets (optional)

If you use GitHub Actions for Pages, add repository secrets like `VITE_FIREBASE_API_KEY`, then use a workflow step to write `.env.production` during the build.

