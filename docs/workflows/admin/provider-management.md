---
title: Provider Management (Admin)
description: This workflow outlines how administrators manage provider accounts, including listing, viewing, accepting, and rejecting providers.
---

## Admin: Provider Management Workflow

Administrators have the authority to manage provider accounts. This includes reviewing provider applications, accepting or rejecting them, and viewing their profiles.

### Roles

*   **Admin**: A system administrator with privileges to manage the platform.

### Provider Management Flow

```mermaid
graph TD
    A[Admin] --> B{Provider Management};
    B --> C["GET /api/v1/admin/providers<br>List Providers"];
    B --> D["GET /api/v1/admin/providers/{id}<br>View Provider Profile"];
    B --> E["PATCH /api/v1/admin/providers/{id}/accept<br>Accept Provider"];
    B --> F["PATCH /api/v1/admin/providers/{id}/reject<br>Reject Provider"];
    B --> G["POST /api/v1/admin/providers/{id}/wallets/charge<br>Charge Provider Wallet"];
```

## API Endpoints

The following endpoints are used by administrators to manage providers.

### 1. List Providers

Admins can retrieve a list of all providers, which is useful for seeing pending applications and existing accounts.

*   **Endpoint**: `GET /api/v1/admin/providers`
*   **Description**: Returns a paginated list of all providers.

### 2. Show Provider Profile

Admins can view the detailed profile of a specific provider.

*   **Endpoint**: `GET /api/v1/admin/providers/{id}`
*   **Description**: Retrieves the full profile for a single provider.
*   **`{id}`**: The ID of the provider.

### 3. Accept a Provider

Admins can accept a provider's application, allowing them to offer services on the platform.

*   **Endpoint**: `PATCH /api/v1/admin/providers/{id}/accept`
*   **Description**: Marks a provider's account as accepted.
*   **`{id}`**: The ID of the provider to accept.

### 4. Reject a Provider

Admins can reject a provider's application.

*   **Endpoint**: `PATCH /api/v1/admin/providers/{id}/reject`
*   **Description**: Rejects a provider's application.
*   **`{id}`**: The ID of the provider to reject.

### 5. Charge a Provider's Wallet

Admins can manually add funds to a provider's wallet.

*   **Endpoint**: `POST /api/v1/admin/providers/{id}/wallets/charge`
*   **Description**: Charges (adds funds to) a specific provider's wallet.
*   **`{id}`**: The ID of the provider whose wallet is to be charged.

### Core Logic & Key Concepts

1.  **Status Management**: The core of this workflow is changing the provider's status.
    *   **Acceptance**: Sets the provider's status to `ACTIVE` (`1`). This makes the provider's profile and services live on the platform.
    *   **Rejection**: Sets the provider's status to `REJECTED` (`2`).

2.  **Transactional Email Update on Acceptance**: A key feature of the `ProviderAcceptationAction` is how it handles email updates. If a provider has a pending `reviewProvidersRequest` (meaning they likely updated their email during the application process), the system performs a critical swap within a database transaction:
    *   The email from the review request becomes the user's primary `email`.
    *   The `email_verified_at` timestamp is also transferred from the request, ensuring the new email is already marked as verified.
    *   The old email is saved to the provider's `contact_email` field for reference.
    *   The review request is deleted.
    This transactional approach ensures data integrity; if any step fails, the entire operation is rolled back.

3.  **Email Notifications**: The system automatically communicates with the provider at critical points:
    *   Upon acceptance, a `ProviderAcceptationMail` is sent to welcome the new provider.
    *   Upon rejection, a `ProviderRejection` email is sent. This email includes a custom message from the administrator, providing a reason for the rejection, which is crucial for transparency. 