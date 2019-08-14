import React from 'react'
import { render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import {SignInPage} from "./index";
import { BrowserRouter , withRouter, MemoryRouter  } from 'react-router-dom';
import { createMemoryHistory } from 'history';
const history = createMemoryHistory('/')
const dispatch = {}
const     withRouterSignIn =  <MemoryRouter ><SignInPage history={history} dispatch={dispatch} /></MemoryRouter>
// function renderWithRouter(children, historyConf = {}) {
//   const history = createMemoryHistory(historyConf)
//   return render(<Router history={history}>{children}</Router>)
// }
test("displays Sign in page", () => {
  const { getByPlaceholderText } = render(withRouterSignIn)

  expect(getByPlaceholderText("Email Address")).toBeInTheDocument();
  expect(getByPlaceholderText("Password")).toBeInTheDocument();
});

const setup = () => {
  const utils = render(withRouterSignIn)
  const email = utils.getByPlaceholderText("Email Address"); 
  const password = utils.getByPlaceholderText("Password"); 
  return {
    email,
    password,
    ...utils
  };
};

test("Submit should be disabled if email is empty", () => {
  const { email } = setup();
  fireEvent.change(email, { target: { value: "" } });
  expect(email.closest("button")).toHaveAttribute("disabled");
});

test("Submit should be disabled if password is empty", () => {
  const { password } = setup();
  fireEvent.change(password, { target: { value: "" } });
  expect(password.closest("button")).toHaveAttribute("disabled");
});

test("Submit should be not be disabled if input is not empty", () => {
  const { email, password } = setup();
  fireEvent.change(email, { target: { value: "fff" } });
  fireEvent.change(password, { target: { value: "fff" } });
  expect(email.closest("button")).not.toHaveAttribute( "disabled");
});