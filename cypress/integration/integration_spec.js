describe('Test basic functionality', function() {
  it('visits the app', function() {
    cy.visit('http://localhost:3000');
    cy.contains('app');
    cy.get('.header').contains('Enter ESPN League URL');
  });
  it('should allow submission', function() {
    cy.server()
    cy.route('GET', '/apis/v3/**', 'fixture:scoreboard.json')
    cy.get('input').type("https://fantasy.espn.com/football/team?leagueId=452354&seasonId=2018&teamId=5&fromTeamId=5");
    cy.get('button').click();
    cy.get(".header").contains('Power Rankings 2018');
  });
  it('should contain 13 teams', function() {
    cy.get('tr').should('have.length', 14)
  });
  it('should contain 3 columns per row', () => {
    cy.get('td').should('have.length', 39)
  });
  it('should contain data in the first cell', () => {
    cy.get('td').first().contains("Partusch")
  });
  it('should click the button', () => {
    cy.get('button').click();
  });
  it('should still contain 14 teams', () => {
    cy.get('tr').should('have.length', 14)
  });
  it('should contain 17 columns per row', () => {
    cy.get('td').should('have.length', 208)
  });
  it('should contain data in the first cell', () => {
    cy.get('td').first().contains("Partusch")
  });
  it('should allow user to go back to the landing page', function() {
    cy.get('a').click();
    cy.get('.header').contains('Enter ESPN League URL');
  });
  it('should handle a bad input url', () => {
    cy.get('input').type("https://fantasy.espn.com/football/team?leagueId=452354&seasonId=2018&teamId=5&fromTeamId=5");
    cy.get('button').click();
    cy.get('.negative').contains("We're sorry, something went wrong. Please try again.");
  });
  it('should handle really bad input', () => {
    cy.get('input').type("blah");
    cy.get('button').click();
    cy.get('.negative').contains("We're sorry, something went wrong. Please try again.");
  });

});