import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Card, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class Login extends Component {
  constructor(props) {
    super();
    this.state = {
      passwordError: null,
      emailError: null,
      email: '',
      password: ''
    };
    this.updateEmail = this.updateEmail.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.loginUser = this.loginUser.bind(this);
  }

  updateEmail(_, newValue) {
    this.setState({ email: newValue });
  }

  updatePassword(_, newValue) {
    this.setState({ password: newValue });
  }

  loginUser() {
    this.setState({ emailError: '', passwordError: '' });
    if (!this.state.email) this.setState({ emailError: 'Email Required' });
    if (!this.state.password) this.setState({ passwordError: 'Password Required' });
    if (!this.state.password || !this.state.email) return;
  }

  render() {
    return (
      <div style={styles.center}>
        <TextField
          hintText="User Email"
          floatingLabelText="User Email"
          onChange={this.updateEmail}
          ref="loginEmail"
          errorText={this.state.emailError}
          value = { this.state.email }
        />
        <br />
        <TextField
          type="password"
          hintText="Password"
          floatingLabelText="Password"
          errorText={this.state.passwordError}
          onChange={ this.updatePassword }
          value = { this.state.password }
        />
        <br />
        <RaisedButton label="Login" primary={true} onClick={this.loginUser} />
      </div>
    );
  }
}

const registerUser = gql`
  mutation signUpUser($name: String!, $email: String!, $password: String!) {
    user: signupUser(name: $name, email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

class Register extends Component {
  constructor(props) {
    super();
    this.state = {
      passwordError: null,
      emailError: null,
      nameError: null,
      passwordConfirmError: null,
      name: '',
      email: '',
      password: '',
      passwordConfirm: ''
    };

    this.updateName = this.updateName.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updatePasswordConfirmation = this.updatePasswordConfirmation.bind(this);
    this.registerNewUser = this.registerNewUser.bind(this);
  }

  updateName(_, newValue) {
    this.setState({ name: newValue });
  }

  updateEmail(_, newValue) {
    this.setState({ email: newValue });
  }

  updatePassword(_, newValue) {
    this.setState({ password: newValue });
  }

  updatePasswordConfirmation(_, newValue) {
    this.setState({ passwordConfirm: newValue });
  }

  registerNewUser() {
    this.setState({ nameError: '', emailError: '', passwordError: '', passwordConfirmError: '' });
    if (!this.state.name) this.setState({ nameError: 'Name Required' });
    if (!this.state.email) this.setState({ emailError: 'Email Required' });
    if (!this.state.password) this.setState({ passwordError: 'Password Required' });
    if (!this.state.passwordConfirm) this.setState({ passwordConfirmError: 'Password Confirmation Required' });
    if (!this.state.name || !this.state.email || !this.state.password || !this.state.passwordConfirm) return;
    if (this.state.password !== this.state.passwordConfirm) {
      this.setState({ passwordError: 'Password and Confirmation Password do not match' });
      return;
    }
    this.props.signUpUser(this.state.name, this.state.email, this.state.password).then(data => {
      console.log("User created Successfully:", data);
      this.setState({
        name: "", email: "", password: "", passwordConfirm: ""
      })
    }).catch(error=> {
      this.setState({
        name: "", email: "", password: "", passwordConfirm: ""
      })
      console.error(error.message);
    });
  }

  render() {
    return (
      <div style={styles.center}>
        <TextField
          hintText="User Name(First + Last Name)"
          floatingLabelText="User Name"
          errorText={this.state.nameError}
          onChange={this.updateName}
          value = { this.state.name }
        />
        <br />
        <TextField
          hintText="Email"
          floatingLabelText="User Email"
          errorText={this.state.emailError}
          onChange={this.updateEmail}
          value = { this.state.email }
        />
        <br />
        <TextField
          type="password"
          hintText="Password"
          floatingLabelText="Password"
          errorText={this.state.passwordError}
          onChange={this.updatePassword}
          value = { this.state.password }
        />
        <br />
        <TextField
          type="password"
          floatingLabelText="Repeat Password"
          errorText={this.state.passwordConfirmError}
          onChange={this.updatePasswordConfirmation}
          hintText="Repeat password"
          value = { this.state.passwordConfirm }
        />
        <br />
        <RaisedButton label="Register" primary onClick={this.registerNewUser} />
      </div>
    );
  }
}

const RegisterComponentWithData = graphql(registerUser, {
  props: ({ mutate, data }) => ({
    signUpUser: (name, email, password) =>
      mutate({
        variables: { name, email, password }
      })
  })
})(Register);

export default class Authentication extends Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <div style={styles.flexContainer}>
        <Card expanded style={styles.card}>
          <CardText expandable={true}>
            <Tabs>
              <Tab label="LOGIN">
                <Login />
              </Tab>
              <Tab label="REGISTER">
                <RegisterComponentWithData />
              </Tab>
            </Tabs>
          </CardText>
        </Card>
      </div>
    );
  }
}

const styles = {
  flexContainer: {
    display: 'flex',
    width: '50%',
    justifyContent: 'center',
    margin: '0px auto'
  },
  card: {
    width: '100%'
  },
  center: {
    textAlign: 'center'
  }
};
