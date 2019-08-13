import React from 'react'
import { render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import PasswordChange from "./index";

test("displays PasswordChange", () => {
  const { getByPlaceholderText, getByText } = render(<PasswordChange />);

  expect(getByPlaceholderText("New Password")).toBeInTheDocument();
  expect(getByPlaceholderText("Confirm New Password")).toBeInTheDocument();
  expect(getByText("Reset My Password")).toBeInTheDocument();

});

const setup = () => {
  const utils = render(<PasswordChange />);
  const newPassword = utils.getByPlaceholderText("New Password"); 
  const confirmPassword = utils.getByPlaceholderText("Confirm New Password");
  return {
    newPassword,
    confirmPassword,
    ...utils
  };
};

test("Submit should be disabled if passwords dont match", () => {
  const { newPassword, confirmPassword, getByText } = setup();
  fireEvent.change(newPassword, { target: { value: "password1" } });
  fireEvent.change(confirmPassword, { target: { value: "password2" } });
  expect(getByText("Reset My Password").closest("button")).toHaveAttribute("disabled");
});

test("Submit should be enabled if passwords match", () => {
  const { newPassword, confirmPassword, getByText } = setup();
  fireEvent.change(newPassword, { target: { value: "password" } });
  fireEvent.change(confirmPassword, { target: { value: "password" } });
  expect(getByText("Reset My Password").closest("button")).not.toHaveAttribute(
    "disabled"
  );
});