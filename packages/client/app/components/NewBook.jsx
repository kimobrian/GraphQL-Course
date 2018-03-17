import React, { Component } from "react";
import { Card, CardHeader, CardText } from "material-ui/Card";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import { styles } from "./Authentication";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { getBooksQuery } from "./BooksComponent";

export let createBookMutation = gql`
  mutation createBook($title: String!, $description: String!) {
    createBook(title: $title, description: $description) {
      id
      title
      description
    }
  }
`;

class NewBook extends Component {
  constructor () {
    super();
    this.state = {
      title: "",
      description: "",
      titleError: null,
      descriptionError: null
    };

    this.createBook = this.createBook.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.updateDescription = this.updateDescription.bind(this);
  }

  createBook () {
    this.setState({ titleError: null, descriptionError: null });
    if (!this.state.title) this.setState({ titleError: "Book Title Required" });
    if (!this.state.description) this.setState({ descriptionError: "Book Description Required" });
    if (!this.state.title || !this.state.description) return;
    this.props.createNewBook(this.state.title, this.state.description).then((/*{ data }*/)=> {
      this.setState({ title: "", description: "" });
      window.location.href="/";
    }).catch(err => {
      console.log("Error:::", err); // eslint-disable-line no-console
    });
  }

  updateTitle (_, newValue) {
    this.setState({ title: newValue });
  }

  updateDescription (_, newValue) {
    this.setState({ description: newValue });
  }

  render () {
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

const NewBookComponentWithData = graphql(createBookMutation, {
  props: ({ mutate }) => ({
    createNewBook: (title, description) =>
      mutate({
        variables: { title, description },
        // Optimistic UI updates
        optimisticResponse: {
          createBook: {
            title,
            description,
            id: Math.round(Math.random() * -1000000), // Generate a random ID
            __typename: "Book",
          },
        },
        update: (store, { data: { createBook } }) => {
          // Read the data from our cache for this query.
          try {
            const data = store.readQuery({ query: getBooksQuery });
            // Add our book from the mutation to the end.
            data.books.push(createBook);
            // Write our data back to the cache.
            store.writeQuery({ query: getBooksQuery, data });
          } catch(err){
            console.log("Cache Error:", err); // eslint-disable-line no-console
          }
        },
      })
  })
})(NewBook);

export default NewBookComponentWithData;
