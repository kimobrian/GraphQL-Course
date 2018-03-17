import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import BooksComponentWithData from '../components/BooksComponent';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Authentication from '../components/Authentication';

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';

import NewBookComponentWithData from '../components/NewBook';
import FlatButton from 'material-ui/FlatButton';
import { isLoggedIn, logout } from '../utils';
import { setContext } from 'apollo-link-context';

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('authToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: Object.assign({}, headers, { Authorization: token ? `Bearer ${token}` : "" }) 
  }
});

const defaultOptions = {
  query: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  }
};

const client = new ApolloClient({
  link: authLink.concat(new HttpLink({ uri: 'http://localhost:4000' })),
  cache: new InMemoryCache(),
  q
  connectToDevTools: true
});

let logoutButton = () => {
  let button = isLoggedIn() ? (
    <FlatButton label="LOGOUT" onClick={logout} />
  ) : window.location.pathname !== '/login' ? (
    <FlatButton label="LOGIN" onClick={() => (window.location.href = '/login')} />
  ) : null;
  return button;
};

const AppBarComponent = () => <AppBar title="GraphQL React" iconElementRight={logoutButton()} />;

const routes = (
  <MuiThemeProvider>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <div>
          <AppBarComponent />
          <br />
          <Switch>
            <Route exact path="/" component={BooksComponentWithData} />
            <Route path="/login" component={Authentication} />
            <Route
              path="/new"
              render={() => {
                return isLoggedIn() ? <NewBookComponentWithData /> : <Redirect to="/login" />;
              }}
            />
            <Route path="*" component={Authentication} />
          </Switch>
        </div>
      </BrowserRouter>
    </ApolloProvider>
  </MuiThemeProvider>
);

export default routes;
