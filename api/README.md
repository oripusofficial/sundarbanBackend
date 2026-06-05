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

## Tour Package Endpoints

```text
GET    /api/web/packages
GET    /api/web/packages/:slug

GET    /api/admin/packages
GET    /api/admin/packages/:id
POST   /api/admin/packages
PATCH  /api/admin/packages/:id
DELETE /api/admin/packages/:id
```

Public package endpoints only return records where `isActive` is true.
`GET /api/web/packages` returns basic list/card data only. Use
`GET /api/web/packages/:slug` for the full package detail.

Supported public filters:

```text
category  string
featured  boolean
```

Use `multipart/form-data` for `POST /api/admin/packages` and for `PATCH /api/admin/packages/:id` when replacing the cover image.

```text
image               image file, required on create
title               text, required
slug                text, required
shortTitle          text
description         text, required
price               number, required
priceLabel          text, required
priceUnit           text
isAllInclusive      boolean
advancePaymentLabel text
duration            text, required
groupSize           text
category            text
featured            boolean
sortOrder           number
isActive            boolean
highlights          JSON string array
itinerary           JSON array: [{"dayCount":1,"time":"5:00 AM","activity":"Departure"}]
imageAlt            text
metaTitle           text
metaDescription     text
```

Seed current live package content:

```bash
npm run seed:packages
```

## Commands

```bash
npm install
npm run dev
npm start
```

Copy `.env.example` to `.env` when local environment values are needed.
