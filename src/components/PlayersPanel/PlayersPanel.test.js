import React from "react";
import { render } from "@testing-library/react";
import PlayersPanel from "./PlayersPanel";

test("renders learn react link", () => {
  const { getByText } = render(<PlayersPanel />);
  const textElement = getByText(/PlayersPanel goes here/i);
  expect(textElement).toBeInTheDocument();
});
