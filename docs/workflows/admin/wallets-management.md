---
title: Wallets Management (Admin)
description: This workflow shows how administrators can manually add funds to customer and provider wallets.
---

## Admin: Wallets Management Workflow

Administrators have the ability to manually charge (add funds to) the wallets of both customers and providers. This is typically done for adjustments, refunds, or promotional credits.

### Roles

*   **Admin**: A system administrator with financial management permissions.

### Wallet Charging Flow

```mermaid
graph TD
    A[Admin] --> B{Wallet Management};
    B --> C[POST /api/v1/admin/customers/{id}/wallets/charge<br/>Charge Customer Wallet];
    B --> D[POST /api/v1/admin/providers/{id}/wallets/charge<br/>Charge Provider Wallet];
```

## API Endpoints

The following endpoints are used by administrators to manage user wallets.

### 1. Charge a Customer's Wallet

Admins can add a specified amount to a customer's wallet.

*   **Endpoint**: `POST /api/v1/admin/customers/{id}/wallets/charge`
*   **Description**: Adds funds to a specific customer's wallet. The request body must contain the amount to be added.
*   **`{id}`**: The ID of the customer.

### 2. Charge a Provider's Wallet

Admins can add a specified amount to a provider's wallet.

*   **Endpoint**: `POST /api/v1/admin/providers/{id}/wallets/charge`
*   **Description**: Adds funds to a specific provider's wallet. The request body must contain the amount to be added.
*   **`{id}`**: The ID of the provider. 