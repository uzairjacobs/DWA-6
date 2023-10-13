import { authors, genres, books, BOOKS_PER_PAGE } from "../../data/data.js";
import { bookPagination } from "./bookPagination.js";

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
    searchGenre: document.querySelector("[data-search-genres]"),
    searchAuthor: document.querySelector("[data-search-authors]"),
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

let matches = bookPagination.matches;
let page = bookPagination.page;
let range = bookPagination.range;

/**
 * Create a button element for a book
 * @param {Object} book - Book object
 * @param {string} book.author - Author of book
 * @param {string} book.id - Id of book
 * @param {string} book.image - Image of book
 * @param {string} book.title - Title of book
 * @returns {HTMLButtonElement} - Preview button element
 */

// Factory function that creates a button element for a book
export const createPreviewItem = (book) => {
  const { author, id, image, title } = book;
  // Create a new button element for the book preview
  const preview = document.createElement("button");
  preview.classList = "preview"; // Add the 'preview' class to the button
  preview.setAttribute("data-preview", id);
  // Set the 'data-preview' attribute to the book's ID for reference

  // Set the inner HTML of the button to display book information
  preview.innerHTML = /* html */ `
      <img class = "preview__image" src="${image}" alt="${title}">
      <div class="preview__info">
      <h2 class="preview__title">${title}</h2>
      <h3 class="preview__author">${authors[author]}</h3> 
      </div>
      `;

  // Return the created preview button element
  return preview;
};

/**
 * Creates and appends HTML items to a specified container based on extracted data.
 *
 * @function
 * @returns {void}
 *
 * @description This function iterates through a subset of `matches` specified by the `range`
 * parameter and creates HTML elements for each item's author, image, title, and id. These
 * elements are then appended to the `html.buttons.items` container.
 */

export const createHtmlItems = () => {
  const starting = document.createDocumentFragment();
  let extracted = matches.slice(range[0], range[1]);

  extracted.forEach((book) => {
    const preview = createPreviewItem(book);
    starting.appendChild(preview);
  });
  html.buttons.items.appendChild(starting);
};

/**
 * Creates and appends HTML <option> elements representing genres to a specified container.
 *
 * @function
 * @returns {void}
 *
 * @description This function creates HTML <option> elements for each genre in the 'genres' object.
 * It starts by creating an "All Genres" option and then iterates through the 'genres' object to create
 * individual genre options. These options are appended to the specified container in the HTML document.
 */

export const createGenreOptions = () => {
  const genresFragment = document.createDocumentFragment();
  let elementGenre = document.createElement("option"); //creating html option element
  elementGenre.value = "any";
  elementGenre.innerText = "All Genres";
  genresFragment.appendChild(elementGenre); //appends the elementGenre (representing the "All Genres" option) to the genresFragment.

  for (const [id, name] of Object.entries(genres)) {
    // for each entry, the loop creates a new <option> element to represent a genre.
    let elementGenre = document.createElement("option"); // variable is scoped to the loop and won't conflict with the elementGenre variable defined outside the loop
    elementGenre.value = id;
    elementGenre.innerText = name;
    genresFragment.appendChild(elementGenre); //appends the elementGenre (representing a genre) to the genresFragment
  }

  html.searchOverlay.searchGenre.appendChild(genresFragment); //appends the entire genresFragment (containing both "All Genres" and genre options) to an HTML element with the id searchGenre
};

/**
 * Creates and appends HTML <option> elements representing authors to a specified container.
 *
 * @function
 * @returns {void}
 *
 * @description This function creates HTML <option> elements for each authors in the 'authors' object.
 * It starts by creating an "All Authors" option and then iterates through the 'authors' object to create
 * individual authors options. These options are appended to the specified container in the HTML document.
 */
export const createAuthorOptions = () => {
  const authorsFragment = document.createDocumentFragment();
  let elementAuthor = document.createElement("option");
  elementAuthor.value = "any";
  elementAuthor.innerText = "All Authors"; // all authors option
  authorsFragment.appendChild(elementAuthor); //attaches the "All Authors" option to the author fragment

  for (const [id, name] of Object.entries(authors)) {
    // for each entry, the loop creates a new <option> element to represent an author
    let elementAuthor = document.createElement("option"); // variable is scoped to the loop
    elementAuthor.value = id;
    elementAuthor.innerText = name;
    authorsFragment.appendChild(elementAuthor); // appends the author to fragment
  }

  html.searchOverlay.searchAuthor.appendChild(authorsFragment);
};

export function setThemeBasedOnUserPreference() {
  const prefersDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const theme = prefersDarkMode ? "night" : "day";

  html.settingsOverlay.settingsTheme.value = theme;

  const darkColor = prefersDarkMode ? "255, 255, 255" : "10, 10, 20";
  const lightColor = prefersDarkMode ? "10, 10, 20" : "255, 255, 255";

  document.documentElement.style.setProperty("--color-dark", darkColor);
  document.documentElement.style.setProperty("--color-light", lightColor);
}

export const initializeList = () => {
  createHtmlItems();
  createAuthorOptions();
  createGenreOptions();
  setThemeBasedOnUserPreference();
  initializeShowMoreButton();
};

export const initializeShowMoreButton = () => {
  const remainingBooks = matches.length - page * BOOKS_PER_PAGE;
  const remainingCount = remainingBooks > 0 ? remainingBooks : 0;

  html.buttons.listButton.innerHTML = /* html */ [
    `<span>Show more</span>
    <span class="list__remaining"> (${remainingCount})</span>`,
  ];
};
