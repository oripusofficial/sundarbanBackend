# Sundarban API

Node.js and Express API with separate route groups for the public website and admin dashboard.

## Route Groups

```text
/api/web
/api/admin
```

## Gallery Endpoints

```text
GET    /api/web/gallery
GET    /api/web/gallery/:id

GET    /api/admin/gallery
GET    /api/admin/gallery/:id
POST   /api/admin/gallery
PATCH  /api/admin/gallery/:id
DELETE /api/admin/gallery/:id
```

Use `multipart/form-data` for `POST /api/admin/gallery`.

```text
image       image file, required
title       text, required
altText     text
description text
category    text
sortOrder   number
isActive    boolean
```

## Commands

```bash
npm install
npm run dev
npm start
```

Copy `.env.example` to `.env` when local environment values are needed.
