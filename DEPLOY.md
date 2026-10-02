# Deployment

Free-tier deployment: **Vercel** (frontend) + **Render** (backend) + **MongoDB Atlas** (database) + **ImageKit** (image storage).

The backend is a long-running Express server rather than serverless, because
`sharp` and `express-fileupload` need it and Vercel's serverless functions cap
request bodies at ~4.5 MB — too small for the 20 MB uploads the create form invites.

---

## 1. Prerequisites

**MongoDB Atlas** — create a free M0 cluster, then:
- Database Access: add a user, copy the password
- Network Access: add `0.0.0.0/0` (Render's egress IPs are not static on the free tier)
- Copy the connection string, and append the database name: `...mongodb.net/pinterest`

**ImageKit** — from Developer Options → API Keys, copy the URL endpoint, public key, and private key.

---

## 2. Deploy the backend (Render)

New → Web Service → connect this repo.

| Setting | Value |
|---|---|
| Root Directory | `Backend` |
| Build Command | `npm install` |
| Start Command | `node index.js` |

Environment variables:

| Key | Value |
|---|---|
| `MONGO` | Atlas connection string, including `/pinterest` |
| `JWT_SECRET` | long random string — `openssl rand -base64 32` |
| `IK_URL_ENDPOINT` | `https://ik.imagekit.io/your_id` |
| `IK_PUBLIC_KEY` | from ImageKit |
| `IK_PRIVATE_KEY` | from ImageKit |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | placeholder for now — set in step 4 |

Do **not** set `PORT`; Render injects it.

Note the service URL, e.g. `https://your-api.onrender.com`.

> The `dev` script uses `--env-file=.env`, which is why the start command is
> plain `node index.js` — Render supplies env vars directly.

---

## 3. Deploy the frontend (Vercel)

New Project → import this repo.

| Setting | Value |
|---|---|
| Root Directory | `Client` |
| Framework Preset | Vite (auto-detected) |

Environment variables:

| Key | Value |
|---|---|
| `VITE_API_URL` | your Render URL, no trailing slash |
| `VITE_URL_IK_ENDPOINT` | `https://ik.imagekit.io/your_id` |

Note the deployment URL, e.g. `https://your-app.vercel.app`.

`VITE_*` values are inlined into the public bundle at build time. Never put the
ImageKit **private** key here — it belongs only on the backend.

---

## 4. Connect them

Go back to Render → Environment → set `CLIENT_URL` to your exact Vercel URL
(`https://your-app.vercel.app`, no trailing slash) and redeploy.

This closes the loop: the backend now allows that origin via CORS, and the
frontend knows where the API lives.

---

## 5. Seed the database (optional)

From your machine, with `Backend/.env` pointed at the Atlas cluster:

```bash
cd Backend && npm run seed
```

Creates 5 users, 10 boards, 25 pins, 50 comments. Every user's password is
`password123` — change or remove these before sharing the site publicly.

---

## Environment variables

**Backend**

| Key | Required | Default | Notes |
|---|---|---|---|
| `MONGO` | yes | — | Atlas connection string |
| `JWT_SECRET` | yes | — | signs auth tokens |
| `IK_URL_ENDPOINT` | yes | — | ImageKit endpoint |
| `IK_PUBLIC_KEY` | yes | — | ImageKit |
| `IK_PRIVATE_KEY` | yes | — | ImageKit, server-side only |
| `CLIENT_URL` | prod | `http://localhost:5173` | CORS origin, exact match |
| `NODE_ENV` | prod | — | `production` enables secure cookies |
| `PORT` | no | `3000` | injected by the host |

**Frontend**

| Key | Required | Default | Notes |
|---|---|---|---|
| `VITE_API_URL` | prod | `http://localhost:3000` | backend base URL |
| `VITE_URL_IK_ENDPOINT` | yes | — | ImageKit endpoint |

---

## Troubleshooting

**Login succeeds but every request after it returns 401.**
The auth cookie is being dropped. The frontend and backend are on different
sites, so the cookie needs `SameSite=None; Secure` — which the code sets only
when `NODE_ENV=production`. Confirm that variable is set on Render.

**CORS errors in the console.**
`CLIENT_URL` must match the frontend origin exactly: `https`, no trailing
slash, no path. Vercel preview deployments get their own URLs and will be
blocked, since only one origin is allowed.

**Logout appears to do nothing.**
`clearCookie` has to repeat the attributes the cookie was set with, otherwise
the browser keeps it. Both read from the same config, so this should only
appear if `NODE_ENV` changed between the login and the logout.

**First load after idle hangs ~30–60s.**
Render's free tier sleeps after 15 minutes of inactivity. The gallery skeleton
covers it. Upgrading or moving to Koyeb/Fly.io avoids the sleep.

**Images 404.**
`VITE_URL_IK_ENDPOINT` and the backend's `IK_URL_ENDPOINT` must point at the
same ImageKit account — pins store a path, not a full URL.

**Uploads fail on large files.**
Confirm the backend is on Render, not a serverless platform; the ~4.5 MB body
limit is the usual cause.

**Backend crashes on boot with "Missing publicKey during ImageKit initialization".**
The ImageKit client is constructed when the module loads, so a missing
`IK_PUBLIC_KEY` or `IK_PRIVATE_KEY` takes the server down at startup rather
than on first upload. Check those two variables are set on Render.

**Backend crashes on boot with a Mongoose `ReplicaSetNoPrimary` / IP whitelist error.**
Atlas is rejecting the connection. Confirm `0.0.0.0/0` is still in Network
Access — temporary entries expire, which also breaks local development.
