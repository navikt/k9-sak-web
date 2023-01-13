import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import klageVurdering from '@fpsak-frontend/kodeverk/src/klageVurdering';
import { KlageVurderingRadioOptionsNfp } from './KlageVurderingRadioOptionsNfp';

import shallowWithIntl, { intlMock } from '../../../i18n';

describe('<KlageVurderingRadioOptionsNfp>', () => {
  const sprakkode = 'NO';
  const medholdReasons = [
    { kode: 'NYE_OPPLYSNINGER', navn: 'Nytt faktum', kodeverk: 'KLAGE_MEDHOLD_AARSAK' },
    { kode: 'ULIK_REGELVERKSTOLKNING', navn: 'Feil lovanvendelse', kodeverk: 'KLAGE_MEDHOLD_AARSAK' },
    { kode: 'ULIK_VURDERING', navn: 'Ulik skjønnsvurdering', kodeverk: 'KLAGE_MEDHOLD_AARSAK' },
    { kode: 'PROSESSUELL_FEIL', navn: 'Saksbehandlingsfeil', kodeverk: 'KLAGE_MEDHOLD_AARSAK' },
  ];

  it('skal vise to options når klage opprettholdt', () => {
    const wrapper = shallowWithIntl(
      <KlageVurderingRadioOptionsNfp
        fagsak={{ sakstype: fagsakYtelseType.OMSORGSPENGER }}
        readOnly={false}
        readOnlySubmitButton
        medholdReasons={medholdReasons}
        aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
        klageVurdering={klageVurdering.STADFESTE_YTELSESVEDTAK}
        previewCallback={sinon.spy()}
        intl={intlMock}
        formProps={{}}
        sprakkode={sprakkode}
      />,
    );
    const radios = wrapper.find('RadioOption');
    expect(radios).to.have.length(2);
    expect(radios.at(0).prop('label').id).to.equal('Klage.ResolveKlage.ChangeVedtak');
    expect(radios.at(1).prop('label').id).to.equal('Klage.ResolveKlage.KeepVedtakNfp');
  });

  it('skal vise fem options når klage medhold', () => {
    const wrapper = shallowWithIntl(
      <KlageVurderingRadioOptionsNfp
        fagsak={{ sakstype: fagsakYtelseType.OMSORGSPENGER }}
        readOnly={false}
        readOnlySubmitButton
        aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
        klageVurdering={klageVurdering.MEDHOLD_I_KLAGE}
        medholdReasons={medholdReasons}
        previewCallback={sinon.spy()}
        intl={intlMock}
        formProps={{}}
        sprakkode={sprakkode}
      />,
    );
    const radios = wrapper.find('RadioOption');
    expect(radios).to.have.length(5);
    expect(radios.at(0).prop('label').id).to.equal('Klage.ResolveKlage.ChangeVedtak');
    expect(radios.at(1).prop('label').id).to.equal('Klage.ResolveKlage.KeepVedtakNfp');
    expect(radios.at(2).prop('label').id).to.equal('Klage.Behandle.Omgjort');
    expect(radios.at(3).prop('label').id).to.equal('Klage.Behandle.Ugunst');
    expect(radios.at(4).prop('label').id).to.equal('Klage.Behandle.DelvisOmgjort');
  });

  it('skal vise hjemler når klagevurdering er opprettholdt', () => {
    const wrapper = shallowWithIntl(
      <KlageVurderingRadioOptionsNfp
        fagsak={{ sakstype: fagsakYtelseType.OMSORGSPENGER }}
        readOnly={false}
        readOnlySubmitButton
        medholdReasons={medholdReasons}
        aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
        klageVurdering={klageVurdering.STADFESTE_YTELSESVEDTAK}
        previewCallback={sinon.spy()}
        intl={intlMock}
        formProps={{}}
        sprakkode={sprakkode}
      />,
    );
    expect(wrapper.find('SelectField').props().name).to.equal('klageHjemmel');
    expect(wrapper.find('SelectField')).to.have.length(1);
  });

  it('skal ikke vise hjemler når klagevurdering er opprettholdt og behandling er frisinn', () => {
    const wrapper = shallowWithIntl(
      <KlageVurderingRadioOptionsNfp
        fagsak={{ sakstype: fagsakYtelseType.FRISINN }}
        readOnly={false}
        readOnlySubmitButton
        medholdReasons={medholdReasons}
        aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
        klageVurdering={klageVurdering.STADFESTE_YTELSESVEDTAK}
        previewCallback={sinon.spy()}
        intl={intlMock}
        formProps={{}}
        sprakkode={sprakkode}
      />,
    );
    expect(wrapper.find('SelectField')).to.have.length(0);
  });
});
