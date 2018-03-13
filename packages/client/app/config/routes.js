import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import BooksComponentWithData from '../components/BooksComponent';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000' }),
  cache: new InMemoryCache()
});

const AppBarComponent = () => <AppBar title="GraphQL React" />;

const routes = (
	<MuiThemeProvider>
		<ApolloProvider client={client}>
			<BrowserRouter>
				<div>
					<AppBarComponent />
					<Switch>
						<Route exact path="/" component={ BooksComponentWithData } />
					</Switch>
				</div>
			</BrowserRouter>
		</ApolloProvider>
	</MuiThemeProvider>
);

export default routes;
