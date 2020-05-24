import React from "react";
import { render } from "@testing-library/react";
import Players from "./Players";

test("renders learn react link", () => {
  const { getByText } = render(<Players />);
  const textElement = getByText(/Players goes here/i);
  expect(textElement).toBeInTheDocument();
});
