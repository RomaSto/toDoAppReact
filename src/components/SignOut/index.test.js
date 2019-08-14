import React from 'react'
import { render} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import SignOutButton from "./index";

test("displays PasswordForget", () => {
  const { getByText, } = render(<SignOutButton />);
  expect(getByText("Sign Out")).toBeInTheDocument();
});

