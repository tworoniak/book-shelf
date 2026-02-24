# React + TypeScript + Vite + Sass

# 📚 Book Shelf v2.0

A modern React + TypeScript + Vite + Sass application that searches the Google Books API and lets you organize books into personal shelves:

- ✅ Want to Read
- 📖 Reading
- ✔ Read

All shelves persist locally using localStorage.

Now powered by a serverless API layer to securely proxy and normalize Google Books responses.

---

## ✨ Features

- 🔎 Debounced search via Google Books API
- 📘 Book cards with cover, title, authors, metadata
- 🗂 Tabs-based shelf management
- 💾 Persistent shelves (localStorage)
- ⏭ Pagination (Prev / Next)
- 🎨 Modular Sass architecture
- 🔒 Google API key secured server-side
- 🧩 Normalized API contract ({ total, items })
- ⚡ Fast Vite development environment
- ☁ Deployed on Vercel

---

## 🛠 Tech Stack

- React 18
- TypeScript
- Vite
- Sass (SCSS modules structure)
- Vercel Serverless Functions
- Google Books REST API

---

## 📌 Future Enhancements

- ⭐ Ratings & notes per book
- 📤 Export / Import shelves
- 📊 Shelf sorting & filtering
- 🔍 Infinite scroll
- 🧪 Unit tests (Vitest)
- 📱 Responsive mobile optimization
- 📊 Rate limiting + observability
- 🌍 Edge runtime optimization

---

```code
.env.local

GOOGLE_BOOKS_KEY=your_key_here

```

---

## 🏗 Architecture

```code
Client (Vite / React)
        │
        ▼
/api/books  →  Vercel Serverless Function
        │
        ▼
Google Books API
```

---

## 📂 Project Structure

```txt
api/
  normalize.ts
  book.ts
  books.ts
  ping.ts

src/
  components/
    books/
      BookCard.tsx
      BookDetailsModal.tsx
      BookDetailsRouteModal.tsx
      BookGrid.tsx
      BookSearchBar.tsx
      ShelfList.tsx
      ShelvesTabs.tsx
    layout/
      AppLayout.tsx
      Header.tsx
    ui/
      Button.tsx
      EmptyState.tsx
      Input.tsx
      Spinner.tsx

  context/
    ShelvesContext.ts
    ShelvesProvider.tsx
    shelvesStore.ts
    useShelves.ts

  hooks/
    useBookDetails.ts
    useBookSearch.ts
    useDebounce.ts
    useLocalStorageState.ts
    useShelves.ts

  pages/
    BookDetailsPage.tsx
    HomePage.tsx

  services/
    googleBooks.ts
    schemas.ts

  styles/
    abstracts/
      _mixins.scss
      _variables.scss
    base/
      _global.scss
      _reset.scss
    components/
      _book-card.scss
      _card.scss
      _controls.scss
      _detailsPage.scss
      _empty.scss
      _grid.scss
      _modal.scss
      _panel.scss
      _search.scss
      _shelf.scss
      _shelves.scss
      _tabs.scss
    layout/
      _app.scss
    main.scss

  types/
    book.ts
    shelf.ts

  utils/
    format.ts

  App.tsx
  main.tsx
```

---
