---
title: Skills Management (Admin)
description: This workflow explains how administrators manage the global list of skills available on the platform.
---

## Admin: Skills Management Workflow

Administrators are responsible for curating the master list of skills that providers can offer. This includes creating new skills, updating existing ones, and controlling their visibility by activating or deactivating them.

### Roles

*   **Admin**: A system administrator with privileges to manage platform settings.

### Skills Management Flow

```mermaid
graph TD
    A[Admin] --> B{Skills Management};
    B --> C[GET /api/v1/admin/skills<br/>List All Skills];
    B --> D[POST /api/v1/admin/skills<br/>Create New Skill];
    B --> E[PATCH /api/v1/admin/skills/{id}<br/>Update Skill];
    B --> F[POST /api/v1/admin/skills/{id}/activate<br/>Activate Skill];
    B --> G[POST /api/v1/admin/skills/{id}/deactivate<br/>Deactivate Skill];
```

## API Endpoints

The following endpoints are used by administrators to manage the global skills list.

### 1. List Skills

Admins can retrieve a list of all skills available on the platform, including their active status.

*   **Endpoint**: `GET /api/v1/admin/skills`
*   **Description**: Returns a paginated list of all skills.

### 2. Create a Skill

Admins can add a new skill to the platform.

*   **Endpoint**: `POST /api/v1/admin/skills`
*   **Description**: Creates a new skill. The request body should contain the skill's name and any other required attributes.

### 3. Update a Skill

Admins can change the details of an existing skill.

*   **Endpoint**: `PATCH /api/v1/admin/skills/{id}`
*   **Description**: Updates the specified skill.
*   **`{id}`**: The ID of the skill to update.

### 4. Activate a Skill

Admins can make a skill "active," which means it will be visible and available for providers to add to their profiles.

*   **Endpoint**: `POST /api/v1/admin/skills/{id}/activate`
*   **Description**: Activates a specific skill.
*   **`{id}`**: The ID of the skill to activate.

### 5. Deactivate a Skill

Admins can deactivate a skill, making it unavailable for new provider profiles or services.

*   **Endpoint**: `POST /api/v1/admin/skills/{id}/deactivate`
*   **Description**: Deactivates a specific skill.
*   **`{id}`**: The ID of the skill to deactivate. 