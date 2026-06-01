# IrrWMS API Reference

Base URL: `{NEXT_PUBLIC_APP_URL}/api/v1`

All authenticated endpoints require a valid NextAuth session cookie unless noted.

## Response format

### Success

```json
{
  "success": true,
  "data": {},
  "message": "Optional message",
  "meta": {}
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": {}
  }
}
```

## Authentication

| Method     | Path                    | Description                                       |
| ---------- | ----------------------- | ------------------------------------------------- |
| `GET/POST` | `/auth/[...nextauth]`   | NextAuth v5 handlers (sign-in, sign-out, session) |
| `POST`     | `/auth/forgot-password` | Request password reset email                      |

### POST `/auth/forgot-password`

**Body**

```json
{ "email": "user@irrigation.gov.lk" }
```

**Response** — always returns success to prevent email enumeration.

## Inventory & stock

| Method | Path                         | Roles       | Description                      |
| ------ | ---------------------------- | ----------- | -------------------------------- |
| `GET`  | `/inventory`                 | VIEWER+     | List inventory with filters      |
| `GET`  | `/inventory/:id`             | VIEWER+     | Item detail with stock levels    |
| `POST` | `/stock-entries`             | STAFF+      | Create stock entry               |
| `GET`  | `/stock-entries`             | VIEWER+     | List stock entries               |
| `POST` | `/stock-entries/:id/approve` | SUPERVISOR+ | Approve pending entry            |
| `POST` | `/stock-entries/:id/reject`  | SUPERVISOR+ | Reject pending entry             |
| `POST` | `/inventory/transfer`        | SUPERVISOR+ | Execute inter-warehouse transfer |

### POST `/stock-entries`

**Body**

```json
{
  "type": "GOODS_RECEIVED",
  "itemId": "cuid",
  "warehouseId": "cuid",
  "quantity": 10,
  "referenceNo": "PO-1234",
  "remarks": "Optional",
  "entryMethod": "MANUAL",
  "idempotencyKey": "optional-unique-key"
}
```

## KPI & reports

| Method | Path                | Roles       | Description                          |
| ------ | ------------------- | ----------- | ------------------------------------ |
| `GET`  | `/kpi`              | SUPERVISOR+ | KPI records for warehouse/date range |
| `GET`  | `/kpi/scorecard`    | SUPERVISOR+ | Scored KPI metrics vs targets        |
| `GET`  | `/reports`          | SUPERVISOR+ | List generated reports               |
| `POST` | `/reports/generate` | MANAGER+    | Generate report on demand            |

## Staff & tasks

| Method | Path     | Roles       | Description         |
| ------ | -------- | ----------- | ------------------- |
| `GET`  | `/users` | ADMIN+      | List users          |
| `POST` | `/users` | ADMIN+      | Create user         |
| `GET`  | `/tasks` | STAFF+      | List assigned tasks |
| `POST` | `/tasks` | SUPERVISOR+ | Assign task         |

## Notifications

| Method  | Path                      | Roles  | Description             |
| ------- | ------------------------- | ------ | ----------------------- |
| `GET`   | `/notifications`          | STAFF+ | List user notifications |
| `PATCH` | `/notifications/:id/read` | STAFF+ | Mark notification read  |

Real-time notifications are delivered via Socket.io on port `3001` (see Runbook).

## Socket events

Connect to `NEXT_PUBLIC_SOCKET_URL` with auth payload:

```json
{
  "userId": "cuid",
  "role": "STAFF",
  "warehouseId": "cuid"
}
```

| Event                | Direction       | Payload              |
| -------------------- | --------------- | -------------------- |
| `notification:new`   | Server → Client | Notification object  |
| `notification:read`  | Client → Server | `{ notificationId }` |
| `notification:count` | Server → Client | `{ unreadCount }`    |
| `stock:low`          | Server → Client | Low stock summary    |
| `kpi:alert`          | Server → Client | KPI alert metrics    |
| `task:due`           | Server → Client | Task reminder        |
| `report:ready`       | Server → Client | Report metadata      |

## Error codes

| Code               | HTTP | Description                              |
| ------------------ | ---- | ---------------------------------------- |
| `VALIDATION_ERROR` | 422  | Request body failed Zod validation       |
| `UNAUTHORIZED`     | 401  | Missing or invalid session               |
| `FORBIDDEN`        | 403  | Insufficient role                        |
| `NOT_FOUND`        | 404  | Resource not found                       |
| `CONFLICT`         | 409  | Concurrent modification or invalid state |
| `RATE_LIMITED`     | 429  | Too many requests                        |
| `INTERNAL_ERROR`   | 500  | Unexpected server error                  |

## Idempotency

POST endpoints that accept `idempotencyKey` deduplicate requests within `IDEMPOTENCY_TTL_SECONDS` (default 24 h).

## Rate limiting

Public auth endpoints are rate-limited via Upstash Redis when `UPSTASH_REDIS_REST_URL` is configured.
