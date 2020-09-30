describe("Index", () => {
  it("Show page", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Local file music player");
  });
});
