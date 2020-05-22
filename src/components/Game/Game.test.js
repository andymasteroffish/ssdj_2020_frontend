import React from "react";
import { render } from "@testing-library/react";
import Game from "./Game";

test("renders learn react link", () => {
  const { getByText } = render(<Game />);
  const textElement = getByText(/game goes here/i);
  expect(textElement).toBeInTheDocument();
});
