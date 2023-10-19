import { html } from "./modules/bookListConfig.js";
import {
  handleSearchOpen,
  handleSearchCancel,
  filterBooks,
  handleThemeCancel,
  handleThemeFormSubmit,
  handleThemeToggle,
  handleActiveListItem,
  handleCloseButton,
  loadMoreBooks,
} from "./modules/eventHandlers.js";
import { initializeList } from "./modules/utility.js";

initializeList();

// Event listeners for handling Settings
html.settingsOverlay.settingsForm.addEventListener(
  "submit",
  handleThemeFormSubmit
);
html.buttons.headerSettings.addEventListener(
  "click",
  handleThemeToggle
);
html.settingsOverlay.settingsCancel.addEventListener(
  "click",
  handleThemeCancel
);

// Event listener for show more button
html.buttons.listButton.addEventListener("click", loadMoreBooks);

// Event listeners for handling Search functionality
html.searchOverlay.searchForm.addEventListener(
  "submit",
  filterBooks
);

html.buttons.headerSearch.addEventListener("click", handleSearchOpen);
html.searchOverlay.searchCancel.addEventListener("click", handleSearchCancel);

// Event listeners for handling Active list
html.buttons.items.addEventListener("click", handleActiveListItem);
html.activeOverlay.listClose.addEventListener("click", handleCloseButton);
