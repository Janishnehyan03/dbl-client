// ApolloProvider.js
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as Provider,
  createHttpLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const httpLink = createHttpLink({
  uri: "http://localhost:5000/graphql", // Replace with your GraphQL server endpoint
});

// Create an error link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const client = new ApolloClient({
  link: errorLink.concat(httpLink), // Combine error link and http link
  cache: new InMemoryCache(),
});

const ApolloProvider = ({ children }: any) => {
  return <Provider client={client}>{children}</Provider>;
};

export default ApolloProvider;
