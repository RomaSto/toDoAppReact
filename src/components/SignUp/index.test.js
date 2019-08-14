import React from 'react'
import { render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import SignUp from "./index";
import { createMemoryHistory } from 'history';
import { MemoryRouter } from "react-router-dom";
const history = createMemoryHistory('/')
const     withRouterSignUp =  <MemoryRouter><SignUp history={history}  /></MemoryRouter> 
test("displays SignUp", () => {
  const { getByPlaceholderText, getByText } = render(withRouterSignUp );
  expect(getByPlaceholderText("Full Name")).toBeInTheDocument();
  expect(getByPlaceholderText("Email Address")).toBeInTheDocument();
  expect(getByPlaceholderText("Password")).toBeInTheDocument();
  expect(getByPlaceholderText("Confirm Password")).toBeInTheDocument();
  expect(getByText("Sign Up")).toBeInTheDocument();
});

const setup = () => {
  const utils = render(withRouterSignUp );
  const fullName = utils.getByPlaceholderText("Full Name"); 
  const emailAddress = utils.getByPlaceholderText("Email Address"); 
  const password = utils.getByPlaceholderText("Password"); 
  const confirmPassword = utils.getByPlaceholderText("Confirm Password"); 
  const signUp = utils.getByText("Sign Up");
  return {
    fullName,
    emailAddress,
    password,
    confirmPassword,
    signUp,
    ...utils
  };
};

test("Sign Up should be disabled if name is empty", () => {
  const {  fullName, signUp, emailAddress, password, confirmPassword, } = setup();
  fireEvent.change(fullName, { target: { value: "" } });
  fireEvent.change(emailAddress, { target: { value: "password1" } });
  fireEvent.change(password, { target: { value: "password1" } });
  fireEvent.change(confirmPassword, { target: { value: "password1" } });
  expect(signUp).toHaveAttribute("disabled");
});

test("Sign Up should be disabled if emailAddress is empty", () => {
  const {  fullName, signUp, emailAddress, password, confirmPassword, } = setup();
  fireEvent.change(fullName, { target: { value: "password1" } });
  fireEvent.change(emailAddress, { target: { value: "" } });
  fireEvent.change(password, { target: { value: "password1" } });
  fireEvent.change(confirmPassword, { target: { value: "password1" } });
  expect(signUp).toHaveAttribute("disabled");
});

test("Sign Up should be disabled if password is empty", () => {
  const {  fullName, signUp, emailAddress, password, confirmPassword, } = setup();
  fireEvent.change(fullName, { target: { value: "password1" } });
  fireEvent.change(emailAddress, { target: { value: "password1" } });
  fireEvent.change(password, { target: { value: "" } });
  fireEvent.change(confirmPassword, { target: { value: "password1" } });
  expect(signUp).toHaveAttribute("disabled");
});

test("Sign Up should be disabled if confirmPassword is empty", () => {
  const {  fullName, signUp, emailAddress, password, confirmPassword, } = setup();
  fireEvent.change(fullName, { target: { value: "password1" } });
  fireEvent.change(emailAddress, { target: { value: "password1" } });
  fireEvent.change(password, { target: { value: "password1" } });
  fireEvent.change(confirmPassword, { target: { value: "" } });
  expect(signUp).toHaveAttribute("disabled");
});

test("Sign Up should be disabled if confirmPassword is equal to password", () => {
  const {signUp, password, confirmPassword, } = setup();
  fireEvent.change(password, { target: { value: "password2" } });
  fireEvent.change(confirmPassword, { target: { value: "password1" } });
  expect(signUp).toHaveAttribute("disabled");
});

test("Sign Up should be disabled if confirmPassword is empty", () => {
  const {  fullName, signUp, emailAddress, password, confirmPassword, } = setup();
  fireEvent.change(fullName, { target: { value: "password1" } });
  fireEvent.change(emailAddress, { target: { value: "password1" } });
  fireEvent.change(password, { target: { value: "password1" } });
  fireEvent.change(confirmPassword, { target: { value: "password1" } });
  expect(signUp).not.toHaveAttribute("disabled");
});