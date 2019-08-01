import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { firebase } from '../../firebase';
import * as routes from '../../constants/routes';

const withAuthorization = condition => (Component) => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      const { history } = this.props;
      firebase.auth.onAuthStateChanged((authUser) => {
        if (!condition(authUser)) {
          // fix
          history.push(routes.SIGN_IN);
        }
      });
    }

    render() {
      const { authUser } = this.props;
      return authUser ? <Component authUser={authUser} /> : null;
    }
  }

  WithAuthorization.propTypes = {
    authUser: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };
  const mapStateToProps = state => ({
    authUser: state.sessionReducer.authUser,
  });

  return compose(
    withRouter,
    connect(mapStateToProps),
  )(WithAuthorization);
};


export default withAuthorization;
