# Activate Customer Role

This workflow allows a provider to activate the "customer" role for their own account. This does **not** create a new, separate customer. Instead, it transforms the provider's account into a dual-role account, allowing them to switch between provider and customer functionalities.

-   **Endpoint:** `POST /api/v1/provider/customers`
-   **Authorization:** Bearer Token (Provider)
-   **Action:** `Providers\Accounts\CreateCustomerAccountAction`

---

## Process Overview

This action is a simple, one-time flag switch and role creation.

```mermaid
graph TD;
    A["Provider sends POST to /customers"] --> B["CreateCustomerAccountAction"];
    B --> C{Is `has_customer_account` true?};
    C -- "Yes" --> D[Error: "Customer account already exists"];
    C -- "No" --> E["Create a `customers` table record linked to this user"];
    E --> F["Set `has_customer_account` flag on `users` table to true"];
    F --> G((Success: Return updated User object));
```

---

## Request Body

This endpoint does not require any request body.

---

## Core Logic & Key Concepts

1.  **Dual-Role Account**: The key concept here is that a single `User` in the system can have both a provider role and a customer role. This action is the mechanism by which a provider "unlocks" their customer-side capabilities.

2.  **Idempotency Check**: The `if ($user->has_customer_account)` check ensures the action is idempotent. Running it more than once will result in an error on subsequent attempts, preventing the creation of duplicate customer roles for the same user.

3.  **Relationship Creation**: The core of the action is ` $user->customer()->create(...)`. This creates a new entry in the `customers` table and automatically associates it with the provider's `user_id`, officially establishing the link that defines their customer role.
