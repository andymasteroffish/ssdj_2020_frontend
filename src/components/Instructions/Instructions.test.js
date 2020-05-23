import React from "react";
import { render } from "@testing-library/react";
import Instructions from "./Instructions";

test("renders learn react link", () => {
  const { getByText } = render(<Instructions />);
  const textElement = getByText(/Instructions goes here/i);
  expect(textElement).toBeInTheDocument();
});
