import React, { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";

class ShareBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mail: ""
    };
  }
  handleShare = e => {
    e.preventDefault();
    this.props.handleShareBoard(this.state.mail);
  };
  handleChange = event => {
    this.setState({ mail: event.target.value });
  };

  render() {
    return (
      <div>
        {
          // <form style={{ marginBottom: 20 }} onSubmit={this.handleShare}>
          //   <input
          //     value={this.state.mail}
          //     onChange={this.handleChange}
          //     type="text"
          //     placeholder="jane@mail.com"
          //   />
          //   <input type="submit" value="Share this board" />
          // </form>
        }
        <Formik
          initialValues={{ email: "" }}
          validate={values => {
            let errors = {};
            if (!values.email) {
              errors.email = "Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }
            return errors;
          }}
          onSubmit={(values, actions) => {
            return new Promise((resolve, reject) => {
              this.props.handleShareBoard({
                email: values.email,
                resolve,
                reject
              });
            }).then(null, error => {
              actions.setSubmitting(false);
              actions.setErrors({ email: error });
            });
          }}
          render={({ errors, status, touched, isSubmitting }) => (
            <Form>
              <Field type="email" name="email" placeholder="jane@mail.com" />
              <ErrorMessage name="email" component="div" />
              {status && status.msg && <div>{status.msg}</div>}
              <br />
              <button type="submit" disabled={isSubmitting}>
                Share this board
              </button>
            </Form>
          )}
        />
      </div>
    );
  }
}

export default ShareBoard;

// const EditUserDialog = ({ user, updateUser, onClose }) => {
//   return (
//     <Dialog onClose={onClose}>
//       <h1>Edit User</h1>
//       <Formik
//         initialValues={user /** { email, social } */}
//         onSubmit={(values, actions) => {
//           MyImaginaryRestApiCall(user.id, values).then(
//             updatedUser => {
//               actions.setSubmitting(false);
//               updateUser(updatedUser);
//               onClose();
//             },
//             error => {
//               actions.setSubmitting(false);
//               actions.setErrors(transformMyRestApiErrorsToAnObject(error));
//               actions.setStatus({ msg: 'Set some arbitrary status or data' });
//             }
//           );
//         }}
//         render={({ errors, status, touched, isSubmitting }) => (
//           <Form>
//             <Field type="email" name="email" />
//             <ErrorMessage name="email" component="div" />
//             <Field type="text" className="error" name="social.facebook" />
//             <ErrorMessage name="social.facebook">
//               {errorMessage => <div className="error">{errorMessage}</div>}
//             </ErrorMessage>
//             <Field type="text" name="social.twitter" />
//             <ErrorMessage name="social.twitter" className="error" component="div"/>
//             {status && status.msg && <div>{status.msg}</div>}
//             <button type="submit" disabled={isSubmitting}>
//               Submit
//             </button>
//           </Form>
//         )}
//       />
//     </Dialog>
//   );
// };
