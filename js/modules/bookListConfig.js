import { books, BOOKS_PER_PAGE } from "../data/data.js"

export const html = {
  buttons: {
    items: document.querySelector("[data-list-items]"),
    listButton: document.querySelector("[data-list-button]"),
    headerSearch: document.querySelector("[data-header-search]"),
    headerSettings: document.querySelector("[data-header-settings]"),
  },
  overlays: {
    listActive: document.querySelector("[data-list-active]"),
    search: document.querySelector("[data-search-overlay]"),
    settings: document.querySelector("[data-settings-overlay]"),
  },
  searchOverlay: {
    searchForm: document.querySelector("[data-search-form]"),
    searchCancel: document.querySelector("[data-search-cancel]"),
    searchTitle: document.querySelector("[data-search-title]"),
    searchGenres: document.querySelector('[data-search-genres]'),
    searchAuthors: document.querySelector('[data-search-authors]'),
  },
  settingsOverlay: {
    settingsForm: document.querySelector("[data-settings-form]"),
    settingsCancel: document.querySelector("[data-settings-cancel]"),
    settingsTheme: document.querySelector("[data-settings-theme]"),
  },
  activeOverlay: {
    listClose: document.querySelector("[data-list-close]"),
    listBlur: document.querySelector("[data-list-blur]"),
    listImage: document.querySelector("[data-list-image]"),
    listTitle: document.querySelector("[data-list-title]"),
    listSubtitle: document.querySelector("[data-list-subtitle]"),
    listDescription: document.querySelector("[data-list-description]"),
  },
  message: {
    noResult: document.querySelector("[data-list-message]"),
  },
};

export const app = {
  matches: books,
  page: 1,
  range: [0, BOOKS_PER_PAGE]
}

export const themeColors = {
  light: '255, 255, 255',
  dark: '10, 10, 20',
}