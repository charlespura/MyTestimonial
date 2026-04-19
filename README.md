# Testimonials — Charles Pura (React + Firestore + Tailwind)

Posts and displays testimonials using Firebase Firestore collection `testimonials` (it does not delete/modify your other existing collections).

Site: https://cpportfolio.onrender.com/

## Data saved to Firestore

Collection: `testimonials`

- `name` (required; “Nickname”)
- `rating` (required; integer 1–5, where 5 is highest)
- `message` (required)
- `role` (default: `Student`)
- `headline` (optional)
- `createdAt` (server timestamp)

## Local setup

1. Install:

   ```bash
   npm install
   ```

2. Create env file:

   ```bash
   cp .env.example .env
   ```

3. Fill `.env` with your Firebase Web App config values.
4. Run dev server:

   ```bash
   npm run dev
   ```

## Security / privacy notes (important)

- Firebase config values in `.env` are used in the browser and will be included in the built JS. They are not “server secrets”.
- Data is sent over HTTPS and stored in Firestore. This is not end-to-end encrypted content.
- Do not submit sensitive info (passwords, OTPs, bank details, government IDs, etc.).
- Protect your data with Firestore Security Rules (and optionally Firebase App Check).

## Firestore rules (starter example)

Adjust these rules for your needs:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /testimonials/{doc} {
      allow read: if true;
      allow create: if request.resource.data.name is string
        && request.resource.data.name.size() > 0
        && request.resource.data.message is string
        && request.resource.data.message.size() > 0
        && request.resource.data.rating in [1,2,3,4,5];
      allow update, delete: if false;
    }
  }
}
```

## Deploy to GitHub Pages

This repo includes a workflow in `.github/workflows/deploy.yml`.

1. In your GitHub repo, add these **Repository secrets**:

   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET` (optional)
   - `VITE_FIREBASE_MESSAGING_SENDER_ID` (optional)
   - `VITE_FIREBASE_MEASUREMENT_ID` (optional)

2. GitHub repo settings:
   - Settings → Pages → Build and deployment → Source: **GitHub Actions**
3. Push to `main` to deploy.
