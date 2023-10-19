import { BOOKS_PER_PAGE, authors, genres } from "../data/data.js";
import { html, app } from "./bookListConfig.js";
import "../components/book-preview.js";

export const createHtmlItems = () => {
  const extractedBooks = app.matches.slice(app.range[0], app.range[1]);
  let itemsHTML = '';

  for (const { author, image, title, id } of extractedBooks) {
    const authorName = authors[author]; // Assuming 'authors' is a valid array or object.
    itemsHTML += `<book-preview id="${id}" image="${image}" title="${title}" author="${authorName}"></book-preview>`;
  }

  html.buttons.items.innerHTML = itemsHTML;
};

export const calcShowMoreButton = () => {
  const remainingCount = Math.max(app.matches.length - app.page * BOOKS_PER_PAGE, 0);
  const buttonText = `Show more (${remainingCount})`;

  html.buttons.listButton.value = buttonText;
  html.buttons.listButton.disabled = remainingCount <= 0;
  html.buttons.listButton.innerHTML = `
      <span>Show more</span>
      <span class="list__remaining"> (${remainingCount})</span>
    `;
};

export const createGenreOptions = () => {
  const genresFragment = document.createDocumentFragment();
  let elementGenre = document.createElement("option");
  elementGenre.value = "any";
  elementGenre.innerText = "All Genres";
  genresFragment.appendChild(elementGenre);

  for (const [id, name] of Object.entries(genres)) {
    let elementGenre = document.createElement("option");
    elementGenre.value = id;
    elementGenre.innerText = name;
    genresFragment.appendChild(elementGenre);
  }

  html.searchOverlay.searchGenres.appendChild(genresFragment);
};

export const createAuthorOptions = () => {
  const authorsFragment = document.createDocumentFragment();
  let elementAuthor = document.createElement("option");
  elementAuthor.value = "any";
  elementAuthor.innerText = "All Authors";
  authorsFragment.appendChild(elementAuthor);

  for (const [id, name] of Object.entries(authors)) {
    let elementAuthor = document.createElement("option");
    elementAuthor.value = id;
    elementAuthor.innerText = name;
    authorsFragment.appendChild(elementAuthor);
  }

  html.searchOverlay.searchAuthors.appendChild(authorsFragment);
};

/** all of the functions that will run when the app is started.*/
export const initializeList = () => {
  createHtmlItems();

  calcShowMoreButton();

  createAuthorOptions();
  createGenreOptions();
};
