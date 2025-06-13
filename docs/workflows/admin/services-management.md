---
title: Services Management (Admin)
description: This workflow details how administrators review, accept, and reject services submitted by providers.
---

## Admin: Services Management Workflow

Administrators play a crucial role in maintaining the quality of services offered on the platform. They are responsible for reviewing services submitted by providers and deciding whether to accept or reject them based on platform guidelines.

### Roles

*   **Admin**: A system administrator responsible for quality control.

### Service Management Flow

```mermaid
graph TD
    A[Admin] --> B{Service Management};
    B --> C[GET /api/v1/admin/services<br/>List All Services];
    B --> D[GET /api/v1/admin/services/{id}<br/>View Service Details];
    B --> E[PATCH /api/v1/admin/services/{id}/accept<br/>Accept Service];
    B --> F[PATCH /api/v1/admin/services/{id}/reject<br/>Reject Service];
```

## API Endpoints

The following endpoints are used by administrators to manage provider services.

### 1. List Services

Admins can retrieve a list of all services, often filtering for those pending review.

*   **Endpoint**: `GET /api/v1/admin/services`
*   **Description**: Returns a paginated list of all services submitted by providers.

### 2. Show Service Details

To make an informed decision, admins can view the full details of a specific service.

*   **Endpoint**: `GET /api/v1/admin/services/{id}`
*   **Description**: Retrieves all details for a single service, including provider information.
*   **`{id}`**: The ID of the service.

### 3. Accept a Service

Admins can approve a service, making it visible and available for customers to order.

*   **Endpoint**: `PATCH /api/v1/admin/services/{id}/accept`
*   **Description**: Marks a service as accepted.
*   **`{id}`**: The ID of the service to accept.

### 4. Reject a Service

If a service does not meet the platform's standards, admins can reject it.

*   **Endpoint**: `PATCH /api/v1/admin/services/{id}/reject`
*   **Description**: Rejects a service, preventing it from being listed.
*   **`{id}`**: The ID of the service to reject. 