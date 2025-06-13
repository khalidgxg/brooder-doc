---
title: Withdrawal Requests Management (Admin)
description: This workflow outlines how administrators manage withdrawal requests from providers, including approval, rejection, and completion.
---

## Admin: Withdrawal Requests Management

Administrators oversee the process of provider withdrawals. They review requests, approve or reject them, and mark them as complete once the funds have been transferred.

### Roles

*   **Admin**: A system administrator with financial oversight.

### Withdrawal Request Flow

```mermaid
graph TD
    A[Admin] --> B{Withdrawal Request Management};
    B --> C[GET /api/v1/admin/withdrawal-requests<br/>List Requests];
    B --> D{Review Request};
    C --> D;
    D --> E[POST /api/v1/admin/withdrawal-requests/{id}/approve<br/>Approve];
    D --> F[POST /api/v1/admin/withdrawal-requests/{id}/reject<br/>Reject];
    E --> G[POST /api/v1/admin/withdrawal-requests/{id}/complete<br/>Mark as Complete];
```

## API Endpoints

The following endpoints are used by administrators to manage provider withdrawal requests.

### 1. List Withdrawal Requests

Admins can view all withdrawal requests to see what needs to be processed.

*   **Endpoint**: `GET /api/v1/admin/withdrawal-requests`
*   **Description**: Returns a paginated list of all withdrawal requests.

### 2. Approve a Withdrawal Request

Admins can approve a request, confirming that the provider is eligible to withdraw the requested amount.

*   **Endpoint**: `POST /api/v1/admin/withdrawal-requests/{id}/approve`
*   **Description**: Approves a specific withdrawal request.
*   **`{id}`**: The ID of the withdrawal request.

### 3. Reject a Withdrawal Request

Admins can reject a request if there is an issue (e.g., insufficient funds, suspicious activity).

*   **Endpoint**: `POST /api/v1/admin/withdrawal-requests/{id}/reject`
*   **Description**: Rejects a specific withdrawal request.
*   **`{id}`**: The ID of the withdrawal request.

### 4. Complete a Withdrawal Request

After the funds have been successfully transferred to the provider's bank account externally, the admin marks the request as complete in the system.

*   **Endpoint**: `POST /api/v1/admin/withdrawal-requests/{id}/complete`
*   **Description**: Marks a withdrawal request as completed. This is the final step in the process.
*   **`{id}`**: The ID of the withdrawal request. 