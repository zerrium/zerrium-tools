import React from "react"
import { screen } from "@testing-library/react"
import { render } from "./test-utils"
import { Page } from "./Page"

test("renders learn react link", () => {
  render(<Page />)
  const linkElement = screen.getByText(/learn chakra/i)
  expect(linkElement).toBeInTheDocument()
})
