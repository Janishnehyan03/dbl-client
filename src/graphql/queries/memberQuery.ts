// src/graphql/queries/memberQuery.js
import { gql } from "@apollo/client";

export const GET_MEMBERS = gql`
  query {
    members {
      id
      memberType
      admissionNumber
      studentName
      class
      section
      teacherName
      uniqueId
    }
  }
`;

export const GET_TOTAL_MEMBERS = gql`
  query {
    totalMembers
    studentsCount
    teachersCount
  }
`;
