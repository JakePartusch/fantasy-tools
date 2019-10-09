describe('Test basic functionality', function() {
  it('visits the app', function() {
    cy.visit('/');
    cy.contains('app');
    cy.get('header').contains('Fantasy Tools');
  });
  describe('rankings simulator', () => {
    beforeEach(() => {
      cy.server();
      cy.route('GET', 'https://fantasy.espn.com/apis/v3/**','fixture:response.json')
    })
    it('navigates to ranking from button click', () => {
      cy.visit('/');
      cy.get('.rankings-simulator-btn').click();
    });
    it('loads team data', () => {
      cy.visit('/rankings');
      cy.get('input').type('https://fantasy.espn.com/football/league?leagueId=452354');
      cy.get('form').submit();
      cy.get('tr').should('have.length', 13)
    });
    it('should rank the teams correctly', () => {
      cy.visit('/rankings');
      cy.get('input').type('https://fantasy.espn.com/football/league?leagueId=452354');
      cy.get('form').submit();
      cy.get('tbody tr').first().should('contain', 'Grover Circle Clevelands')
      cy.get('tbody tr').first().get('.simulated-record-cell').should('contain', '88 - 44')
    })
  });
});