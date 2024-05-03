import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../../i18n/nb_NO.json';
import Aktsomhet from '../../../kodeverk/aktsomhet';
import AktsomhetReduksjonAvBelopFormPanel from './AktsomhetReduksjonAvBelopFormPanel';

describe('<AktsomhetReduksjonAvBelopFormPanel>', () => {
  it('skal måtte angi andel som skal tilbakekreves når en har grunner til reduksjon og færre enn to ytelser', () => {
    renderWithIntlAndReduxForm(
      <AktsomhetReduksjonAvBelopFormPanel
        harGrunnerTilReduksjon
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.GROVT_UAKTSOM}
        harMerEnnEnYtelse={false}
        feilutbetalingBelop={100}
      />,
      { messages },
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '30' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '50' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '70' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Egendefinert' })).toBeInTheDocument();
  });

  it('skal få informasjon om at det ikke skal tillegges renter når en har grunner til reduksjon og grad grovt uaktsom', () => {
    renderWithIntlAndReduxForm(
      <AktsomhetReduksjonAvBelopFormPanel
        harGrunnerTilReduksjon
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.GROVT_UAKTSOM}
        harMerEnnEnYtelse={false}
        feilutbetalingBelop={100}
      />,
      { messages },
    );

    expect(screen.getByText('Angi andel som skal tilbakekreves')).toBeInTheDocument();
    expect(screen.getByText('Skal det tillegges renter?')).toBeInTheDocument();
  });

  it('skal ikke få informasjon om at det ikke skal tillegges renter når en har grunner til reduksjon og grad simpel uaktsom', () => {
    renderWithIntlAndReduxForm(
      <AktsomhetReduksjonAvBelopFormPanel
        harGrunnerTilReduksjon
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.SIMPEL_UAKTSOM}
        harMerEnnEnYtelse={false}
        feilutbetalingBelop={100}
      />,
      { messages },
    );

    expect(screen.queryByText('Skal det tillegges renter?')).not.toBeInTheDocument();
  });

  it('skal måtte angi beløp som skal tilbakekreves når en har grunner til reduksjon og mer enn en ytelse', () => {
    renderWithIntlAndReduxForm(
      <AktsomhetReduksjonAvBelopFormPanel
        harGrunnerTilReduksjon
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.GROVT_UAKTSOM}
        harMerEnnEnYtelse
        feilutbetalingBelop={100}
      />,
      { messages },
    );

    expect(screen.getByRole('textbox', { name: 'Angi beløp som skal tilbakekreves' })).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('skal vise andel som skal tilbakekreves når en ikke har grunner til reduksjon og færre enn to ytelser', () => {
    renderWithIntlAndReduxForm(
      <AktsomhetReduksjonAvBelopFormPanel
        harGrunnerTilReduksjon={false}
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.GROVT_UAKTSOM}
        harMerEnnEnYtelse={false}
        feilutbetalingBelop={100}
      />,
      { messages },
    );

    expect(screen.getByText('Andel som skal tilbakekreves')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('skal vise andel som skal tilbakekreves når en ikke har grunner til reduksjon og mer enn en ytelser', () => {
    renderWithIntlAndReduxForm(
      <AktsomhetReduksjonAvBelopFormPanel
        harGrunnerTilReduksjon={false}
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.GROVT_UAKTSOM}
        harMerEnnEnYtelse
        feilutbetalingBelop={10023}
      />,
      { messages },
    );

    expect(screen.getByText('Beløp som skal tilbakekreves')).toBeInTheDocument();
    expect(screen.getByText('10 023')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('skal vise radioknapper for valg om det skal tillegges renter når en ikke har grunner til reduksjon og grad grovt uaktsomt', () => {
    renderWithIntlAndReduxForm(
      <AktsomhetReduksjonAvBelopFormPanel
        harGrunnerTilReduksjon={false}
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.GROVT_UAKTSOM}
        harMerEnnEnYtelse
        feilutbetalingBelop={10023}
      />,
      { messages },
    );

    expect(screen.getByText('Skal det tillegges renter?')).toBeInTheDocument();
    expect(screen.getAllByRole('radio').length).toBe(4);
  });

  it('skal ikke vise radioknapper for valg om det skal tillegges renter når en ikke har grunner til reduksjon og grad simpelt uaktsomt', () => {
    renderWithIntlAndReduxForm(
      <AktsomhetReduksjonAvBelopFormPanel
        harGrunnerTilReduksjon={false}
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.SIMPEL_UAKTSOM}
        harMerEnnEnYtelse
        feilutbetalingBelop={10023}
      />,
      { messages },
    );
    expect(screen.queryByText('Skal det tillegges renter?')).not.toBeInTheDocument();
    expect(screen.getAllByRole('radio').length).toBe(2);
  });
});
