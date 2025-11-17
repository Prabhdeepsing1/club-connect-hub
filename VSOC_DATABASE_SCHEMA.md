# 🧩 VSOC Supabase Database Schema Documentation

This document provides a **complete overview of the VSOC project's database schema**, designed to help developers, contributors, or AI models understand the relationships, structure, and purpose of each table.

---

## 🧠 Overview

The VSOC database manages users, contributions, GSOC organizations, events, applications, and notifications. It is powered by **Supabase (PostgreSQL)** and serves as the backend data layer for the **VSOC Platform**, which connects contributors, mentors, and organizations participating in open-source programs.

---

## 🧍‍♂️ Table: `users`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Unique identifier for each user (linked to `auth.users.id`) |
| `name` | varchar | Full name of the user |
| `role` | varchar | Role of the user (e.g., admin, mentor, participant) |
| `is_active` | bool | Indicates if the user account is active |
| `created_at` | timestamptz | Timestamp of when the user was created |
| `updated_at` | timestamptz | Timestamp of the last update |

**Purpose:** Central user registry connecting all other entities such as profiles, events, and contributions.

---

## 🧾 Table: `member_profiles`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Unique profile identifier |
| `roll_no` | varchar | Roll number (for student identification) |
| `branch` | varchar | Academic branch of the member |
| `year` | varchar | Academic year (e.g., 3rd Year) |
| `github_username` | varchar | GitHub username of the member |
| `interests` | _text | List of technical or domain interests |
| `bio` | text | Short biography of the member |
| `joined_at` | timestamptz | Date when the member joined the platform |
| `is_active` | bool | Whether the profile is currently active |
| `created_at` | timestamptz | Creation timestamp |
| `updated_at` | timestamptz | Last update timestamp |

**Purpose:** Stores personal and academic information of registered members.

---

## 🧑‍💻 Table: `contributions`

| Column | Type | Description |
|--------|------|-------------|
| `id` | varchar | Unique PR identifier |
| `member_id` | uuid | Links to `member_profiles.id` |
| `github_pr_id` | int8 | GitHub PR number |
| `repo_name` | varchar | Name of the repository |
| `repo_owner` | varchar | Repository owner username |
| `pr_number` | int4 | Pull Request number |
| `pr_title` | text | PR title |
| `pr_link` | varchar | Direct link to the PR |
| `status` | varchar | PR status (open, closed, merged) |
| `author_github_username` | varchar | GitHub username of the PR author |
| `created_at`, `updated_at`, `closed_at`, `merged_at` | timestamptz | Timestamps of lifecycle stages |
| `labels`, `reviewers`, `metadata` | jsonb | PR metadata such as tags, reviewers |
| `reviews_count`, `comments_count`, `additions`, `deletions`, `changed_files` | int4 | PR activity stats |
| `event_id` | uuid | Related event (e.g., Hackathon or GSOC session) |
| `score` | numeric | Contribution score |
| `last_synced` | timestamptz | Last time data was synced |

**Purpose:** Tracks members’ GitHub PR contributions and analytics.

---

## 🏢 Table: `gsoc_orgs`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Organization ID |
| `name` | varchar | GSOC organization name |
| `description` | text | Description of the organization |
| `category` | varchar | Organization category |
| `technologies` | _text | List of tech stacks used |
| `repo_links` | _text | Links to related repositories |
| `contribution_guidelines` | varchar | Link to contribution guide |
| `last_year_participated` | int4 | Last year the org participated |
| `tags` | _text | Tags or keywords |
| `past_ideas` | jsonb | Historical ideas list |
| `created_at`, `updated_at` | timestamptz | Timestamps |

**Purpose:** Repository of all GSOC organizations and related data.

---

## 🎟️ Table: `event_participants`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Unique participation record |
| `event_id` | uuid | References `events.id` |
| `member_id` | uuid | References `member_profiles.id` |
| `joined_at` | timestamptz | Join timestamp |
| `total_score` | numeric | Participant’s total score |
| `rank` | int4 | Rank within event |

**Purpose:** Manages relationships between members and events.

---

## 📅 Table: `events`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Unique event identifier |
| `title` | varchar | Event title |
| `description` | text | Event details |
| `type` | varchar | Type of event (e.g., Hackathon, GSOC) |
| `start_date`, `end_date` | timestamptz | Duration of the event |
| `status` | varchar | Active, Upcoming, Completed |
| `pr_tracking_enabled` | bool | Whether PRs are tracked |
| `scoring_rules`, `resources`, `whitelisted_repos` | jsonb / _text | Event metadata |
| `max_participants` | int4 | Participant limit |
| `created_by` | uuid | Linked admin user |
| `created_at`, `updated_at` | timestamptz | Audit fields |

**Purpose:** Central table for managing all events, competitions, and GSOC phases.

---

## 📮 Table: `notifications`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Notification ID |
| `user_id` | uuid | Linked to `users.id` |
| `type` | varchar | Notification type |
| `title` | varchar | Notification title |
| `message` | text | Message content |
| `read` | bool | Whether notification was read |
| `data` | jsonb | Extra metadata |
| `created_at` | timestamptz | Created timestamp |

**Purpose:** Stores all user notifications for in-app alerts.

---

## 📰 Table: `announcements`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Announcement ID |
| `title` | varchar | Title of the announcement |
| `content` | text | Full announcement text |
| `priority` | varchar | Importance level (high, medium, low) |
| `is_pinned` | bool | Whether it’s pinned to top |
| `target_audience` | varchar | Audience group |
| `created_by` | uuid | Admin who created it |
| `created_at`, `updated_at`, `expires_at` | timestamptz | Lifecycle timestamps |

**Purpose:** Used by admins to broadcast messages to members.

---

## 🧾 Table: `applications`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Application ID |
| `name`, `email`, `roll_no`, `branch`, `year` | varchar | Applicant details |
| `github_username` | varchar | Applicant’s GitHub username |
| `reason` | text | Reason for applying |
| `interests` | _text | Applicant interests |
| `interview_details`, `admin_notes` | text | Admin notes |
| `processed_by` | uuid | Admin who processed the application |
| `submitted_at`, `processed_at` | timestamptz | Lifecycle timestamps |
| `status` | varchar | Application status (Pending, Approved, Rejected) |

**Purpose:** Handles member applications for joining events or programs.

---

## 📚 Table: `content`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Content ID |
| `page_key` | varchar | Page identifier |
| `section_key` | varchar | Section identifier |
| `content_data` | jsonb | Actual content stored in JSON format |
| `updated_by` | uuid | User who last edited it |
| `updated_at` | timestamptz | Timestamp of last update |

**Purpose:** Dynamic CMS content storage for platform sections (FAQs, About, etc.).

---

# 🔗 Relationships Summary

- `users` ↔ `member_profiles`: One-to-one user profile linkage  
- `users` ↔ `notifications`: One-to-many notifications  
- `events` ↔ `event_participants` ↔ `member_profiles`: Many-to-many through `event_participants`  
- `contributions` ↔ `member_profiles`: One-to-many  
- `applications` ↔ `users`: Admin actions linked via `processed_by`  
- `announcements` ↔ `users`: Created by admins  
- `gsoc_orgs` is standalone but linked conceptually to `events` and `contributions`

---

# 🧩 Summary

This schema provides a **robust structure for managing events, members, open-source contributions, and communications** within the VSOC ecosystem. It is modular, scalable, and tightly integrated with Supabase Auth and storage systems.
