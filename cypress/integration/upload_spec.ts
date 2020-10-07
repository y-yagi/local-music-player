describe("Upload", () => {
  it("Upload files", () => {
    cy.visit("http://localhost:3000");
    const mp3 = "timpani.mp3";
    cy.get("input[type=file]").attachFile(mp3);
    cy.contains(mp3);
  });
});
