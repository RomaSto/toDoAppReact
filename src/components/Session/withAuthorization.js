import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";

import { firebase } from "../../firebase";
import * as routes from "../../constants/routes";

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      firebase.auth.onAuthStateChanged(authUser => {
        console.log(authUser);
        if (!condition(authUser)) {
          // fix
          this.props.history.push(routes.SIGN_IN);
        }
      });
    }

    render() {
      const { authUser } = this.props;
      return this.props.authUser ? <Component authUser={authUser} /> : null;
    }
  }

  const mapStateToProps = state => ({
    authUser: state.sessionReducer.authUser
  });

  return compose(
    withRouter,
    connect(mapStateToProps)
  )(WithAuthorization);
};

export default withAuthorization;
