import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Landing from './index'

test('displays Landing',  () => {
  const {  getByTestId } = render(<Landing />)

  expect(getByTestId("header")).toHaveTextContent("Landing");
  expect(getByTestId("content")).toHaveTextContent(
    "The Landing Page is open to everyone"
  );
})