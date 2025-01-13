// queries.js
import { gql } from "@apollo/client";

export const GET_ALL_BOOKS = gql`
  query GetAllBooks($limit: Int, $skip: Int) {
    books(limit: $limit, skip: $skip) {
      id
      title
      accNumber
      ISBN
      callNumber
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
export const GET_BOOK_DETAILS = gql`
  query GetBookDetails($id: ID!) {
    book(id: $id) {
      title
      englishTitle
      accNumber
      callNumber
      ISBN
      description
      numberOfPages
      price
      published
      tags
      coverImage
      issuedBy {
        studentName
        teacherName
        uniqueId
        admissionNumber
        class {
          className
        }
        section {
          sectionName
        }
      }
      authors {
        id
        firstName
        lastName
      }
      publishers {
        publisherName
      }
      language {
        languageName
      }
      category {
        categoryName
      }
      location {
        locationName
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
      authors {
        id
        firstName
        lastName
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

export const GET_BOOKS_BY_TAG = gql`
  query BooksByTag($tag: String!) {
    booksByTag(tag: $tag) {
      id
      title
      authors {
        id
        firstName
        lastName
      }
      publishers {
        publisherName
      }
      language {
        languageName
      }
      category {
        categoryName
      }
      tags
    }
  }
`;

export const GET_BOOKS_BY_AUTHOR = gql`
  query BooksByAuthor($author: ID!) {
    booksByAuthor(author: $author) {
      id
      title
      authors {
        id
        firstName
        lastName
      }
      publishers {
        publisherName
      }
      language {
        languageName
      }
      category {
        categoryName
      }
      tags
    }
  }
`;
