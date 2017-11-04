describe('Test basic functionality', function() {
  it('visits the app', function() {
    cy.visit('http://localhost:3000');
    cy.contains('app');
    cy.get('.header').contains('Enter ESPN League URL');
  });
  it('should allow submission', function() {
    cy.server()
    cy.route('GET', 'https://games.espn.com/ffl/api/v2/leagueSettings*', 'fixture:leagueSettings.json')
    cy.route('GET', 'https://games.espn.com/ffl/api/v2/scoreboard*', 'fixture:scoreboard.json')
    cy.get('input').type("http://games.espn.com/ffl/clubhouse?leagueId=1122686&teamId=1&seasonId=2016");
    cy.get('button').click();
    cy.get(".header").contains('Power Rankings 2016');
  });
  describe('default view', () => {
    it('should contain 11 teams', function() {
      cy.get('tr').should('have.length', 12)
    });
    it('should contain 4 columns per row', () => {
      cy.get('td').should('have.length', 44)
    });
    it('should contain data in the first cell', () => {
      cy.get('td').first().contains("Nebraska")
    });
  });

  describe('detailed view', () => {
    it('should click the button', () => {
      cy.get('button').click();
    });
    it('should still contain 11 teams', () => {
      cy.get('tr').should('have.length', 12)
    });
    it('should contain 17 columns per row', () => {
      cy.get('td').should('have.length', 187)
    });
    it('should contain data in the first cell', () => {
      cy.get('td').first().contains("Nebraska")
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
    cy.server()
    cy.route('GET', 'https://games.espn.com/ffl/api/v2/leagueSettings*', 'fixture:leagueSettings.json')
    cy.route('GET', 'https://games.espn.com/ffl/api/v2/scoreboard*', 'fixture:scoreboard.json')
    cy.visit('http://localhost:3000/espn/1122686/2016');
    cy.get(".header").contains('Power Rankings 2016');
  })
});