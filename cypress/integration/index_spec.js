import { setUserCookie } from "../../lib/userCookies";

beforeEach(() => {
  setUserCookie({ id: "123", email: "abc@example.com" });
});

describe("Index", () => {
  it("Show page", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Okini");
  });
});
