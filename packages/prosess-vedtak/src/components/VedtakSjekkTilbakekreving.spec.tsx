import { screen } from '@testing-library/react';
import React from 'react';

import klageBehandlingArsakType from '@k9-sak-web/kodeverk/src/behandlingArsakType';
import behandlingResultatType from '@k9-sak-web/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@k9-sak-web/kodeverk/src/behandlingStatus';
import behandlingType from '@k9-sak-web/kodeverk/src/behandlingType';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';

import { ProsessStegContainer } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
import VedtakProsessIndex from '@k9-sak-web/prosess-vedtak';
import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';

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
  behandlingHenlagt: false,
  behandlingPaaVent: false,
  behandlingÅrsaker: [
    {
      behandlingArsakType: {
        kode: klageBehandlingArsakType.ETTER_KLAGE,
        kodeverk: '',
      },
    },
  ],
};

const aksjonspunkt5085 = {
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

    renderWithIntl(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={() => {}}>
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
          aksjonspunkter={[aksjonspunkt5085]}
          employeeHasAccess={false}
          isReadOnly={false}
          previewCallback={vi.fn()}
          submitCallback={vi.fn()}
          alleKodeverk={alleKodeverk}
          ytelseTypeKode={fagsakYtelseType.OMSORGSPENGER}
          arbeidsgiverOpplysningerPerId={{}}
          lagreDokumentdata={vi.fn()}
          hentFritekstbrevHtmlCallback={vi.fn()}
        />
      </ProsessStegContainer>,
    );

    expect(
      screen.queryByText(
        'Saken har en åpen ytelsesbehandling og en tilbakekrevingssak. Ytelsesbehandlingen kan påvirke resultatet av den åpne tilbakekrevingssaken.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText('Vurder om tilbakekrevingssaken skal behandles først.')).toBeInTheDocument();
  });

  it('Skal IKKE vise ap for sjekk tilbakekreving', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);

    renderWithIntl(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={() => {}}>
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
          previewCallback={vi.fn()}
          submitCallback={vi.fn()}
          alleKodeverk={alleKodeverk}
          ytelseTypeKode={fagsakYtelseType.OMSORGSPENGER}
          arbeidsgiverOpplysningerPerId={{}}
          lagreDokumentdata={vi.fn()}
          hentFritekstbrevHtmlCallback={vi.fn()}
        />
      </ProsessStegContainer>,
    );

    expect(screen.queryByText('Har åpen tilbakekrevingssak som kan bli påvirket.')).not.toBeInTheDocument();
    expect(screen.queryByText('Vurder om tilbakekrevingssaken skal behandles først.')).not.toBeInTheDocument();
  });
});
