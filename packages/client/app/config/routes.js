import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import BooksComponent from '../components/BooksComponent';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

const AppBarComponent = () => <AppBar title="GraphQL React" />;

const routes = (
	<MuiThemeProvider>
		<BrowserRouter>
			<div>
				<AppBarComponent />
				<Switch>
					<Route exact path="/" component={BooksComponent} />
				</Switch>
			</div>
		</BrowserRouter>
	</MuiThemeProvider>
);

export default routes;
