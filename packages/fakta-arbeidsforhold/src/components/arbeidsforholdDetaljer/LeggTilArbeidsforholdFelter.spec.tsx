import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../i18n/nb_NO.json';
import CustomArbeidsforhold from '../../typer/CustomArbeidsforholdTsType';
import LeggTilArbeidsforholdFelter from './LeggTilArbeidsforholdFelter';

describe('<LeggTilArbeidsforholdFelter>', () => {
  it('Skal sjekke at LeggTilArbeidsforholdFelter rendrer korrekt', () => {
    renderWithIntlAndReduxForm(
      <LeggTilArbeidsforholdFelter readOnly={false} formName="" behandlingId={1} behandlingVersjon={1} />,
      { messages },
    );

    expect(screen.getByRole('textbox', { name: 'Navn på arbeidsgiver' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Startdato' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Sluttdato' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Stillingsprosent' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Yrkestittel' })).toBeInTheDocument();
  });
  it('Skal sjekke at LeggTilArbeidsforholdFelter validerer med fom og tom lik', () => {
    const values = {
      fomDato: '2019-01-01',
      tomDato: '2019-01-01',
    } as CustomArbeidsforhold;
    expect(LeggTilArbeidsforholdFelter.validate(values)).toEqual(null);
  });
  it('Skal sjekke at LeggTilArbeidsforholdFelter validerer med fom og tom ikke satt', () => {
    const values = {
      fomDato: '2019-01-01',
      tomDato: undefined,
    } as CustomArbeidsforhold;
    expect(LeggTilArbeidsforholdFelter.validate(values)).toEqual(null);
  });
  it('Skal sjekke at LeggTilArbeidsforholdFelter validerer med fom før tom', () => {
    const values = {
      fomDato: '2019-01-01',
      tomDato: '2019-01-02',
    } as CustomArbeidsforhold;
    expect(LeggTilArbeidsforholdFelter.validate(values)).toEqual(null);
  });
  it('Skal sjekke at LeggTilArbeidsforholdFelter validerer med fom etter tom', () => {
    const values = {
      fomDato: '2019-01-02',
      tomDato: '2019-01-01',
    } as CustomArbeidsforhold;
    const result = LeggTilArbeidsforholdFelter.validate(values);
    expect(result.tomDato).toEqual([
      { id: 'PersonArbeidsforholdDetailForm.DateNotAfterOrEqual' },
      { dato: '02.01.2019' },
    ]);
    expect(result.fomDato).toEqual([
      { id: 'PersonArbeidsforholdDetailForm.DateNotBeforeOrEqual' },
      { dato: '01.01.2019' },
    ]);
  });
});
