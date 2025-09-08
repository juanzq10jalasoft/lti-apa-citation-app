# Simple Citation & Bibliography Manager - One-Day Build Specification

## Overview
A lightweight, client-side citation manager built with SvelteKit and TypeScript. All data stored in browser's localStorage. No backend, no database, no authentication required.

## Tech Stack
- **Framework**: SvelteKit with TypeScript
- **Styling**: TailwindCSS (or plain CSS for simplicity)
- **Storage**: Browser localStorage
- **Export**: Client-side file generation
- **Deployment**: Static hosting (Vercel)

## Core Features (MVP - 1 Day)

### 1. Citation Entry Form
Simple form with fields that change based on source type:

**Source Types** (keep it simple - just 3):
- **Website**: URL, title, author, access date
- **Book**: Title, author(s), year, publisher, ISBN (optional)
- **Journal Article**: Title, author(s), journal name, year, volume, issue, pages

### 2. Citation Styles
Support 3 main styles (implement basic formatting rules):
- **APA**: Author, A. A. (Year). Title. Publisher.
- **MLA**: Author. *Title*. Publisher, Year.
- **Chicago**: Author. Title. Place: Publisher, Year.

### 3. Main Features
- Add/Edit/Delete citations
- Generate formatted bibliography
- Copy individual citations to clipboard
- Export bibliography as .txt file
- Clear all data

## File Structure
```
src/
├── routes/
│   ├── +page.svelte          // Main app page
│   └── +layout.svelte         // App layout
├── lib/
│   ├── components/
│   │   ├── CitationForm.svelte
│   │   ├── CitationList.svelte
│   │   ├── Bibliography.svelte
│   │   └── StyleSelector.svelte
│   ├── stores/
│   │   └── citations.ts       // Svelte store for citations
│   ├── utils/
│   │   ├── formatter.ts       // Citation formatting logic
│   │   └── storage.ts         // localStorage helpers
│   └── types/
│       └── index.ts           // TypeScript interfaces
└── app.html
```
