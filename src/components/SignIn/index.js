import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { FirebaseAuth } from "react-firebaseui";
import { connect } from "react-redux";
import { compose } from "redux";
import * as firebase from "firebase";

import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import * as authFunctions from "../../firebase/auth";
import * as db from "../../firebase/db";
import * as routes from "../../constants/routes";

const SignInPage = ({ history, dispatch }) => {
  const compareUsers = () => {
    const currentUser = firebase.auth().currentUser;
    dispatch({
      type: "CHECK_USER",
      payload: {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        email: currentUser.email
      }
    });
    history.push(routes.HOME);
    return false;
  };

  const uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccess: compareUsers
    }
  };
  return (
    <div>
      <h1>SignIn</h1>
      <SignInForm history={history} />
      <PasswordForgetLink />
      <SignUpLink />
      <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  );
};

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value
});

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    const { history } = this.props;

    authFunctions
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        history.push(routes.HOME);
      })
      .catch(error => {
        this.setState(updateByPropertyName("error", error));
      });

    event.preventDefault();
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === "" || email === "";

    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={email}
          onChange={event =>
            this.setState(updateByPropertyName("email", event.target.value))
          }
          type="text"
          placeholder="Email Address"
        />
        <input
          value={password}
          onChange={event =>
            this.setState(updateByPropertyName("password", event.target.value))
          }
          type="password"
          placeholder="Password"
        />
        <button disabled={isInvalid} type="submit">
          Sign In
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  dispatch
});

export default compose(
  withRouter,
  connect(
    null,
    mapDispatchToProps
  )
)(SignInPage);
