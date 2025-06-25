
# Firestore Schema: Social Media Scheduler

This document outlines the proposed Firestore schema for the Social Media Scheduler feature. This structure is designed to support multi-platform scheduling, team collaboration, and detailed post management.

## Collection: `workspaces`

This is a top-level collection, assuming a multi-tenant architecture where users belong to a workspace.

*   **Document ID:** `workspace_id` (e.g., `ws_abc123`)
*   **Fields:**
    *   `timezone`: (String) The primary timezone for the workspace (e.g., "America/New_York").
    *   `collaborators`: (Array of Maps) Stores users who have access to this workspace.
        *   `userId`: (String) Reference to a user's ID in the main `users` collection.
        *   `role`: (String) e.g., "owner", "admin", "editor", "viewer".

## Subcollection: `profiles` (under `workspaces`)

Stores the social media profiles connected to a workspace.

*   **Path:** `workspaces/{workspace_id}/profiles`
*   **Document ID:** `profile_id` (e.g., `prof_xyz789`)
*   **Fields:**
    *   `platform`: (String) e.g., "Facebook", "Instagram", "Twitter".
    *   `credentials`: (Map) Securely stored authentication tokens (e.g., OAuth tokens). **Note:** This data should be encrypted or managed via a secure service like Google Secret Manager.
    *   `name`: (String) The display name of the profile (e.g., "HighLaunchPad Page").
    *   `platform_id`: (String) The unique ID of the profile on its native platform.

## Subcollection: `posts` (under `workspaces`)

The core collection for all social media posts created within a workspace.

*   **Path:** `workspaces/{workspace_id}/posts`
*   **Document ID:** `post_id` (e.g., `post_def456`)
*   **Fields:**
    *   `author_id`: (String) The ID of the user who created the post.
    *   `profiles`: (Array of Strings) An array of `profile_id`s where this post will be published.
    *   `media`: (Array of Strings) An array of `media_asset_id`s associated with this post.
    *   `caption`: (String) The main text content of the post.
    *   `scheduled_time`: (Timestamp) The time the post is scheduled to be published.
    *   `status`: (String) The current status of the post ("draft", "scheduled", "processing", "published", "error").
    *   `chain_comment_id`: (String, Optional) Reference to a `comment_id` for the first auto-comment.
    *   `error_message`: (String, Optional) Stores any error message if publishing failed.
    *   `published_at`: (Timestamp, Optional) The actual time the post was successfully published.

## Subcollection: `media_assets` (under `workspaces`)

A library of all media uploaded to the workspace.

*   **Path:** `workspaces/{workspace_id}/media_assets`
*   **Document ID:** `media_asset_id`
*   **Fields:**
    *   `type`: (String) "image" or "video".
    *   `url`: (String) The URL of the asset, likely pointing to a cloud storage solution (e.g., Firebase Storage).
    *   `cover_url`: (String, Optional) For videos, a URL to a custom cover image.
    *   `uploaded_by`: (String) `user_id` of the uploader.
    *   `created_at`: (Timestamp)

## Subcollection: `comments` (under `posts`)

Stores comments and discussions related to a specific post, including chain comments.

*   **Path:** `workspaces/{workspace_id}/posts/{post_id}/comments`
*   **Document ID:** `comment_id`
*   **Fields:**
    *   `author_id`: (String) `user_id` of the commenter.
    *   `message`: (String) The comment text.
    *   `timestamp`: (Timestamp)
    *   `is_chain_comment`: (Boolean) True if this is an auto-comment to be published with the post.

## Top-Level Collections for Advanced Features

These might be top-level collections for performance and scalability reasons.

### Collection: `tasks`

*   **Document ID:** `task_id`
*   **Fields:**
    *   `workspace_id`: (String) Reference to the workspace.
    *   `assigned_to`: (String) `user_id` of the assignee.
    *   `due_date`: (Timestamp)
    *   `post_id`: (String, Optional) Link to a post if the task is related to it.
    *   `description`: (String)
    *   `is_completed`: (Boolean)

### Collection: `monitoring_queries`

*   **Document ID:** `query_id`
*   **Fields:**
    *   `workspace_id`: (String)
    *   `query`: (String) The keyword or competitor being tracked.
    *   `results`: (Array of Maps) Cached results from the monitoring service.
        *   `link`: (String) URL to the found content.
        *   `snippet`: (String)
        *   `timestamp`: (Timestamp)

### Collection: `analytics`

*   **Document ID:** `analytics_id` (or could be structured as `post_id`)
*   **Fields:**
    *   `post_id`: (String)
    *   `workspace_id`: (String)
    *   `impressions`: (Number)
    *   `engagement`: (Number)
    *   `clicks`: (Number)
    *   `platform`: (String)
    *   `timestamp`: (Timestamp) The time the analytics data was recorded.

### Collection: `shortened_urls`

*   **Document ID:** `short_url_slug`
*   **Fields:**
    *   `workspace_id`: (String)
    *   `original_url`: (String)
    *   `clicks`: (Number)
    *   `created_at`: (Timestamp)
