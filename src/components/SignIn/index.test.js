import React from 'react'
import { render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import {SignInForm} from "./index";
import { createMemoryHistory } from 'history';
const history = createMemoryHistory('/')
const dispatch = {}
const     withRouterSignIn =  <SignInForm history={history} dispatch={dispatch} />

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
  const { email, getByText } = setup();
  fireEvent.change(email, { target: { value: "" } });
  expect(getByText("Sign In")).toHaveAttribute("disabled");
});

test("Submit should be disabled if password is empty", () => {
  const { password, getByText } = setup();
  fireEvent.change(password, { target: { value: "" } });
  expect(getByText("Sign In")).toHaveAttribute("disabled");
});

test("Submit should be not be disabled if input is not empty", () => {
  const { email, password, getByText } = setup();
  fireEvent.change(email, { target: { value: "fff" } });
  fireEvent.change(password, { target: { value: "fff" } });
  expect(getByText("Sign In")).not.toHaveAttribute( "disabled");
});