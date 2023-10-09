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
import { books, authors, genres, BOOKS_PER_PAGE, html } from "./data.js";

/**
 * Represents the current page number.
 * 
 * @type {number}
 * @description This variable stores the current page number for pagination purposes.
 * 
 * @default 1
 */
let page = 1; // Current page number

/**
 * List of books that match the search filters.
 * 
 * @type {Array<Object>}
 * @description This variable stores a list of books that match the search filters.
 * 
 * @default An array containing all books from the 'books' data source.
 */
let matches = books; 
/**
 * Range of indices for displaying a subset of books.
 *
 * @type {Array<number>}
 * @default [0, 36]
 * 
 * @description The 'range' variable defines a range of indices used for displaying a subset of books on a
 * single page. It is initially set to start from index 0 and end at index 36 by default.
 */
let range = [0, 36];

/**
 * Create a button element for a book
 * @param {Object} book - Book object
 * @param {string} book.author - Author of book
 * @param {string} book.id - Id of book
 * @param {string} book.image - Image of book
 * @param {string} book.title - Title of book
 * @returns {HTMLButtonElement} - Preview button element
 */

const createPreview = ({ author, id, image, title }) => {
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

const createHtmlItems = () => {
  const starting = document.createDocumentFragment();
  let extracted = matches.slice(range[0], range[1]);

  for (const { author, image, title, id } of extracted) {
    //for...of loop to iterate through an object

    const preview = createPreview({
      author,
      id,
      image,
      title,
    });

    starting.appendChild(preview);
  }

  html.buttons.items.appendChild(starting);
};

createHtmlItems();

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

const createGenreOptions = () => {
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
createGenreOptions();

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
const createAuthorOptions = () => {
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
createAuthorOptions();

const prefersDarkMode =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;
html.settingsOverlay.settingsTheme.value = prefersDarkMode ? "night" : "day";
document.documentElement.style.setProperty(
  "--color-dark",
  prefersDarkMode ? "255, 255, 255" : "10, 10, 20"
);
document.documentElement.style.setProperty(
  "--color-light",
  prefersDarkMode ? "10, 10, 20" : "255, 255, 255"
);


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
const handleSettingsFormSubmit = (event) => {
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
const handleSettingsCancel = () => {
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
const handleHeaderSettingsClick = () => {
  html.overlays.settings.open = true;
};

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

// Set the inner HTML of the listButton to display a "Show more" button
// along with the remaining number of books to be displayed, if any.
// The number of remaining books is calculated based on 'matches' array length
// and the current 'page' and 'BOOKS_PER_PAGE' values.

// Updates the "Show more" button text and remaining book count.
html.buttons.listButton.innerHTML = /* html */ [
  `<span>Show more</span>
    <span class="list__remaining"> (${
      matches.length - page * BOOKS_PER_PAGE > 0
        ? matches.length - page * BOOKS_PER_PAGE
        : 0
    })</span>`,
];


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
const handleShowMoreButton = () => {
  //Increment the page number
  page++;

  const startIndex = (page - 1) * BOOKS_PER_PAGE;
  const endIndex = page * BOOKS_PER_PAGE;

  // Display the next set of books
  createHtmlItems()

  const remaining = matches.length - endIndex;
  html.buttons.listButton.disabled = endIndex >= matches.length;
  html.buttons.listButton.textContent = `Show more (${remaining})`;
};

html.buttons.listButton.addEventListener("click", handleShowMoreButton);

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
const handleSearchFormSubmit = (event) => {
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

    // Display filtered books
    for (const book of result) {
      const { author, image, title, id } = book;

      const element = createPreview({
        author,
        id,
        image,
        title,
      });

      fragment.appendChild(element);
    }

    html.buttons.items.appendChild(fragment);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
  html.buttons.listButton.textContent = `Show more (0)`;
  html.overlays.search.open = false;
  html.buttons.listButton.disabled = true;
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
const handleSearchOpen = () => {
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
const handleSearchCancel = () => {
  html.overlays.search.open = false;
};

html.searchOverlay.searchForm.addEventListener("submit", handleSearchFormSubmit);
html.buttons.headerSearch.addEventListener("click", handleSearchOpen);
html.searchOverlay.searchCancel.addEventListener("click", handleSearchCancel);

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
const handleActiveListItem = (event) => {
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
 * Closes the active list overlay.
 *
 * @function
 * @returns {void}
 * 
 * @description This function is responsible for closing the active list overlay when called.
 * It allows the user to hide the details of a book and return to the previous state or view.
 */
const handleCloseButton = () => {
  html.overlays.listActive.open = false;
};

html.buttons.items.addEventListener("click", handleActiveListItem);
html.activeOverlay.listClose.addEventListener("click", handleCloseButton);
