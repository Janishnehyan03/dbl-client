// src/graphql/queries/memberQuery.js
import { gql } from "@apollo/client";

export const GET_STUDENTS = gql`
  query getStudents($limit: Int) {
    students(limit: $limit) {
      id
      studentName
      admissionNumber
      class{
        className
      }
      section{
        sectionName
      }
    }
  }
`;
