import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { isRequiredMessage } from '@fpsak-frontend/utils';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import VilkarResultPicker from './VilkarResultPicker';

describe('<VilkarResultPicker>', () => {
  it('skal vise komponent med radioknapper', () => {
    renderWithIntlAndReduxForm(
      <VilkarResultPicker
        erVilkarOk
        readOnly={false}
        customVilkarIkkeOppfyltText="Ikke oppfylt"
        customVilkarOppfyltText="Oppfylt"
      />,
      { messages },
    );
    expect(screen.getByRole('radio', { name: 'Oppfylt' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Ikke oppfylt' })).toBeInTheDocument();
  });

  it('skal kunne overstyre vilkårtekster', () => {
    const textId = 'Test';
    renderWithIntlAndReduxForm(
      <VilkarResultPicker
        erVilkarOk={false}
        customVilkarIkkeOppfyltText={textId}
        customVilkarOppfyltText="Oppfylt"
        readOnly={false}
      />,
      { messages },
    );

    expect(screen.getByRole('radio', { name: 'Test' })).toBeInTheDocument();
  });

  it('skal ikke vise nedtrekksliste når vilkårsresultat ikke er valgt', () => {
    renderWithIntlAndReduxForm(
      <VilkarResultPicker
        erVilkarOk
        readOnly={false}
        customVilkarIkkeOppfyltText="Ikke oppfylt"
        customVilkarOppfyltText="Oppfylt"
      />,
      { messages },
    );

    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('skal ikke vise nedtrekksliste når vilkårsresultat er OK', () => {
    renderWithIntlAndReduxForm(
      <VilkarResultPicker
        erVilkarOk
        readOnly={false}
        customVilkarIkkeOppfyltText="Ikke oppfylt"
        customVilkarOppfyltText="Oppfylt"
      />,
      { messages },
    );

    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('skal vise nedtrekksliste når vilkårsresultat er valgt', () => {
    renderWithIntlAndReduxForm(
      <VilkarResultPicker
        erVilkarOk={false}
        readOnly={false}
        customVilkarIkkeOppfyltText="Ikke oppfylt"
        customVilkarOppfyltText="Oppfylt"
      />,
      { messages },
    );

    expect(screen.getByRole('combobox', { name: 'Avslagsårsak' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Velg årsak' })).toBeInTheDocument();
  });

  it('skal feile validering når en har valgt å avvise vilkår men ikke valgt avslagsårsak', () => {
    const erVilkarOk = false;
    const avslagCode = undefined;
    const errors = VilkarResultPicker.validate(erVilkarOk, avslagCode);

    expect(errors.avslagCode).toEqual(isRequiredMessage());
  });

  it('skal ikke feile validering når en har valgt både å avvise vilkår og avslagsårsak', () => {
    const erVilkarOk = false;
    const avslagCode = 'VALGT_KODE';
    const errors = VilkarResultPicker.validate(erVilkarOk, avslagCode);

    expect(errors).toEqual({});
  });

  it('skal sette opp initielle verdier', () => {
    const aksjonspunkter = [
      {
        status: aksjonspunktStatus.UTFORT,
        vilkarType: vilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR,
      },
    ] as Aksjonspunkt[];
    const intielleVerdier = VilkarResultPicker.buildInitialValues(
      'Avslagskoden',
      aksjonspunkter,
      vilkarUtfallType.IKKE_OPPFYLT,
    );

    expect(intielleVerdier).toEqual({
      avslagCode: 'Avslagskoden',
      erVilkarOk: false,
    });
  });
});
