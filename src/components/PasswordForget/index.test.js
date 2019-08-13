import React from 'react'
import { render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import PasswordForget from "./index";

test("displays PasswordForget", () => {
  const { getByPlaceholderText, } = render(<PasswordForget />);
  expect(getByPlaceholderText("Email Address")).toBeInTheDocument();
});

const setup = () => {
  const utils = render(<PasswordForget />);
  const email = utils.getByPlaceholderText("Email Address"); 
  return {
    email,
    ...utils
  };
};

test("Submit should be disabled if input is empty", () => {
  const { email, getByText } = setup();
  fireEvent.change(email, { target: { value: "" } });
  expect(getByText("Reset My Password").closest("button")).toHaveAttribute(    "disabled");
});

test("Submit should be not be disabled if input is not empty", () => {
  const { email, getByText } = setup();
  fireEvent.change(email, { target: { value: "fff" } });
  expect(getByText("Reset My Password").closest("button")).not.toHaveAttribute( "disabled");
});