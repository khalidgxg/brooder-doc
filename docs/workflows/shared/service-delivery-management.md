# Service Delivery Management

This document outlines the complete lifecycle of service delivery execution in the Brooder platform. **ServiceDeliveries** handle the actual service execution workflow after an order payment has been processed successfully.

---

## ServiceDelivery Lifecycle Overview

ServiceDelivery represents the actual execution phase of a service, completely separate from payment processing. Here's the complete lifecycle:

```mermaid
graph TD;
    A["<b>Status: NEW</b><br>Automatically created from completed Order"] -->|Provider Accepts| B["<b>Status: IN_PROGRESS</b><br>PATCH /provider/service-deliveries/{id}/status/in-progress"];
    B -->|Provider Delivers Work| C["<b>Status: REVIEWING</b><br>PATCH /provider/service-deliveries/{id}/status/reviewing"];
    C -->|Customer Accepts| D["<b>Status: COMPLETED</b><br>PATCH /customer/service-deliveries/{id}/status/completed"];
    C -->|Customer Requests Changes| E["<b>Status: IN_PROGRESS</b><br>POST /customer/service-deliveries/{id}/update-requests"];
    D --> F["Financial Settlement Triggered"];
    
    subgraph "Cancellation Options"
        A --> G["Cancel Request"];
        B --> G;
        G --> H["Refund Customer"];
    end
```

---

## ServiceDelivery Status Reference

| Status | Description | Who Controls | Next Actions |
|--------|-------------|--------------|-------------|
| `NEW` | Created automatically when order is paid | System | Provider can accept |
| `IN_PROGRESS` | Provider has started working | Provider | Provider can deliver |
| `REVIEWING` | Work delivered, awaiting customer review | Customer | Customer can accept/request changes |
| `COMPLETED` | Service fully completed | Customer | Final settlement occurs |
| `CANCELLED` | Service cancelled by either party | Both | Refund processed |

---

## Detailed Workflow

### Step 1: Automatic Creation (System)

ServiceDeliveries are created automatically by the `OrderObserver` when an order reaches `COMPLETED` status:

```mermaid
graph TD
    A["Order Status: COMPLETED"] --> B["OrderObserver Triggered"];
    B --> C["ServiceDeliveryLogic.createServiceDeliveryFromOrder()"];
    C --> D["Create ServiceDelivery with Status: NEW"];
    D --> E["Copy service details from Order"];
    E --> F["Link to Provider from Service"];
    F --> G["Provider receives notification"];
```

**Automatic Creation Details:**
- **Endpoint:** None (automatic process)
- **Trigger:** Order status changes to `COMPLETED`
- **Action:** `ServiceDeliveryLogic::createServiceDeliveryFromOrder()`

---

### Step 2: Provider Accepts Work

Provider accepts the service delivery to begin working:

-   **Endpoint:** `PATCH /api/v1/provider/service-deliveries/{id}/status/in-progress`
-   **Authorization:** Bearer Token (Provider)
-   **Action:** `Providers\ServiceDeliveries\ChangeServiceDeliveryStatusToInProgressAction`
-   **Status Change:** `NEW` → `IN_PROGRESS`

#### Process Flow
```mermaid
graph TD
    A["Provider PATCHes /service-deliveries/{id}/status/in-progress"] --> B["Verify ServiceDelivery belongs to Provider"];
    B --> C{"Is status 'NEW'?"};
    C -- No --> D["Fail: Status must be 'NEW'"];
    C -- Yes --> E["Update status to 'IN_PROGRESS'"];
    E --> F["Set started_at timestamp"];
    F --> G["Customer receives notification"];
    G --> H((Success: Work Started));
```

---

### Step 3: Provider Delivers Work

Provider completes the work and submits for customer review:

-   **Endpoint:** `PATCH /api/v1/provider/service-deliveries/{id}/status/reviewing`
-   **Authorization:** Bearer Token (Provider)
-   **Action:** `Providers\ServiceDeliveries\ChangeServiceDeliveryStatusToReviewingAction`
-   **Status Change:** `IN_PROGRESS` → `REVIEWING`

#### Process Flow
```mermaid
graph TD
    A["Provider PATCHes /service-deliveries/{id}/status/reviewing"] --> B["Verify ServiceDelivery belongs to Provider"];
    B --> C{"Is status 'IN_PROGRESS'?"};
    C -- No --> D["Fail: Status must be 'IN_PROGRESS'"];
    C -- Yes --> E["Update status to 'REVIEWING'"];
    E --> F["Customer receives notification"];
    F --> G((Success: Work Submitted for Review));
```

---

### Step 4A: Customer Accepts Work (Completion Path)

Customer accepts the delivered work, triggering final settlement:

-   **Endpoint:** `PATCH /api/v1/customer/service-deliveries/{id}/status/completed`
-   **Authorization:** Bearer Token (Customer)
-   **Action:** `Customers\ServiceDeliveries\ChangeServiceDeliveryStatusToCompletedAction`
-   **Status Change:** `REVIEWING` → `COMPLETED`

#### Process Flow
```mermaid
graph TD
    A["Customer PATCHes /service-deliveries/{id}/status/completed"] --> B["Verify ServiceDelivery belongs to Customer"];
    B --> C{"Is status 'REVIEWING'?"};
    C -- No --> D["Fail: Status must be 'REVIEWING'"];
    C -- Yes --> E["Start DB Transaction"];
    E --> F["Calculate Financial Distribution"];
    F --> G["Transfer Provider Amount from General System Wallet"];
    G --> H["Transfer Tax Amount to Tax Wallet"];
    H --> I["Transfer Profit Amount to Profit Wallet"];
    I --> J["Update status to 'COMPLETED'"];
    J --> K["Set delivered_at timestamp"];
    K --> L["Commit Transaction"];
    L --> M((Success: Service Completed & Funds Distributed));
```

#### Financial Settlement Details
```mermaid
graph TD
    A["Total Amount in General System Wallet"] --> B["Calculate Distribution"];
    B --> C["Platform Profit: 20% of Total"];
    B --> D["Tax: 15% of Profit"];
    B --> E["Provider Amount: Remainder"];
    C --> F["Transfer to Profit Wallet"];
    D --> G["Transfer to Tax Wallet"];
    E --> H["Transfer to Provider Wallet"];
```

---

### Step 4B: Customer Requests Changes (Revision Path)

Customer requests modifications to the delivered work:

-   **Endpoint:** `POST /api/v1/customer/service-deliveries/{id}/update-requests`
-   **Authorization:** Bearer Token (Customer)
-   **Action:** `Customers\ServiceDeliveries\UpdateServiceDeliveryRequest\StoreUpdateServiceDeliveryRequestAction`
-   **Status Change:** `REVIEWING` → `IN_PROGRESS`

#### Request Body

| Field | Type | Rules | Description |
|-------|------|-------|-------------|
| `content` | `string` | `required`, `min:10` | Description of requested changes |

#### Process Flow
```mermaid
graph TD
    A["Customer POSTs /service-deliveries/{id}/update-requests"] --> B["Verify ServiceDelivery belongs to Customer"];
    B --> C{"Is status 'REVIEWING'?"};
    C -- No --> D["Fail: Status must be 'REVIEWING'"];
    C -- Yes --> E["Start DB Transaction"];
    E --> F["Update status to 'IN_PROGRESS'"];
    F --> G["Create UpdateServiceDeliveryRequest record"];
    G --> H["Provider receives notification"];
    H --> I["Commit Transaction"];
    I --> J((Success: Revision Requested));
```

---

## Common Actions

### Listing Service Deliveries

Both customers and providers can retrieve their service deliveries:

-   **Endpoint:** `GET /api/v1/{user_type}/service-deliveries`
-   **`user_type`:** `customer` or `provider`
-   **Authorization:** Bearer Token
-   **Action:** `Shared\ServiceDeliveries\IndexServiceDeliveryAction`

### Show Service Delivery Details

-   **Endpoint:** `GET /api/v1/{user_type}/service-deliveries/{id}`
-   **Authorization:** Bearer Token
-   **Action:** `{UserType}\ServiceDeliveries\ShowServiceDeliveryAction`

---

## Cancellation Workflow

ServiceDelivery cancellations follow a sophisticated workflow based on the current status:

### Cancellation Rules by Status

| ServiceDelivery Status | Cancellation Type | Process |
|----------------------|------------------|---------|
| `NEW` | Immediate | Auto-approved, instant refund |
| `IN_PROGRESS` | Request/Response | Requires other party agreement |
| `REVIEWING` | Request/Response | Requires other party agreement |
| `COMPLETED` | Not Allowed | Cannot cancel completed work |

### Cancellation Endpoints

1.  **Request Cancellation**: `POST /api/v1/{user_type}/service-deliveries/{id}/cancel`
2.  **View Cancellation Requests**: `GET /api/v1/{user_type}/service-deliveries/{id}/cancel`
3.  **Accept Cancellation**: `PATCH /api/v1/{user_type}/service-deliveries/{id}/cancel/{cancel_id}/accept`
4.  **Reject Cancellation**: `PATCH /api/v1/{user_type}/service-deliveries/{id}/cancel/{cancel_id}/reject`

### Cancellation Process Flow

```mermaid
graph TD;
    A["User Initiates Cancellation"] --> B{ServiceDelivery Status?};
    B -- "NEW" --> C["Auto-approve & Refund Customer<br>Set cancelled_at timestamp"];
    B -- "IN_PROGRESS/REVIEWING" --> D{Pending request exists?};
    D -- "No" --> E["Create 'PENDING' cancellation request"];
    E --> F["Notify other party"];
    F --> G{Other party responds};
    G -- "Accepts" --> H["Refund Customer & Mark as CANCELLED"];
    G -- "Rejects" --> I["Mark request as 'REJECTED'"];
    D -- "Yes" --> J["Fail: Request already exists"];
    B -- "COMPLETED" --> K["Fail: Cannot cancel completed work"];
```

---

## Reviews System

After a ServiceDelivery is completed, customers can leave reviews:

-   **Endpoint:** `POST /api/v1/customer/service-deliveries/{id}/reviews`
-   **Authorization:** Bearer Token (Customer)
-   **Prerequisite:** ServiceDelivery status must be `COMPLETED`

### Review Request Body

| Field | Type | Rules | Description |
|-------|------|-------|-------------|
| `rate` | `integer` | `required`, `min:1`, `max:5` | Rating from 1 to 5 stars |
| `content` | `string` | `required`, `min:10` | Review content |

---

## Key Concepts & Features

### **Status Enforcement**
Each action includes strict status validation to prevent invalid transitions:
- `NEW` → `IN_PROGRESS` only
- `IN_PROGRESS` → `REVIEWING` only
- `REVIEWING` → `COMPLETED` or back to `IN_PROGRESS`

### **Transactional Integrity**
Critical operations (completion, cancellation) are wrapped in database transactions to ensure data consistency.

### **Notification System**
Status changes trigger notifications to relevant parties:
- Provider notifications for customer actions
- Customer notifications for provider actions

### **Financial Settlement**
Only completed ServiceDeliveries trigger fund distribution from the escrow wallet.

### **Audit Trail**
All status changes and timestamps are tracked:
- `started_at`: When work begins
- `delivered_at`: When work is completed
- `cancelled_at`: When cancelled

This concludes the ServiceDelivery Management documentation. For order payment processing, see the [Order Management documentation](./orders-management.md). 