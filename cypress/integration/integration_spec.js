describe('Test basic functionality', function() {
  it('visits the app', function() {
    cy.visit('http://localhost:3000');
    cy.contains('app');
    cy.get('.header').contains('Enter ESPN League URL');
  });
  it('should allow submission', function() {
    cy.get('input').type("http://games.espn.com/ffl/clubhouse?leagueId=1122686&teamId=5&seasonId=2016");
    cy.get('button').click();
    cy.get(".header").contains('Power Rankings 2017');
  });
  it('shold contain 11 teams', function() {
    cy.get('tr')
      .should(($p) => {
        var texts = $p.map((i, el) => {
        return Cypress.$(el).text()
        })
        var texts = texts.get()
        expect(texts).to.have.length(12)
    });
  });
  it('should allow user to go back to the landing page', function() {
    cy.get('a').click();
    cy.get('.header').contains('Enter ESPN League URL');
  });
  it('should handle a bad input url', () => {
    cy.get('input').type("http://games.espn.com/ffl/clubhouse?leagueId=12345&teamId=5&seasonId=2017");
    cy.get('button').click();
    cy.get('.negative').contains("We're sorry, something went wrong. Please try again.");
  });
  it('should handle really bad input', () => {
    cy.get('input').type("blah");
    cy.get('button').click();
    cy.get('.negative').contains("We're sorry, something went wrong. Please try again.");
  });
  it('should handle bookmarking', () => {
    cy.visit('http://localhost:3000/espn/1122686/2016');
    cy.get(".header").contains('Power Rankings 2017');
  })
});