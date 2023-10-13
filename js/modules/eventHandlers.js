import { html, createHtmlItems, createPreviewItem } from "./utility.js";
import { authors, BOOKS_PER_PAGE } from "../../data/data.js";
import { bookPagination } from "./bookPagination.js";

let matches = bookPagination.matches;
let page = bookPagination.page;
let range = bookPagination.range;

/**
 * Handles the submission of a settings form and updates the page's theme accordingly.
 *
 * @function
 * @param {Event} event - The event object representing the form submission.
 * @returns {void}
 *
 * @description This function prevents the default form submission behavior, extracts the selected
 * theme from the form data, and dynamically updates the page's theme by modifying CSS variables.
 * If the selected theme is "night," it sets dark theme colors; otherwise, it sets light theme colors.
 * After handling the form submission, it closes the settings overlay.
 */
export const handleSettingsFormSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);

  if (theme === "night") {
    document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
    document.documentElement.style.setProperty("--color-light", "10, 10, 20");
  } else {
    document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
    document.documentElement.style.setProperty(
      "--color-light",
      "255, 255, 255"
    );
  }

  html.overlays.settings.open = false;
};

/**
 * Handles the cancellation of a settings form and closes the settings overlay.
 *
 * @function
 * @returns {void}
 *
 * @description This function is responsible for canceling any changes made in a settings form
 * and closing the settings overlay without saving the changes.
 */
export const handleSettingsCancel = () => {
  html.overlays.settings.open = false;
};

/**
 * Handles a click event on the header settings button to open the settings overlay.
 *
 * @function
 * @returns {void}
 *
 * @description This function is triggered when the user clicks on the header settings button.
 * It sets the `open` property of the `html.overlays.settings` object to `true`, displaying the
 * settings overlay.
 */
export const handleHeaderSettingsClick = () => {
  html.overlays.settings.open = true;
};

/**
 * Event listener for the "Show more" button to display the next set of books.
 *
 * @function
 * @returns {void}
 *
 * @description This function is triggered when the "Show more" button is clicked. It increments
 * the `page` variable, calculates the `startIndex` and `endIndex` for the next set of books,
 * and displays them using the `createHtmlItems` function. It also updates the "Show more" button's
 * text and disabled state based on the number of remaining books to show.
 */
export const handleShowMoreButton = () => {
  //Increment the page number
  page++;

  const startIndex = (page - 1) * BOOKS_PER_PAGE;
  const endIndex = page * BOOKS_PER_PAGE;

  // Display the next set of books
  createHtmlItems();

  const remaining = matches.length - endIndex;
  html.buttons.listButton.disabled = endIndex >= matches.length;
  html.buttons.listButton.textContent = `Show more (${remaining})`;
};

/**
 * Handles the submission of a search form, filters books based on search criteria, and displays the results.
 *
 * @function
 * @param {Event} event - The event object representing the form submission.
 * @returns {void}
 *
 * @description This function is triggered when the user submits a search form. It prevents the default
 * form submission behavior, extracts search filters from the form, filters books based on criteria such
 * as title, author, and genre, and displays the matching books. If no books match the criteria, it shows
 * a message. After handling the form submission, it closes the search overlay, resets the "Show more"
 * button, and scrolls the window to the top.
 */
export const handleSearchFormSubmit = (event) => {
  event.preventDefault();
  html.buttons.items.innerHTML = "";

  // Get search filters from the form
  const formData = new FormData(html.searchOverlay.searchForm);
  const filters = Object.fromEntries(formData);
  const result = [];

  // Filter books based on search criteria
  for (const book of matches) {
    const titleMatch =
      filters.title.trim() === "" || // If the search text is empty, it considers it a match
      book.title.toLowerCase().includes(filters.title.toLowerCase());
    const authorMatch =
      filters.author === "any" || //If "any" author is selected in the form, it considers it a match
      book.author === filters.author;
    const genreMatch =
      filters.genre === "any" || book.genres.includes(filters.genre);

    if (titleMatch && authorMatch && genreMatch) {
      result.push(book);
    }
  }

  // Show a message if no books match the criteria

  if (result.length < 1) {
    html.buttons.items.innerHTML = "";
    html.message.noResult.classList.add("list__message_show");
  } else {
    html.message.noResult.classList.remove("list__message_show");

    const fragment = document.createDocumentFragment();

    result.forEach((book) => {
      const element = createPreviewItem(book);

      fragment.appendChild(element);
    });

    html.buttons.items.appendChild(fragment);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
  html.buttons.listButton.textContent = `Show more (0)`;
  html.overlays.search.open = false;
  html.buttons.listButton.disabled = true;
};

/**
 * Closes the active list overlay.
 *
 * @function
 * @returns {void}
 *
 * @description This function is responsible for closing the active list overlay when called.
 * It allows the user to hide the details of a book and return to the previous state or view.
 */
export const handleCloseButton = () => {
  html.overlays.listActive.open = false;
};

/**
 * Handles the click event on a book preview, displaying its details in the active list overlay.
 *
 * @function
 * @param {Event} event - The event object representing the click on a book preview.
 * @returns {void}
 *
 * @description This function is triggered when a user clicks on a book preview. It opens the active
 * list overlay and identifies the clicked book based on the event's target and data attributes. It then
 * displays the details of the clicked book, such as its image, title, author, publication year, and description.
 * If no book is identified, the function exits early.
 */
export const handleActiveListItem = (event) => {
  // Open the book details panel
  html.overlays.listActive.open = true;

  let pathArray = Array.from(event.path || event.composedPath());
  let active = null;

  // Find the clicked book
  for (const node of pathArray) {
    //code loops through the pathArray to find the clicked book preview

    if (active) break;

    const previewId = node?.dataset?.preview; //capture the ID of the book clicked

    for (const singleBook of matches) {
      if (singleBook.id === previewId) {
        active = singleBook;
        break;
      }
    }
  }

  // Display book details
  if (!active) return;
  /*If active is falsy, it means that no specific book was identified
  return; is used to exit the current function or code block immediately, and the subsequent lines of code are not executed.*/

  html.activeOverlay.listImage.setAttribute("src", active.image);
  html.activeOverlay.listBlur.style.backgroundImage = `url(${active.image})`;
  html.activeOverlay.listTitle.textContent = active.title;
  html.activeOverlay.listSubtitle.textContent = `${
    authors[active.author]
  } (${new Date(active.published).getFullYear()})`;
  html.activeOverlay.listDescription.textContent = active.description;
};

/**
 * Opens the search overlay and focuses on the search input field.
 *
 * @function
 * @returns {void}
 *
 * @description This function is responsible for opening the search overlay and setting focus on the
 * search input field when called. It allows the user to initiate a search operation by displaying the
 * search interface.
 */
export const handleSearchOpen = () => {
  html.overlays.search.open = true;
  html.searchOverlay.searchTitle.focus();
};

/**
 * Cancels and closes the search overlay.
 *
 * @function
 * @returns {void}
 *
 * @description This function is responsible for canceling any ongoing search operation and closing
 * the search overlay. It provides a way for the user to exit the search interface without performing
 * a search.
 */
export const handleSearchCancel = () => {
  html.overlays.search.open = false;
};
