import { books, BOOKS_PER_PAGE } from '../../data/data.js'

export const bookPagination = {
    page: 1, // Current page number
    matches: books, // Initialize with your data or default value
    range: [0, BOOKS_PER_PAGE], // Initial range
};