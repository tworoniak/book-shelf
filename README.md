# React + TypeScript + Vite + Sass

# 📚 Book Shelf v1.0

A modern React + TypeScript + Vite + Sass application that searches the Google Books API and lets you organize books into personal shelves:

- ✅ Want to Read
- 📖 Reading
- ✔ Read

All shelves persist locally using localStorage.

---

## ✨ Features

- 🔎 Debounced search via Google Books API
- 📘 Book cards with cover, title, authors, metadata
- 🗂 Tabs-based shelf management
- 💾 Persistent shelves (localStorage)
- ⏭ Pagination (Prev / Next)
- 🎨 Modular Sass architecture
- ⚡ Fast Vite development environment
- 🔒 API key secured via referrer restrictions

---

## 🛠 Tech Stack

- React 18
- TypeScript
- Vite
- Sass (SCSS modules structure)
- Google Books REST API

---

## 📌 Future Enhancements

- 🔍 Infinite scroll
- ⭐ Ratings & notes per book
- 📤 Export / Import shelves
- 📊 Shelf sorting & filtering
- 🧾 Detailed book modal
- 🔄 Deduplicate by ISBN-13
- 🧪 Unit tests (Vitest)
- 📱 Responsive mobile optimization
- ☁ Move API calls to Vercel Edge Function

---

```code
.env.local

VITE_GOOGLE_BOOKS_KEY=your_key_here

```

---

```txt
src/
  api/
    googleBooks.ts
    schemas.ts

  components/
    books/
      BookCard.tsx
      BookDetails.tsx
      BookDetailsModal.tsx
      BookGrid.tsx
      BookSearchBar.tsx
      ShelfList.tsx
      Shelves.tsx
      ShelvesTabs.tsx
    layout/
      AppLayout.tsx
      Header.tsx
    ui/
      Button.tsx
      EmptyState.tsx
      Input.tsx
      Spinner.tsx

  hooks/
    useBookDetails.ts
    useBookSearch.ts
    useDebounce.ts
    useLocalStorageState.ts
    useShelves.ts

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
