import { themeColors, html, app } from "./bookListConfig.js";
import { BOOKS_PER_PAGE, authors, books } from "../data/data.js";
import { calcShowMoreButton, createHtmlItems } from "./utility.js";

export const loadMoreBooks = () => {
  app.page = app.page + 1;
  app.range[0] = app.range[0] + BOOKS_PER_PAGE;
  app.range[1] = app.range[1] + BOOKS_PER_PAGE;

  createHtmlItems();

  calcShowMoreButton();
};

export const filterBooks = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);

  app.matches = [];

  for (const book of books) {
    const titleMatch =
      filters.title.trim() === "" ||
      book.title.toLowerCase().includes(filters.title.toLowerCase());
    const authorMatch =
      filters.author === "any" || book.author === filters.author;
    const genreMatch =
      filters.genre === "any" ||
      book.genres.some((singleGenre) => singleGenre === filters.genre);

    if (titleMatch && authorMatch && genreMatch) {
      app.matches.push(book);
    }
  }

  if (app.matches.length < 1) {
    handleNoResults();
  } else {
    resetPagination();
    createHtmlItems();
    calcShowMoreButton();
    scrollToTop();
  }
};

function handleNoResults() {
  html.message.noResult.classList.add("list__message_show");
  html.buttons.items.innerHTML = "";
  calcShowMoreButton();
  html.overlays.search.open = false;
}

function resetPagination() {
  app.page = 1;
  app.range[0] = 0;
  app.range[1] = BOOKS_PER_PAGE;
  html.message.noResult.classList.remove("list__message_show");
  html.buttons.items.innerHTML = "";
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  html.overlays.search.open = false;
}

export const handleSearchOpen = () => {
  html.overlays.search.open = true;
  html.searchOverlay.searchTitle.focus();
};

export const handleSearchCancel = () => {
  html.overlays.search.open = false;
};

export const handleThemeToggle = () => {
  const theme = document.documentElement.style.getPropertyValue("--color-dark");
  html.settingsOverlay.settingsTheme.value =
    theme === "" || theme === themeColors.light ? "night" : "day";
  html.overlays.settings.open = true;
};

export const handleThemeCancel = () => {
  html.overlays.settings.open = false;
};

export const handleThemeFormSubmit = (event) => {
  event.preventDefault();
  const theme = html.settingsOverlay.settingsTheme.value;

  if (theme === "night") {
    setTheme(themeColors.light, themeColors.dark);
  } else {
    setTheme(themeColors.dark, themeColors.light);
  }

  html.overlays.settings.open = false;
};

function setTheme(darkColor, lightColor) {
  document.documentElement.style.setProperty("--color-dark", darkColor);
  document.documentElement.style.setProperty("--color-light", lightColor);
}

export const handleActiveListItem = (event) => {
  const previewId = event.target.id;
  const active = books.find((singleBook) => singleBook.id === previewId);

  if (!active) return;

  html.overlays.listActive.open = true;
  html.activeOverlay.listBlur.src = active.image;
  html.activeOverlay.listImage.src = active.image;
  html.activeOverlay.listTitle.innerHTML = active.title;
  html.activeOverlay.listSubtitle.innerHTML = `${authors[active.author]
    } (${new Date(active.published).getFullYear()})`;
  html.activeOverlay.listDescription.innerHTML = active.description;
};

export const handleCloseButton = () => {
  html.overlays.listActive.open = false;
};
