/**
 * Import statement for data and constants used in the application.
 *
 * @module
 * @see module:data
 *
 * @description This import statement imports various data objects and constants used in the application,
 * including 'books', 'authors', 'genres', 'BOOKS_PER_PAGE', and 'html'. These imported values are used
 * throughout the code to interact with and manipulate data, as well as to access HTML elements and settings.
 */
import { initializeList, html } from "./modules/utility.js";

import {
  handleActiveListItem,
  handleCloseButton,
  handleHeaderSettingsClick,
  handleSearchCancel,
  handleSearchFormSubmit,
  handleSearchOpen,
  handleSettingsCancel,
  handleSettingsFormSubmit,
  handleShowMoreButton,
} from "./modules/eventHandlers.js";

initializeList();

// Event listeners for handling Settings
html.settingsOverlay.settingsForm.addEventListener(
  "submit",
  handleSettingsFormSubmit
);
html.buttons.headerSettings.addEventListener(
  "click",
  handleHeaderSettingsClick
);
html.settingsOverlay.settingsCancel.addEventListener(
  "click",
  handleSettingsCancel
);

// Event listener for show more button
html.buttons.listButton.addEventListener("click", handleShowMoreButton);

// Event listeners for handling Search functionality
html.searchOverlay.searchForm.addEventListener(
  "submit",
  handleSearchFormSubmit
);

html.buttons.headerSearch.addEventListener("click", handleSearchOpen);
html.searchOverlay.searchCancel.addEventListener("click", handleSearchCancel);

// Event listeners for handling Active list
html.buttons.items.addEventListener("click", handleActiveListItem);
html.activeOverlay.listClose.addEventListener("click", handleCloseButton);
