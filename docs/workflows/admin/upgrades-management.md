---
title: Upgrades Management (Admin)
description: This workflow covers how administrators handle provider upgrade requests, including reviewing, accepting, and rejecting them.
---

## Admin: Upgrades Management Workflow

Providers may request to upgrade their accounts to a different level or tier. Administrators are responsible for reviewing these requests and ensuring they meet the necessary criteria before approving or rejecting them.

### Roles

*   **Admin**: A system administrator who manages provider account statuses.

### Upgrade Management Flow

```mermaid
graph TD
    A[Admin] --> B{Upgrade Management};
    B --> C[GET /api/v1/admin/upgrades<br/>List Upgrade Requests];
    B --> D[POST /api/v1/admin/upgrades/{id}/accept<br/>Accept Upgrade];
    B --> E[POST /api/v1/admin/upgrades/{id}/reject<br/>Reject Upgrade];
```

## API Endpoints

The following endpoints are used by administrators to manage provider upgrade requests.

### 1. List Upgrade Requests

Admins can view all pending and past upgrade requests from providers.

*   **Endpoint**: `GET /api/v1/admin/upgrades`
*   **Description**: Returns a paginated list of all provider upgrade requests.

### 2. Accept an Upgrade Request

Admins can approve a provider's request to upgrade their account level.

*   **Endpoint**: `POST /api/v1/admin/upgrades/{id}/accept`
*   **Description**: Accepts a provider's upgrade request.
*   **`{id}`**: The ID of the upgrade request to accept.

### 3. Reject an Upgrade Request

If a provider does not qualify for an upgrade, the admin can reject the request.

*   **Endpoint**: `POST /api/v1/admin/upgrades/{id}/reject`
*   **Description**: Rejects a provider's upgrade request.
*   **`{id}`**: The ID of the upgrade request to reject. 