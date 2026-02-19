# WeNeedAName App – Project Documentation

## Glossary

- **Landing Page**  
  The first page a user sees when visiting the website (`www.site.com/`) before logging in or registering.

- **Sofre**  
  A private (or optionally public) shared space where members can manage and view gifts.  
  > Suggested policy: Each user can create **only one Sofre**.

- **RLS (Row Level Security)**  
  Database-level access control policies used to restrict data access per user for privacy and security.

---

# Application Flow

## 1. Entry Point

When a user visits:
```
www.site.com/
```

There are two possible approaches:

### Option A – Use a Landing Page
- Show a landing page or introduction page.
- Provide **Login** and **Register** buttons.

### Option B – No Landing Page
- Use the homepage directly as the **Login / Register** page.

---

## 2. Authentication & Profile Setup

After registering and logging in:

- The user must complete their personal information:
  - `first_name`
  - `last_name`
  - `username`

These are stored in the `users_profile` table.

---

## 3. Dashboard (Sofre List)

After login, the user sees:
```
www.site.com/
```

This page displays:
- A list of the user's Sofres
- Ability to click and enter a specific Sofre

---

## 4. Viewing a Sofre

When accessing:
```
www.site.com/sofre/[id]
```

The user can:

- View gifts inside the Sofre
- Generate an invite link
- Share the invite link with others

### Access Rules

- If the Sofre is **private**, only members can view it.
- If the Sofre is **public**, non-members may view it (optional feature: show a leaderboard on homepage).
- If a user is **not a member**, they cannot access private Sofres.

---

## 5. Joining via Invite Link

Example invite link:
```
http://localhost:3000/invite/7d3c0642-accc-41bf-b921-d870ecc2734c
```

When a user visits:
```
www.site.com/invite/[token]
```

- The system validates the token.
- The user becomes a member of the corresponding Sofre.
- The Sofre becomes accessible in their dashboard.
- The user can now view all gifts inside:

```
www.site.com/sofre/[id]
```

---

# Database Structure & RLS Policies

We are using **Supabase** as a third-party backend service.

## Authentication
- Built-in Supabase feature
- Not stored as a custom table
- Manages user login, registration, and session tracking

---

## Tables

### `users_profile`
Stores personal user information:
- `first_name`
- `last_name`
- `username`

---

### `sofre`
Stores Sofre records.

Suggested rule:
- Each user can create only **one Sofre** (enforced at application or database level).

---

### `sofre_members`
Tracks membership relationships:
- Which users belong to which Sofre
- Used to enforce access restrictions

---

### `sofre_invitations`
Stores invite tokens:
- Each Sofre can have **one active invite token**
- Used to allow new users to join

---

### `gifts`
Each gift:
- Belongs to exactly **one Sofre**
- Contains:
  - `title`
  - `note`
  - `image_path`

---

# Row Level Security (RLS)

RLS policies ensure:

- Users can only view Sofres they are members of.
- Users can only see gifts belonging to Sofres they are members of.
- Invite tokens are validated securely.
- Membership data cannot be accessed or modified by unauthorized users.

---

# Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage (Landing page or Dashboard depending on auth state) |
| `/login` | Login page |
| `/register` | Registration page |
| `/invite/[token]` | Accept invitation to join a Sofre |
| `/sofre/[id]` | View a specific Sofre |

---

# Dynamic Parameters

Routes containing dynamic values:

- `/sofre/[id]`
- `/invite/[token]`

Example:
```
/sofre/4c4f3bbf-fe5e-4ce9-85e6-2d30f4e2860f
/invite/7d3c0642-accc-41bf-b921-d870ecc2734c
```

Each `[id]` and `[token]` is dynamically generated and unique.

---

# Summary

- Users authenticate via Supabase.
- Each user has a profile.
- Users can create and manage a Sofre.
- Sofres support invite-based membership.
- Gifts belong to Sofres.
- RLS ensures strict data privacy and security.
- All sensitive access is controlled at the database level.

---

> This document serves as the technical and architectural overview of the application.
