import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, ListItem } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import { isLoggedIn } from '../utils';

const getBooksQuery = gql`
	query getAllBooks {
		books: fetchAllBooks {
			id
			title
			description
		}
	}
`;

class BooksComponent extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let { error, loading, books } = this.props.data;
		if (error) return <div> An Error Occurred</div>;
		else if (loading)
			return (
				<div style={styles.loaderSection}>
					<CircularProgress />
				</div>
			);
		else
			return (
				<Card expanded>
					<CardHeader title="Books List" />
					<CardText expandable={true}>
					{ isLoggedIn() ? (<Link to="/new"><FlatButton label="Create a New Book" primary={true} /></Link>): null }
						<List>
							{books.map(book => {
								return (
									<ListItem
										key={book.id}
										primaryText={<p> {book.title} </p>}
										secondaryText={<p> {book.description} </p>}
										secondaryTextLines={2}
									/>
								);
							})}
						</List>
					</CardText>
				</Card>
			);
	}
}

const styles = {
	loaderSection: {
		textAlign: 'center'
	}
};

const BooksComponentWithData = graphql(getBooksQuery)(BooksComponent);
export default BooksComponentWithData;
