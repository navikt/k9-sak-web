import { screen } from '@testing-library/react';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { ProsessStegContainer } from '@k9-sak-web/behandling-felles';
import {
  aksjonspunktType,
  behandlingArsakType,
  behandlingResultatType,
  definisjon,
  status,
  venteårsak,
} from '@navikt/k9-sak-typescript-client';

const behandling = {
  id: 1,
  versjon: 1,
  type: behandlingType.FORSTEGANGSSOKNAD,
  status: behandlingStatus.BEHANDLING_UTREDES,
  sprakkode: 'NO',
  behandlingsresultat: {
    vedtaksbrev: 'FRITEKST',
    type: behandlingResultatType.IKKE_FASTSATT,
  },
  behandlingHenlagt: false,
  behandlingPaaVent: false,
  behandlingÅrsaker: [
    {
      behandlingArsakType: behandlingArsakType.ETTER_KLAGE,
    },
  ],
};

const aksjonspunkt5085 = {
  aksjonspunktType: aksjonspunktType.MANU,
  begrunnelse: null,
  besluttersBegrunnelse: null,
  definisjon: definisjon._5085,
  erAktivt: true,
  fristTid: null,
  kanLoses: true,
  status: status.OPPR,
  toTrinnsBehandling: false,
  toTrinnsBehandlingGodkjent: null,
  vilkarType: null,
  vurderPaNyttArsaker: null,
  venteårsak: venteårsak._,
};

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
              type: behandlingResultatType.IKKE_FASTSATT,
            },
          }}
          vilkar={[]}
          medlemskap={{ fom: '2019-01-01' }}
          aksjonspunkter={[aksjonspunkt5085]}
          isReadOnly={false}
          previewCallback={vi.fn()}
          submitCallback={vi.fn()}
          ytelseTypeKode={fagsakYtelseType.OMSORGSPENGER}
          arbeidsgiverOpplysningerPerId={{}}
          lagreDokumentdata={vi.fn()}
          hentFritekstbrevHtmlCallback={vi.fn()}
          beregningsgrunnlag={null}
          dokumentdataHente={{}}
          fritekstdokumenter={[]}
          simuleringResultat={null}
          tilbakekrevingvalg={null}
          informasjonsbehovVedtaksbrev={{ informasjonsbehov: [], mangler: [] }}
          overlappendeYtelser={[]}
          personopplysninger={{ aktoerId: '', fnr: '' }}
          tilgjengeligeVedtaksbrev={[]}
          vedtakVarsel={null}
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
              type: behandlingResultatType.IKKE_FASTSATT,
            },
          }}
          vilkar={[]}
          medlemskap={{ fom: '2019-01-01' }}
          aksjonspunkter={[
            {
              definisjon: definisjon._5015,
              begrunnelse: undefined,
              kanLoses: true,
              erAktivt: true,
            },
          ]}
          isReadOnly={false}
          previewCallback={vi.fn()}
          submitCallback={vi.fn()}
          ytelseTypeKode={fagsakYtelseType.OMSORGSPENGER}
          arbeidsgiverOpplysningerPerId={{}}
          lagreDokumentdata={vi.fn()}
          hentFritekstbrevHtmlCallback={vi.fn()}
          beregningsgrunnlag={null}
          dokumentdataHente={{}}
          fritekstdokumenter={[]}
          simuleringResultat={null}
          tilbakekrevingvalg={null}
          informasjonsbehovVedtaksbrev={{ informasjonsbehov: [], mangler: [] }}
          overlappendeYtelser={[]}
          personopplysninger={{ aktoerId: '', fnr: '' }}
          tilgjengeligeVedtaksbrev={[]}
          vedtakVarsel={null}
        />
      </ProsessStegContainer>,
    );

    expect(screen.queryByText('Har åpen tilbakekrevingssak som kan bli påvirket.')).not.toBeInTheDocument();
    expect(screen.queryByText('Vurder om tilbakekrevingssaken skal behandles først.')).not.toBeInTheDocument();
  });
});
