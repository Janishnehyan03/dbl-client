// queries.js
import { gql } from "@apollo/client";

export const GET_ALL_BOOKS = gql`
  query GetAllBooks {
    books {
      id
      title
      accNumber
      category {
        categoryName
      }
      language {
        languageName
      }
      location {
        locationName
      }
      numberOfPages
      edition
      published
      authors {
        firstName
        lastName
      }
    }
  }
`;

export const GET_BOOK_BY_ID = gql`
  query GetBookById($id: ID!) {
    getBookById(id: $id) {
      _id
      title
      accNumber
      category {
        categoryName
      }
      language {
        languageName
      }
      location {
        locationName
      }
      numberOfPages
      edition
      published
      author {
        name
      }
    }
  }
`;

export const GET_BOOKS_COUNT = gql`
  query {
    totalBooks
    issuedBooks
    dueBooks
  }
`;
