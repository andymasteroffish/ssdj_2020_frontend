import React from "react";
import { render } from "@testing-library/react";
import About from "./About";

test("renders learn react link", () => {
  const { getByText } = render(<About />);
  const textElement = getByText(/About goes here/i);
  expect(textElement).toBeInTheDocument();
});
