import { screen } from '@testing-library/react';
import React from 'react';

import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { ProsessStegContainer } from '@k9-sak-web/behandling-felles';

const behandling = {
  id: 1,
  versjon: 1,
  type: behandlingType.FORSTEGANGSSOKNAD,
  status: behandlingStatus.BEHANDLING_UTREDES,
  sprakkode: 'NO',
  behandlingsresultat: {
    vedtaksbrev: {
      // #kodeverk: usikker på denne må sjekke med formidling
      kode: 'FRITEKST',
      kodeverk: '',
    },
    type: behandlingResultatType.IKKE_FASTSATT,
  },
  behandlingHenlagt: false,
  behandlingPaaVent: false,
  behandlingÅrsaker: [{ behandlingArsakType: klageBehandlingArsakType.ETTER_KLAGE }],
};

const aksjonspunkt5085 = {
  aksjonspunktType: 'MANU',
  begrunnelse: null,
  besluttersBegrunnelse: null,
  definisjon: '5085',
  erAktivt: true,
  fristTid: null,
  kanLoses: true,
  status: 'OPPR',
  toTrinnsBehandling: false,
  toTrinnsBehandlingGodkjent: null,
  vilkarType: null,
  vurderPaNyttArsaker: null,
  venteårsak: '-',
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
            type: behandlingType.SOKNAD,
            behandlingsresultat: {
              vedtaksbrev: {
                kode: 'FRITEKST',
              },
              type: behandlingResultatType.IKKE_FASTSATT,
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
            type: behandlingType.SOKNAD,
            behandlingsresultat: {
              vedtaksbrev: {
                kode: 'FRITEKST',
              },
              type: behandlingResultatType.IKKE_FASTSATT,
            },
          }}
          vilkar={[]}
          sendVarselOmRevurdering={false}
          medlemskap={{ fom: '2019-01-01' }}
          aksjonspunkter={[
            {
              definisjon: aksjonspunktCodes.FORESLA_VEDTAK,
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
