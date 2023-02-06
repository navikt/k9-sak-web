import React from 'react';
import { render, screen } from '@testing-library/react';
import sinon from 'sinon';

import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

const behandling = {
  id: 1,
  versjon: 1,
  type: {
    kode: behandlingType.FORSTEGANGSSOKNAD,
    kodeverk: '',
  },
  status: {
    kode: behandlingStatus.BEHANDLING_UTREDES,
    kodeverk: '',
  },
  sprakkode: {
    kode: 'NO',
    kodeverk: '',
  },
  behandlingsresultat: {
    vedtaksbrev: {
      kode: 'FRITEKST',
      kodeverk: '',
    },
    type: {
      kode: behandlingResultatType.IKKE_FASTSATT,
      kodeverk: '',
    },
  },
  behandlingPaaVent: false,
  behandlingHenlagt: false,
  behandlingÅrsaker: [
    {
      behandlingArsakType: {
        kode: klageBehandlingArsakType.ETTER_KLAGE,
        kodeverk: '',
      },
    },
  ],
};

const aksjonspunkt5040 = {
  aksjonspunktType: { kode: 'MANU', kodeverk: 'AKSJONSPUNKT_TYPE' },
  begrunnelse: null,
  besluttersBegrunnelse: null,
  definisjon: {
    kode: '5085',
    kodeverk: 'AKSJONSPUNKT_DEF',
  },
  erAktivt: true,
  fristTid: null,
  kanLoses: true,
  status: { kode: 'OPPR', kodeverk: 'AKSJONSPUNKT_STATUS' },
  toTrinnsBehandling: false,
  toTrinnsBehandlingGodkjent: null,
  vilkarType: null,
  vurderPaNyttArsaker: null,
  venteårsak: { kode: '-', kodeverk: 'VENT_AARSAK' },
};

const alleKodeverk = {};

describe('<AvslagårsakListe>', () => {
  it('Skal vise ap for sjekk tilbakekreving riktig', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);

    render(
      <VedtakProsessIndex
        behandling={{
          ...behandling,
          type: {
            kode: behandlingType.SOKNAD,
            kodeverk: '',
          },
          behandlingsresultat: {
            vedtaksbrev: {
              kode: 'FRITEKST',
            },
            type: {
              kode: behandlingResultatType.IKKE_FASTSATT,
            },
          },
        }}
        vilkar={[]}
        sendVarselOmRevurdering={false}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[aksjonspunkt5040]}
        employeeHasAccess={false}
        isReadOnly={false}
        previewCallback={sinon.spy()}
        submitCallback={sinon.spy()}
        alleKodeverk={alleKodeverk}
        featureToggles={{ NY_PROSESS_VEDTAK_ENABLED: true }}
        ytelseTypeKode={fagsakYtelseType.OMSORGSPENGER}
        arbeidsgiverOpplysningerPerId={{}}
        lagreDokumentdata={sinon.spy()}
        hentFritekstbrevHtmlCallback={sinon.spy()}
      />,
    );

    expect(screen.queryByText('Har åpen tilbakekrevingssak som kan bli påvirket.')).toBeInTheDocument();
    expect(screen.queryByText('Vurder om tilbakekrevingssaken skal behandles først.')).toBeInTheDocument();
  });

  it('Skal IKKS vise ap for sjekk tilbakekreving', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);

    render(
      <VedtakProsessIndex
        behandling={{
          ...behandling,
          type: {
            kode: behandlingType.SOKNAD,
            kodeverk: '',
          },
          behandlingsresultat: {
            vedtaksbrev: {
              kode: 'FRITEKST',
            },
            type: {
              kode: behandlingResultatType.IKKE_FASTSATT,
            },
          },
        }}
        vilkar={[]}
        sendVarselOmRevurdering={false}
        medlemskap={{ fom: '2019-01-01' }}
        aksjonspunkter={[
          {
            definisjon: {
              kode: aksjonspunktCodes.FORESLA_VEDTAK,
              kodeverk: '',
            },
            begrunnelse: undefined,
            kanLoses: true,
            erAktivt: true,
          },
        ]}
        employeeHasAccess={false}
        isReadOnly={false}
        previewCallback={sinon.spy()}
        submitCallback={sinon.spy()}
        alleKodeverk={alleKodeverk}
        featureToggles={{ NY_PROSESS_VEDTAK_ENABLED: true }}
        ytelseTypeKode={fagsakYtelseType.OMSORGSPENGER}
        arbeidsgiverOpplysningerPerId={{}}
        lagreDokumentdata={sinon.spy()}
        hentFritekstbrevHtmlCallback={sinon.spy()}
      />,
    );

    expect(screen.queryByText('Har åpen tilbakekrevingssak som kan bli påvirket.')).not.toBeInTheDocument();
    expect(screen.queryByText('Vurder om tilbakekrevingssaken skal behandles først.')).not.toBeInTheDocument();
  });
});
