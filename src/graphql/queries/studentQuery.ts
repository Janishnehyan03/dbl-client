// src/graphql/queries/studentQuery.js
import { gql } from "@apollo/client";

export const GET_STUDENTS = gql`
  query getStudents($limit: Int, $searchTerm: String) {
    students(limit: $limit, searchTerm: $searchTerm) {
      id
      studentName
      admissionNumber
      class {
        className
      }
      section {
        sectionName
      }
    }
  }
`;
