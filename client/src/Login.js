import React, { Component, Fragment } from 'react';
import { post } from 'axios';
import { Container, Form, Button, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      errorMessage: '',
    };
  }

  // Scroll to top on arrival to component
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  // Collects form data and creates Auth object for JWT authentication
  handleAuth = e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const request = {
      auth: {
        email: email,
        password: password,
      },
    };
    // On success, stores JWT token, current user data in localStorage
    // On failure, displays notice next to Submit button
    post('/user_token', request)
      .then(res => {
        const { id, first_name } = res.data.user;
        localStorage.setItem('jwt', res.data.jwt);
        localStorage.setItem('user id', res.data.user.id);
        localStorage.setItem('user name', res.data.user.first_name);
        this.props.currentUser(id, first_name);
        this.props.history.push('/');
      })
      .catch(err => {
        this.setState({ errorMessage: 'Wrong Credentials' });
      });
  };

  render() {
    return (
      <Fragment>
        <Container style={{ marginTop: `5REM`, maxWidth: `36REM` }}>
          <h1>Log In</h1>
          <Form onSubmit={this.handleAuth}>
            <Form.Group>
              <label htmlFor="email">Email: </label>
              <input
                name="email"
                id="email"
                type="email"
                className="form-control"
              />
            </Form.Group>
            <Form.Group>
              <label htmlFor="password">Password: </label>
              <input
                name="password"
                id="password"
                type="password"
                className="form-control"
              />
            </Form.Group>
            <div>{this.state.errorMessage}</div>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Container>
        <Container>
          <Row className="justify-content-center" style={{ marginTop: `2REM` }}>
            <h4 style={{ marginRight: `0.75REM` }}>Don't have an account?</h4>
            <Link to="/register">
              <Button style={{ marginLeft: `0.75REM` }}>Sign Up</Button>
            </Link>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

export default Login;
