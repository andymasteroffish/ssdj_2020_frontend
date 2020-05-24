import React from "react";
import { render } from "@testing-library/react";
import Status from "./Status";

test("renders learn react link", () => {
  const { getByText } = render(<Status />);
  const textElement = getByText(/Status goes here/i);
  expect(textElement).toBeInTheDocument();
});
