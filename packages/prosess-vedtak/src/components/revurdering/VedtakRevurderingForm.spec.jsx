import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import BehandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import { VedtakRevurderingFormImpl as UnwrappedForm } from './VedtakRevurderingForm';
import VedtakRevurderingSubmitPanel from './VedtakRevurderingSubmitPanel';
import VedtakAvslagRevurderingPanel from './VedtakAvslagRevurderingPanel';
import VedtakOpphorRevurderingPanel from './VedtakOpphorRevurderingPanel';
import VedtakAksjonspunktPanel from '../VedtakAksjonspunktPanel';
import VedtakInnvilgetRevurderingPanel from './VedtakInnvilgetRevurderingPanel';
import BrevPanel from '../brev/BrevPanel';

const createBehandling = (behandlingResultatType, behandlingHenlagt) => ({
  id: 1,
  versjon: 123,
  fagsakId: 1,
  aksjonspunkter: [],
  behandlingPaaVent: false,
  behandlingHenlagt,
  sprakkode: {
    kode: 'NO',
    navn: 'norsk',
  },
  behandlingsresultat: {
    id: 1,
    type: {
      kode: behandlingResultatType,
      navn: 'test',
    },
    avslagsarsak:
      behandlingResultatType === BehandlingResultatType.AVSLATT
        ? {
            kode: '1019',
            navn: 'Manglende dokumentasjon',
          }
        : null,
    avslagsarsakFritekst: null,
  },
  status: {
    kode: behandlingStatus.BEHANDLING_UTREDES,
    navn: 'test',
  },
  type: {
    kode: 'test',
    navn: 'test',
  },
  opprettet: '16‎.‎07‎.‎2004‎ ‎17‎:‎35‎:‎21',
});

const resultatstruktur = {
  antallBarn: 1,
};

const tilgjengeligeVedtaksbrev = { vedtaksbrevmaler: {} };

const createBehandlingAvslag = () => createBehandling(BehandlingResultatType.AVSLATT);
const createBehandlingOpphor = () => createBehandling(BehandlingResultatType.OPPHOR);

describe('<VedtakRevurderingForm>', () => {
  it('skal vise result ved avslag, og submitpanel', () => {
    const previewCallback = sinon.spy();
    const revurdering = createBehandlingAvslag();

    revurdering.type = {
      kode: 'BT-004',
      navn: 'Revurdering',
    };

    revurdering.aksjonspunkter.push({
      id: 0,
      definisjon: {
        navn: 'Foreslå vedtak',
        kode: aksjonspunktCodes.FORESLA_VEDTAK,
      },
      status: {
        navn: 'Opprettet',
        kode: '',
      },
      kanLoses: true,
      erAktivt: true,
    });

    const wrapper = shallow(
      <UnwrappedForm
        {...reduxFormPropsMock}
        intl={intlMock}
        behandlingStatusKode={revurdering.status.kode}
        behandlingresultat={revurdering.behandlingsresultat}
        aksjonspunkter={revurdering.aksjonspunkter}
        previewCallback={previewCallback}
        initialValues={{ skalBrukeOverstyrendeFritekstBrev: false }}
        readOnly={false}
        ytelseTypeKode="ES"
        isBehandlingReadOnly={false}
        resultatstruktur={resultatstruktur}
        beregningErManueltFastsatt={false}
        arbeidsgiverOpplysningerPerId={{}}
        tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
      />,
    );

    expect(wrapper.find(VedtakAksjonspunktPanel)).to.have.length(1);
    expect(wrapper.find(VedtakAvslagRevurderingPanel)).to.have.length(1);
    expect(wrapper.find(VedtakInnvilgetRevurderingPanel)).to.have.length(0);
    expect(wrapper.find(VedtakRevurderingSubmitPanel)).to.have.length(1);
    expect(wrapper.find(BrevPanel)).to.have.length(1);
  });

  it('Revurdering, skal vise resultat ved endret belop, hovedknappen for totrinnskontroll', () => {
    const previewCallback = sinon.spy();
    const revurdering = createBehandlingAvslag();

    revurdering.behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.INNVILGET,
        navn: 'Innvilget',
      },
    };
    revurdering.aksjonspunkter.push({
      id: 0,
      definisjon: {
        navn: 'Foreslå vedtak',
        kode: aksjonspunktCodes.FORESLA_VEDTAK,
      },
      status: {
        navn: 'Opprettet',
        kode: '',
      },
      kanLoses: true,
      erAktivt: true,
    });

    const wrapper = shallow(
      <UnwrappedForm
        {...reduxFormPropsMock}
        intl={intlMock}
        antallBarn={1}
        behandlingStatusKode={revurdering.status.kode}
        behandlingresultat={revurdering.behandlingsresultat}
        aksjonspunkter={revurdering.aksjonspunkter}
        previewCallback={previewCallback}
        aksjonspunktKoder={[aksjonspunktCodes.FORESLA_VEDTAK]}
        initialValues={{ skalBrukeOverstyrendeFritekstBrev: false }}
        readOnly={false}
        ytelseTypeKode="ES"
        isBehandlingReadOnly
        resultatstruktur={resultatstruktur}
        beregningErManueltFastsatt={false}
        arbeidsgiverOpplysningerPerId={{}}
        tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
      />,
    );

    expect(wrapper.find(VedtakAksjonspunktPanel)).to.have.length(1);
    expect(wrapper.find(VedtakAvslagRevurderingPanel)).to.have.length(0);
    expect(wrapper.find(VedtakInnvilgetRevurderingPanel)).to.have.length(1);
    expect(wrapper.find(VedtakRevurderingSubmitPanel)).to.have.length(1);
    expect(wrapper.find(BrevPanel)).to.have.length(1);
  });

  it('skal vise result ved ingen endring, hoved knappen', () => {
    const previewCallback = sinon.spy();
    const revurdering = createBehandlingAvslag();
    revurdering.behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.INNVILGET,
        navn: 'Innvilget',
      },
    };

    const wrapper = shallow(
      <UnwrappedForm
        {...reduxFormPropsMock}
        intl={intlMock}
        antallBarn={1}
        behandlingStatusKode={revurdering.status.kode}
        behandlingresultat={revurdering.behandlingsresultat}
        aksjonspunkter={revurdering.aksjonspunkter}
        previewCallback={previewCallback}
        initialValues={{ skalBrukeOverstyrendeFritekstBrev: false }}
        readOnly={false}
        ytelseTypeKode="ES"
        isBehandlingReadOnly
        resultatstruktur={resultatstruktur}
        beregningErManueltFastsatt={false}
        arbeidsgiverOpplysningerPerId={{}}
        tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
      />,
    );

    expect(wrapper.find(VedtakAksjonspunktPanel)).to.have.length(1);
    expect(wrapper.find(VedtakAvslagRevurderingPanel)).to.have.length(0);
    expect(wrapper.find(VedtakInnvilgetRevurderingPanel)).to.have.length(1);
    expect(wrapper.find(VedtakRevurderingSubmitPanel)).to.have.length(1);
    expect(wrapper.find(BrevPanel)).to.have.length(1);
  });

  it('skal vise result ved ingen endring, og submitpanel', () => {
    const previewCallback = sinon.spy();
    const revurdering = createBehandlingAvslag();
    revurdering.behandlingsresultat = {
      id: 1,
      type: {
        kode: BehandlingResultatType.INNVILGET,
        navn: 'Innvilget',
      },
    };

    const wrapper = shallow(
      <UnwrappedForm
        {...reduxFormPropsMock}
        intl={intlMock}
        behandlingStatusKode={revurdering.status.kode}
        behandlingresultat={revurdering.behandlingsresultat}
        aksjonspunkter={revurdering.aksjonspunkter}
        antallBarn={1}
        initialValues={{ skalBrukeOverstyrendeFritekstBrev: false }}
        previewCallback={previewCallback}
        haveSentVarsel
        readOnly={false}
        ytelseTypeKode="ES"
        isBehandlingReadOnly
        resultatstruktur={resultatstruktur}
        beregningErManueltFastsatt={false}
        arbeidsgiverOpplysningerPerId={{}}
        tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
      />,
    );

    expect(wrapper.find(VedtakAksjonspunktPanel)).to.have.length(1);
    expect(wrapper.find(VedtakAvslagRevurderingPanel)).to.have.length(0);
    expect(wrapper.find(VedtakInnvilgetRevurderingPanel)).to.have.length(1);
    expect(wrapper.find(VedtakRevurderingSubmitPanel)).to.have.length(1);
    expect(wrapper.find(BrevPanel)).to.have.length(1);
  });

  it('skal vise opphørspanel når behandlingsresultat er opphør', () => {
    const previewCallback = sinon.spy();
    const revurdering = createBehandlingOpphor();

    const wrapper = shallow(
      <UnwrappedForm
        {...reduxFormPropsMock}
        intl={intlMock}
        behandlingStatusKode={revurdering.status.kode}
        behandlingresultat={revurdering.behandlingsresultat}
        aksjonspunkter={revurdering.aksjonspunkter}
        antallBarn={1}
        initialValues={{ skalBrukeOverstyrendeFritekstBrev: false }}
        previewCallback={previewCallback}
        haveSentVarsel
        readOnly={false}
        ytelseTypeKode="ES"
        isBehandlingReadOnly
        resultatstruktur={resultatstruktur}
        beregningErManueltFastsatt={false}
        arbeidsgiverOpplysningerPerId={{}}
        tilgjengeligeVedtaksbrev={tilgjengeligeVedtaksbrev}
      />,
    );

    expect(wrapper.find(VedtakAksjonspunktPanel)).to.have.length(1);
    expect(wrapper.find(VedtakAvslagRevurderingPanel)).to.have.length(0);
    expect(wrapper.find(VedtakInnvilgetRevurderingPanel)).to.have.length(0);
    expect(wrapper.find(VedtakOpphorRevurderingPanel)).to.have.length(1);
    expect(wrapper.find(VedtakRevurderingSubmitPanel)).to.have.length(1);
    expect(wrapper.find(BrevPanel)).to.have.length(1);
  });

  it('skal vise avkrysningsboks for roller uten overstyringstilgang', () => {
    const previewCallback = sinon.spy();
    const revurdering = createBehandlingOpphor();

    const wrapper = shallow(
      <UnwrappedForm
        {...reduxFormPropsMock}
        intl={intlMock}
        behandlingStatusKode={revurdering.status.kode}
        behandlingresultat={revurdering.behandlingsresultat}
        aksjonspunkter={revurdering.aksjonspunkter}
        antallBarn={1}
        initialValues={{ skalBrukeOverstyrendeFritekstBrev: false }}
        previewCallback={previewCallback}
        haveSentVarsel
        readOnly={false}
        kanOverstyre={false}
        ytelseTypeKode="ES"
        isBehandlingReadOnly
        resultatstruktur={resultatstruktur}
        beregningErManueltFastsatt={false}
        tilgjengeligeVedtaksbrev={{
          vedtaksbrevmaler: {
            [vedtaksbrevtype.AUTOMATISK]: dokumentMalType.INNVILGELSE,
            [vedtaksbrevtype.FRITEKST]: dokumentMalType.FRITKS,
          },
        }}
        arbeidsgiverOpplysningerPerId={{}}
      />,
    );

    const overstyringsKnapp = wrapper.find('VedtakOverstyrendeKnapp');
    expect(overstyringsKnapp).to.have.length(1);
  });
});
