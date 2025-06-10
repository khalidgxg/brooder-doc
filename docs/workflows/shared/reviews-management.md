---
sidebar_position: 6
---

# Review Management

This workflow details how Customers can review completed orders and how Providers can reply to those reviews.

## Endpoints

### Customer Endpoints

*   **Create a Review:** `POST /api/v1/orders/{id}/reviews`
    *   Allows a Customer to submit a review for a completed order.
*   **List Service Reviews:** `GET /api/v1/services/{id}/reviews`
    *   Fetches all reviews for a specific service.
*   **List Provider Reviews:** `GET /api/v1/providers/{id}/reviews`
    *   Fetches all reviews for a specific provider.

### Provider Endpoints

*   **Reply to a Review:** `POST /api/v1/reviews/{id}/reply`
    *   Allows a Provider to post a public reply to a customer's review.
*   **List Own Reviews:** `GET /api/v1/reviews`
    *   Fetches all reviews written about the provider's services.
*   **List Service Reviews:** `GET /api/v1/services/{id}/reviews`
    *   Fetches all reviews for one of the provider's specific services.

## Process Flows

### Customer Creates a Review

```mermaid
graph TD
    A[Start] --> B[Customer POSTs to /orders/{id}/reviews];
    B -- with rate & content --> C[Validate Request];
    C -- Validation Passes --> D{Find Order by ID};
    D -- Order Found --> E{Is Order Status 'COMPLETED'?};
    E -- Yes --> F{Has Order Already Been Reviewed?};
    F -- No --> G[Create Review Record];
    G -- Associated with Order, Service, Provider, and User --> H[Return Success Response];
    H --> Z[End];

    D -- Not Found --> I[Return 404 Not Found];
    E -- No --> J[Return 404 Not Found];
    F -- Yes --> K[Throw LogicalException ("Already reviewed")];
    I --> Z;
    J --> Z;
    K --> Z;
```

### Provider Replies to a Review

```mermaid
graph TD
    A[Start] --> B[Provider POSTs to /reviews/{id}/reply];
    B -- with content --> C[Validate Request];
    C -- Validation Passes --> D{Find Review by ID for this Provider};
    D -- Review Found --> E{Does Review Already Have a Reply?};
    E -- No --> F[Create Reply Record];
    F -- Associated with Review and User --> G[Return Success Response];
    G --> Z[End];

    D -- Not Found --> H[Return 404 Not Found];
    E -- Yes --> I[Throw LogicalException ("Already replied")];
    H --> Z;
    I --> Z;
```

## Request Bodies

### Create a Review (Customer)

| Field     | Type      | Description                               | Rules                        |
| --------- | --------- | ----------------------------------------- | ---------------------------- |
| `rate`    | `numeric` | The rating given, from 1 to 5.            | `required`, `min:1`, `max:5` |
| `content` | `string`  | The text content of the review.           | `required`, `min:2`, `max:600`|

### Reply to a Review (Provider)

| Field     | Type     | Description                     | Rules                        |
| --------- | -------- | ------------------------------- | ---------------------------- |
| `content` | `string` | The text content of the reply.  | `required`, `min:2`, `max:600`|

## Responses

### Success Response (`200 OK`)

For creating a review:
```json
{
    "status": "success",
    "message": "Data has been created successfully."
}
```

For replying to a review:
```json
{
    "status": "success",
    "message": "Your reply has been added successfully."
}
```

### Logical Error Response (`409 Conflict`)

This is returned if a provider tries to reply to a review that already has a reply.
```json
{
    "status": "error",
    "message": "You have already replied to this review."
}
```

## Code Highlights & Key Concepts

*   **Review Belongs to Order:** The system's design is robust because a review is directly tied to a completed order (`$order->review()->create(...)`). This ensures that only customers who have actually completed a service can write a review, preventing fake or unverified feedback.
*   **Single Review Guarantee:** Both the review creation (`$order->review()->exists()`) and reply (`$review->reply`) logic include checks to prevent duplicates. A customer can only review an order once, and a provider can only reply to a review once. This is enforced with `LogicalException`s, which provide clear error messages.
*   **Contextual Authorization:** The `ReplyToReviewAction` finds the review by chaining through the provider's own reviews (`$provider->reviews()->findOrFail($review_id)`). This is an excellent security practice, as it ensures that a provider can only ever access (and reply to) reviews that belong to them, even if they try to guess other review IDs.
*   **Middleware Protection:** The route for creating a review (`POST /orders/{id}/reviews`) is protected by the `CheckOrderStatus` middleware. This middleware likely ensures that the order's status is appropriate (e.g., `COMPLETED`) before even allowing the request to hit the controller, providing an early layer of validation.

This concludes the documentation for all shared workflows.
