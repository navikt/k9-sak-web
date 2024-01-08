describe('Sykdom', () => {
  before(() => {
    cy.visit('/');
  });
  it('skal kunne håndtere dokumentasjon av sykdom', () => {
    cy.contains('Bekreft').click();
  });
  it('skal kunne legge inn innleggelsesperioder', () => {
    cy.contains('Dokumentasjon av sykdom').click();
    cy.contains('Rediger liste').click();
    cy.contains('Legg til innleggelsesperiode').click();
    cy.get('input[id="innleggelsesperioder[3].fom"]').type('010123');
    cy.get('input[id="innleggelsesperioder[3].tom"]').type('300123');
    cy.get('dialog').contains('Bekreft').click();
    cy.contains('Fortsett').click();
  });
  it('skal kunne håndtere tilsyn og pleie', () => {
    cy.get('[type="checkbox"]').first().check({ force: true });
    cy.get('[name="vurderingAvKontinuerligTilsynOgPleie"]').type('test');
    cy.get('input[id="harBehovForKontinuerligTilsynOgPleieYES"]').check({ force: true });
    cy.get('input[id="perioder[0].tom"]').clear();
    cy.get('input[id="perioder[0].tom"]').type('020322');
    cy.get('input[id="perioder[0].fom"]').click();
    cy.contains('Du har valgt en dato som er utenfor gyldig periode.').should('exist');
    cy.get('input[id="perioder[0].tom"]').clear();
    cy.get('input[id="perioder[0].tom"]').type('280222');
    cy.get('input[id="perioder[0].fom"]').click();
    cy.contains('Du har valgt en dato som er utenfor gyldig periode.').should('not.exist');
    cy.contains(
      'Du har ikke vurdert alle periodene som må vurderes. Resterende perioder vurderer du etter at du har lagret denne.',
    ).should('exist');
    cy.get('input[id="perioder[0].tom"]').clear();
    cy.get('input[id="perioder[0].tom"]').type('010322');
    cy.get('input[id="perioder[0].fom"]').click();
    cy.contains(
      'Du har ikke vurdert alle periodene som må vurderes. Resterende perioder vurderer du etter at du har lagret denne.',
    ).should('not.exist');
    cy.contains('Bekreft').click();
    cy.get('dialog').find('button').contains('Bekreft').click();
    cy.contains('Eventuelle endringer er registrert').click();
  });
  it('skal kunne håndtere to omsorgspersoner', () => {
    cy.get('[type="checkbox"]').first().check({ force: true });
    cy.get('[name="vurderingAvToOmsorgspersoner"]').type('test');
    cy.get('input[id="harBehovForToOmsorgspersonerYES"]').check({ force: true });
    cy.contains('Bekreft').click();
    cy.get('dialog').find('button').contains('Bekreft').click();
    cy.contains('Sykdom er ferdig vurdert og du kan gå videre i behandlingen.').should('exist');
  });
});
