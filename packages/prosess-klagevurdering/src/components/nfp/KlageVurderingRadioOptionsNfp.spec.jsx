import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import klageVurdering from '@fpsak-frontend/kodeverk/src/klageVurdering';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';

import React from 'react';
import { intlMock } from '../../../i18n';
import messages from '../../../i18n/nb_NO.json';
import { KlageVurderingRadioOptionsNfp } from './KlageVurderingRadioOptionsNfp';

describe('<KlageVurderingRadioOptionsNfp>', () => {
  const sprakkode = {
    kode: 'NO',
    navn: 'Norsk',
  };
  const medholdReasons = [
    { kode: 'NYE_OPPLYSNINGER', navn: 'Nytt faktum', kodeverk: 'KLAGE_MEDHOLD_AARSAK' },
    { kode: 'ULIK_REGELVERKSTOLKNING', navn: 'Feil lovanvendelse', kodeverk: 'KLAGE_MEDHOLD_AARSAK' },
    { kode: 'ULIK_VURDERING', navn: 'Ulik skjønnsvurdering', kodeverk: 'KLAGE_MEDHOLD_AARSAK' },
    { kode: 'PROSESSUELL_FEIL', navn: 'Saksbehandlingsfeil', kodeverk: 'KLAGE_MEDHOLD_AARSAK' },
  ];

  it('skal vise to options når klage opprettholdt', () => {
    renderWithIntlAndReduxForm(
      <KlageVurderingRadioOptionsNfp
        fagsak={{ sakstype: { kode: fagsakYtelseType.OMSORGSPENGER } }}
        readOnly={false}
        readOnlySubmitButton
        medholdReasons={medholdReasons}
        aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
        klageVurdering={klageVurdering.STADFESTE_YTELSESVEDTAK}
        previewCallback={vi.fn()}
        intl={intlMock}
        formProps={{}}
        sprakkode={sprakkode}
      />,
      { messages },
    );
    expect(screen.getByRole('radio', { name: 'Omgjør vedtaket' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Oppretthold vedtaket' })).toBeInTheDocument();
  });

  it('skal vise fem options når klage medhold', () => {
    renderWithIntlAndReduxForm(
      <KlageVurderingRadioOptionsNfp
        fagsak={{ sakstype: { kode: fagsakYtelseType.OMSORGSPENGER } }}
        readOnly={false}
        readOnlySubmitButton
        aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
        klageVurdering={klageVurdering.MEDHOLD_I_KLAGE}
        medholdReasons={medholdReasons}
        previewCallback={vi.fn()}
        intl={intlMock}
        formProps={{}}
        sprakkode={sprakkode}
      />,
      { messages },
    );

    expect(screen.getByRole('radio', { name: 'Omgjør vedtaket' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Oppretthold vedtaket' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Til gunst' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Til ugunst' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Delvis omgjør, til gunst' })).toBeInTheDocument();
  });

  it('skal vise hjemler når klagevurdering er opprettholdt', () => {
    renderWithIntlAndReduxForm(
      <KlageVurderingRadioOptionsNfp
        fagsak={{ sakstype: { kode: fagsakYtelseType.OMSORGSPENGER } }}
        readOnly={false}
        readOnlySubmitButton
        medholdReasons={medholdReasons}
        aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
        klageVurdering={klageVurdering.STADFESTE_YTELSESVEDTAK}
        previewCallback={vi.fn()}
        intl={intlMock}
        formProps={{}}
        sprakkode={sprakkode}
      />,
      { messages },
    );
    expect(screen.getByRole('combobox', { name: 'Hjemmel' })).toBeInTheDocument();
  });

  it('skal ikke vise hjemler når klagevurdering er opprettholdt og behandling er frisinn', () => {
    renderWithIntlAndReduxForm(
      <KlageVurderingRadioOptionsNfp
        fagsak={{ sakstype: { kode: fagsakYtelseType.FRISINN } }}
        readOnly={false}
        readOnlySubmitButton
        medholdReasons={medholdReasons}
        aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
        klageVurdering={klageVurdering.STADFESTE_YTELSESVEDTAK}
        previewCallback={vi.fn()}
        intl={intlMock}
        formProps={{}}
        sprakkode={sprakkode}
      />,
      { messages },
    );
    expect(screen.queryByRole('combobox', { name: 'Hjemmel' })).not.toBeInTheDocument();
  });
});
