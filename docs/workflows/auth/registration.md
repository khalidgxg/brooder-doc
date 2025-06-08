# Registration

This workflow covers the registration process for both Customers and Providers.

---

## Flow Diagram

```mermaid
graph TD;
    subgraph "Registration Flow"
        A["User submits registration form (Customer or Provider)"] --> B["POST /api/v1/register/..."];
        B --> C{"Backend validates submitted data"};
        C -- Valid --> D["Create new user record (inactive)"];
        D --> E["Generate 4-digit OTP"];
        E --> F["Send OTP to user's email"];
        F --> G["Return success message with OTP expiry time end_at"];
        C -- Invalid --> H["Return validation errors"];
    end
```

---

## 1. Customer Registration

This endpoint allows a new user to register as a Customer.

-   **Endpoint:** `POST /api/v1/register/customer`
-   **Method:** `POST`
-   **Authentication:** Not required

### Request Body

| Parameter        | Type    | Rules                                                                                                                                                                                                                           |
| ---------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `first_name`     | string  | Required. Must contain only letters (Arabic/English) and spaces. Min 2, max 50 characters.                                                                                                                                        |
| `last_name`      | string  | Required. Must contain only letters (Arabic/English) and spaces. Min 2, max 50 characters.                                                                                                                                        |
| `email`          | string  | Required. Must be a valid email format and unique in the `users` table.                                                                                                                                                         |
| `password`       | string  | Required. Must be at least 8 characters long and contain letters, mixed case, numbers, and symbols. Must be sent with a matching `password_confirmation` field.                                                                   |
| `phone`          | string  | Required. Must be a unique phone number in the `users` table. Must contain only digits, between 8 and 15 digits long.                                                                                                             |
| `phone_country`  | string  | Required. Must be a valid country code (e.g., "SA", "US").                                                                                                                                                                      |
| `gender`         | string  | Required. Must be one of the allowed gender values (e.g., `male`, `female`).                                                                                                                                                    |
| `city_id`        | integer | Required. Must be a valid ID of a city from the `cities` table.                                                                                                                                                                 |
| `nationality_id` | integer | Required. Must be a valid ID of a nationality from the `nationalities` table.                                                                                                                                                   |
| `avatar`         | file    | Optional. Must be an image file (e.g., png, jpg) with a maximum size of 2MB.                                                                                                                                                    |

### Success Response

-   **Code:** `200 OK`
-   **Content:**
    ```json
    {
        "message": "Data created successfully.",
        "data": {
            "end_at": "2024-08-01T12:00:00.000000Z"
        }
    }
    ```
    -   `end_at`: The timestamp indicating when the OTP for account activation will expire.

---

### Code Highlights & Key Concepts

1.  **Database Transactions**: The entire registration process is wrapped in a `DB::transaction()`. This ensures that if any step fails (e.g., saving the user, creating the profile, or uploading a file), the entire operation is rolled back, preventing incomplete or corrupt user data in the database.

2.  **Inactive User Creation**: A new `User` is created with a `null` value for the `email_verified_at` column. This is a crucial security step that marks the account as inactive and prevents login until the email is verified via OTP.

3.  **Polymorphic Profile**: The system creates a generic `Profile` record associated with the `User` to store common information like `first_name` and `last_name`. It then creates a specific `Customer` or `Provider` record for role-specific data. This is a flexible architecture that allows for different user types.

4.  **OTP Generation & Mailing**: An OTP is generated, saved to the `otp_verifications` table with an expiry time, and then immediately sent to the user's email address using a queued `RegistrationOtp` Mailable. Using a queue (`->send()`) ensures that the user doesn't have to wait for the email to be sent before receiving a response from the API.

5.  **Media Handling (Spatie Media Library)**: The code checks if an `avatar` (or other files for providers) is present in the request. If so, it uses the `spatie/laravel-medialibrary` package to attach the uploaded file to the corresponding model (`Profile` for avatar, `Provider` for documents) and assign it to a specific "collection" (e.g., 'avatar', 'commercial_file').

---

## 2. Provider Registration

This endpoint allows a new user to register as a Provider (Individual or Establishment).

-   **Endpoint:** `POST /api/v1/register/provider`
-   **Method:** `POST`
-   **Authentication:** Not required

### Request Body

| Parameter            | Type         | Rules                                                                                                                                                                                                     |
| -------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `first_name`         | string       | Required. Min 2, max 50 characters. Must contain only letters (Arabic/English) and spaces.                                                                                                                |
| `last_name`          | string       | Required. Min 2, max 50 characters. Must contain only letters (Arabic/English) and spaces.                                                                                                                |
| `email`              | string       | Required. Must be a valid email format and unique in the `users` table.                                                                                                                                   |
| `contact_email`      | string       | Required. Must be a valid email format and unique in the `providers` table.                                                                                                                               |
| `password`           | string       | Required. Must be at least 8 characters and contain letters, mixed case, numbers, and symbols. Must be sent with a matching `password_confirmation` field.                                                  |
| `phone`              | string       | Required. Must be a unique phone number. Must contain only digits, between 8 and 15 digits long.                                                                                                          |
| `phone_country`      | string       | Required. Must be a valid country code.                                                                                                                                                                   |
| `gender`             | string       | Required. Must be one of the allowed gender values.                                                                                                                                                       |
| `city_id`            | integer      | Required. Must be a valid city ID.                                                                                                                                                                        |
| `nationality_id`     | integer      | Required. Must be a valid nationality ID.                                                                                                                                                                 |
| `account_type`       | string       | Required. The type of provider account (e.g., `establishment`, `individual`).                                                                                                                             |
| `establishment_date` | date         | Required if `account_type` is `establishment`. A valid date.                                                                                                                                              |
| `avatar`             | file         | Optional. Image file (png, jpg, jpeg) up to 2MB.                                                                                                                                                          |
| `authorization_form` | array of files | Required if `account_type` is `establishment`. An array of files (jpg, jpeg, png, pdf), each up to 2MB.                                                                                                    |
| `commercial_file`    | array of files | Required if `account_type` is `establishment`. An array of files (jpg, jpeg, png, pdf), each up to 2MB.                                                                                                    |
| `tax_file`           | array of files | Required if `account_type` is `establishment`. An array of files (jpg, jpeg, png, pdf), each up to 2MB.                                                                                                    |

### Success Response

-   **Code:** `200 OK`
-   **Content:**
    ```json
    {
        "message": "Data created successfully.",
        "data": {
            "end_at": "2024-08-01T12:00:00.000000Z"
        }
    }
    ```
    -   `end_at`: The timestamp indicating when the OTP for account activation will expire.

### Code Highlights & Key Concepts

This flow shares the same core concepts as Customer Registration (Transactions, Inactive User Creation, OTP, Media Handling). Key differences for Providers include:

1.  **Conditional Logic for Account Type**: The code checks the `account_type`. If it is `establishment`, it saves all establishment-related data, including `establishment_date` and the various required files (`authorization_form`, `commercial_file`, `tax_file`). If the type is `individual`, this data is ignored.

2.  **Default Provider Level**: When a new Provider is created, they are automatically assigned a `ProviderLevel` of 1. This ensures that every new provider starts at a default tier, which can later be upgraded.

3.  **Multiple File Collections**: For establishment providers, the system handles multiple file uploads. It iterates through each array of files (`authorization_form`, `commercial_file`, etc.) and attaches them to the Provider's media library, each in its own distinct collection. This keeps the provider's documents organized and easy to retrieve.
