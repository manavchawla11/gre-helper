# GRE Verbal Helper

## TL;DR

A small but complete digital experience built with **Contentstack** that delivers a daily GRE vocabulary word, interactive flashcards, localization, scheduled publishing, and automated email delivery — all in a fully decoupled, headless architecture.

---

## ✨ Features

- **Word of the Day**
  - A single vocabulary word highlighted daily
  - Includes meaning and example usage using rich text
- **Flashcards**
  - Vocabulary words presented as interactive flip cards
  - Filterable by difficulty (easy / medium / hard)
  - Includes a focused single-card practice mode
- **Localization**
  - Content is localized using Contentstack’s native locale support
  - Users can switch languages from the UI
- **Email Subscription**
  - Users can subscribe to receive the Word of the Day via email
  - Subscription handled via Contentstack Automate
- **Scheduled Publishing**
  - Editors can schedule future Word of the Day entries in advance
  - No manual daily updates required

---

## 🧱 Architecture Overview

This project follows a **fully decoupled, headless architecture** with a clear separation between content delivery and content creation.

---

### Frontend

- Built with **React (Vite)**
- Deployed using **Contentstack Launch**
- Responsible only for:
  - Fetching content
  - Rendering UI
  - Handling user interactions

The frontend **never directly writes to Contentstack**.

---

### Content Management (Contentstack CMS)

Content is modeled using structured content types:

- **Vocabulary Word**
  - Word title
  - Meaning (rich text)
  - Example usage (rich text)
  - Difficulty (taxonomy)
- **Word of the Day**
  - Singleton entry
  - References a Vocabulary Word
- **Subscriber**
  - Stores user email addresses

Editors manage all content from the Contentstack UI.

---

### Content Delivery

- The frontend fetches content using **Contentstack Delivery APIs**
- Localization and scheduled publishing are handled automatically by Contentstack
- The frontend simply requests content for the active locale

This allows content updates to go live **without redeploying the frontend**.

---

### Localization

- Vocabulary content is localized directly in Contentstack
- Each locale can have its own meaning and example usage
- The frontend switches locale dynamically and re-fetches content

No duplicate content or frontend logic is required to support multiple languages.

---

### Scheduled Publishing (Word of the Day)

- Editors can schedule multiple future versions of the **Word of the Day** entry
- Each scheduled version points to a different vocabulary word
- When the scheduled time arrives:
  - Contentstack publishes the new version
  - The frontend automatically displays the new word

This removes the need for daily manual updates by editors.

---

### Subscription & Automation Flow

To handle subscriptions securely:

1. The user submits their email on the frontend
2. The frontend sends the email to a **serverless function**
3. The serverless function forwards the request to **Contentstack Automate**
4. Automate:
   - Creates a Subscriber entry
   - Triggers email workflows (Word of the Day emails)

This ensures:

- No management credentials are exposed in the frontend
- All write operations are handled server-side
- The system remains scalable and secure

---

## 🔒 Security & Best Practices

- Frontend uses **read-only Delivery APIs**
- All write operations are handled via Automate
- No Contentstack Management API keys are exposed
- Clean separation between content, automation, and presentation

---

## 📌 Tech Stack

- **Frontend:** React, Vite
- **CMS:** Contentstack
- **Automation:** Contentstack Automate
- **Deployment:** Contentstack Launch
- **Serverless:** Vercel Functions
