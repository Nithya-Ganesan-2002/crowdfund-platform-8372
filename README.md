# Crowdfund Platform - Backend (Express)

This backend provides REST APIs for:
- User authentication (register/login/JWT)
- Project CRUD (create, list, get, update, delete)
- Pledges and Stripe payment intents (create intent, confirm, list pledges by project)
- Health check and OpenAPI docs at `/docs`

## Environment Variables

Copy `.env.example` to `.env` and set values:
- Server: `PORT`, `HOST`, `CORS_ORIGIN`
- JWT: `JWT_SECRET`, `JWT_EXPIRES_IN`
- PostgreSQL: either `POSTGRES_URL` or the discrete vars `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_SSL`
- Stripe: `STRIPE_SECRET_KEY`

## Run

Install dependencies and start:

```
npm install
npm run dev
```

Open API docs at:
```
http://localhost:3000/docs
```

## Notes

- Ensure the PostgreSQL schema includes tables: `users`, `projects`, `pledges` that match the minimal fields referenced in `src/models/*`.
- Set `STRIPE_SECRET_KEY` to a valid key to use payment endpoints.