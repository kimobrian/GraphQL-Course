import React, { Component } from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { styles } from './Authentication';
import { Link } from 'react-router-dom';

class NewBook extends Component {
	constructor(props) {
		super();
		this.state = {
			title: '',
			description: '',
			titleError: null,
			descriptionError: null
		};

		this.createBook = this.createBook.bind(this);
		this.updateTitle = this.updateTitle.bind(this);
		this.updateDescription = this.updateDescription.bind(this);
	}

	createBook() {
		this.setState({ titleError: null, descriptionError: null });
		if (!this.state.title) this.setState({ titleError: 'Book Title Required' });
		if (!this.state.description) this.setState({ descriptionError: 'Book Description Required' });
		if (!this.state.title || !this.state.description) return;
	}

	updateTitle(_, newValue) {
		this.setState({ title: newValue });
	}

	updateDescription(_, newValue) {
		this.setState({ description: newValue });
	}

	render() {
		return (
			<div style={styles.flexContainer}>
				<Card expanded style={styles.card}>
					<CardHeader title="CREATE NEW BOOK" />
					<CardText expandable={true}>
						<div style={styles.center}>
              <div>
                <Link to="/"><FlatButton label="View Books List" secondary={true} /></Link>
              </div>
							<TextField
								hintText="Book Title"
								floatingLabelText="Book Title"
								onChange={this.updateTitle}
								errorText={this.state.titleError}
								value={this.state.title}
							/>
							<br />
							<TextField
								hintText="Description"
								floatingLabelText="Description"
								errorText={this.state.descriptionError}
								onChange={this.updateDescription}
                value={this.state.description}
                multiLine
							/>
							<br />
							<RaisedButton label="Create Book" primary={true} onClick={this.createBook} />
						</div>
					</CardText>
				</Card>
			</div>
		);
	}
}

export default NewBook;
