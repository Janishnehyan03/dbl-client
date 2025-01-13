// src/graphql/queries/teacherQuery.js
import { gql } from "@apollo/client";

export const GET_TEACHERS = gql`
  query getTeachers($limit: Int, $searchTerm: String) {
    teachers(limit: $limit, searchTerm: $searchTerm) {
      id
      teacherName
      uniqueId
      section {
        sectionName
      }
    }
  }
`;
