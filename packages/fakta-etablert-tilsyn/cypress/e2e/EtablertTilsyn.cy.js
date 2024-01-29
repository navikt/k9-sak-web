describe('Sykdom', () => {
  before(() => {
    cy.visit('/');
  });
  it('skal ha skjema for håndtering av beredskap', () => {
    cy.contains('Beredskap').click();
    cy.contains('Vurdering av beredskap').should('exist');
    cy.get('[name="begrunnelse"]').should('exist');
    cy.get('input[id="perioder[0].fom"]').should('not.exist');
    cy.get('input[id="perioder[0].tom"]').should('not.exist');
    cy.get('input[id="jaDeler"]').click();
    cy.get('input[id="perioder[0].fom"]').should('exist');
    cy.get('input[id="perioder[0].tom"]').should('exist');
  });
  it('skal ha skjema for håndtering av nattevåk', () => {
    cy.contains('Nattevåk').click();
    cy.contains('Vurdering av nattevåk').should('exist');
    cy.get('[name="begrunnelse"]').should('exist');
    cy.get('input[id="perioder[0].fom"]').should('not.exist');
    cy.get('input[id="perioder[0].tom"]').should('not.exist');
    cy.get('input[id="jaDeler"]').click();
    cy.get('input[id="perioder[0].fom"]').should('exist');
    cy.get('input[id="perioder[0].tom"]').should('exist');
  });
});
