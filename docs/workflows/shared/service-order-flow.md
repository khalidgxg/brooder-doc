# Service Order Flow

This document provides a comprehensive visual overview of the complete service order and delivery flow in the Brooder platform, from initial customer order creation through final service completion and financial settlement.

---

## Complete System Flow

The following diagram illustrates the entire journey of a service order through the Brooder platform, showing how Orders (payment processing) seamlessly transition to ServiceDeliveries (service execution):

```mermaid
graph TD
    A["Customer browsing services"] --> B["Customer selects service + upgrades"];
    B --> C["POST /api/v1/orders<br>Create Order"];
    
    subgraph "Order Processing - Payment Focus"
        C --> D["Validate service & upgrades"];
        D --> E["Calculate total price + tax"];
        E --> F{"Payment Method"};
        F -->|Wallet| G["Check wallet balance"];
        F -->|Credit Card| H["Payment processor<br>(Under development)"];
        G -->|Sufficient| I["Transfer to General System wallet"];
        G -->|Insufficient| J["❌ Insufficient balance"];
        I --> K["Create Order with status: COMPLETED"];
        K --> L["✅ Order payment successful"];
    end
    
    subgraph "ServiceDelivery Creation - Automatic"
        L --> M["OrderObserver triggered"];
        M --> N["ServiceDeliveryLogic.createServiceDeliveryFromOrder()"];
        N --> O["Create ServiceDelivery with status: NEW"];
        O --> P["Link to Provider"];
        P --> Q["Provider notification sent"];
    end
    
    subgraph "Service Execution Workflow"
        Q --> R["Provider sees NEW ServiceDelivery"];
        R --> S["PATCH /provider/service-deliveries/{id}/status/in-progress"];
        S --> T["ServiceDelivery status: IN_PROGRESS<br>started_at timestamp"];
        T --> U["Provider works on service"];
        U --> V["PATCH /provider/service-deliveries/{id}/status/reviewing"];
        V --> W["ServiceDelivery status: REVIEWING"];
        
        W --> X{"Customer Review"};
        X -->|Accept| Y["PATCH /customer/service-deliveries/{id}/status/completed"];
        X -->|Request Changes| Z["POST /customer/service-deliveries/{id}/update-requests"];
        
        Z --> AA["ServiceDelivery status: IN_PROGRESS<br>UpdateServiceDeliveryRequest created"];
        AA --> U;
        
        Y --> BB["ServiceDelivery status: COMPLETED<br>delivered_at timestamp"];
    end
    
    subgraph "Financial Settlement - Final Stage"
        BB --> CC["Calculate fund distribution"];
        CC --> DD["Platform profit: 20% of total"];
        CC --> EE["Tax: 15% of profit"];
        CC --> FF["Provider amount: remainder"];
        
        DD --> GG["Transfer to Profit wallet"];
        EE --> HH["Transfer to Tax wallet"];
        FF --> II["Transfer to Provider wallet"];
        
        GG --> JJ["✅ Settlement complete"];
        HH --> JJ;
        II --> JJ;
    end
    
    subgraph "Cancellation Options"
        O -->|Status: NEW| KK["Immediate cancellation<br>Auto-refund"];
        T -->|Status: IN_PROGRESS| LL["Cancellation request<br>Requires approval"];
        W -->|Status: REVIEWING| LL;
        
        KK --> MM["Refund to customer wallet"];
        LL --> NN{"Other party decision"};
        NN -->|Accept| MM;
        NN -->|Reject| OO["Continue workflow"];
    end
    
    subgraph "Review System"
        JJ --> PP["Customer can leave review"];
        PP --> QQ["POST /customer/service-deliveries/{id}/reviews"];
        QQ --> RR["Review stored & affects provider rating"];
    end
```

---

## Flow Summary

This comprehensive flow demonstrates the separation of concerns in the new Brooder architecture:

### 🏦 **Order Stage (Payment Processing)**
- Customer selects service and upgrades
- Payment validation and processing
- Funds held in escrow (General System wallet)
- Order marked as `COMPLETED` upon successful payment

### 🔄 **Automatic Transition**
- OrderObserver detects completed order
- ServiceDelivery automatically created
- Provider receives notification

### ⚙️ **Service Execution Stage**
- Provider accepts work (`NEW` → `IN_PROGRESS`)
- Provider delivers work (`IN_PROGRESS` → `REVIEWING`)
- Customer reviews and either accepts or requests changes
- Possible revision cycles until satisfaction

### 💰 **Financial Settlement**
- Only triggered when ServiceDelivery reaches `COMPLETED`
- Funds distributed from escrow to:
  - Provider wallet (majority of funds)
  - Tax wallet (15% of platform profit)
  - Profit wallet (20% of total amount)

### 🚫 **Cancellation Handling**
- Immediate cancellation for `NEW` ServiceDeliveries
- Request/approval process for active ServiceDeliveries
- Automatic refund processing

### ⭐ **Review System**
- Post-completion review capability
- Affects provider ratings and platform reputation

---

## Key Benefits of This Flow

1. **Clear Separation**: Payment and service execution are completely separate
2. **Financial Security**: Escrow system protects both parties
3. **Flexibility**: Revision cycles ensure customer satisfaction
4. **Automation**: Minimal manual intervention required
5. **Transparency**: Clear status tracking throughout the process

For detailed documentation on each stage, see:
- [Order Management](./orders-management.md) - Payment processing
- [Service Delivery Management](./service-delivery-management.md) - Service execution 