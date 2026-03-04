import { screen } from '@testing-library/react';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { ProsessStegContainer } from '@k9-sak-web/behandling-felles';
import { AksjonspunktType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktType.js';
import { aksjonspunktCodes as AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { aksjonspunktStatus as AksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { Venteårsak } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/Venteårsak.js';
import { BehandlingResultatType } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingResultatType.js';
import { BehandlingÅrsakType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingÅrsakType.js';

const behandling = {
  id: 1,
  versjon: 1,
  type: behandlingType.FORSTEGANGSSOKNAD,
  status: behandlingStatus.BEHANDLING_UTREDES,
  språkkode: 'NO',
  behandlingsresultat: {
    vedtaksbrev: 'FRITEKST',
    type: BehandlingResultatType.IKKE_FASTSATT,
  },
  behandlingHenlagt: false,
  behandlingPåVent: false,
  behandlingÅrsaker: [
    {
      behandlingArsakType: BehandlingÅrsakType.ETTER_KLAGE,
    },
  ],
};

const aksjonspunkt5085 = {
  aksjonspunktType: AksjonspunktType.MANUELL,
  begrunnelse: null,
  besluttersBegrunnelse: null,
  definisjon: AksjonspunktDefinisjon.SJEKK_TILBAKEKREVING,
  erAktivt: true,
  fristTid: null,
  kanLoses: true,
  status: AksjonspunktStatus.OPPRETTET,
  toTrinnsBehandling: false,
  toTrinnsBehandlingGodkjent: null,
  vilkarType: null,
  vurderPaNyttArsaker: null,
  venteårsak: Venteårsak.UDEFINERT,
};

describe('<AvslagårsakListe>', () => {
  it('Skal vise ap for sjekk tilbakekreving riktig', () => {
    renderWithIntl(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={() => {}}>
        <VedtakProsessIndex
          behandling={{
            ...behandling,
            type: behandlingType.SOKNAD,
            behandlingsresultat: {
              type: BehandlingResultatType.IKKE_FASTSATT,
            },
          }}
          vilkar={[]}
          medlemskap={{ fom: '2019-01-01' }}
          aksjonspunkter={[aksjonspunkt5085]}
          isReadOnly={false}
          previewCallback={vi.fn()}
          submitCallback={vi.fn()}
          ytelseTypeKode={fagsakYtelsesType.OMSORGSPENGER}
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
    renderWithIntl(
      <ProsessStegContainer formaterteProsessStegPaneler={[]} velgProsessStegPanelCallback={() => {}}>
        <VedtakProsessIndex
          behandling={{
            ...behandling,
            type: behandlingType.SOKNAD,
            behandlingsresultat: {
              type: BehandlingResultatType.IKKE_FASTSATT,
            },
          }}
          vilkar={[]}
          medlemskap={{ fom: '2019-01-01' }}
          aksjonspunkter={[
            {
              definisjon: AksjonspunktDefinisjon.FORESLÅ_VEDTAK,
              begrunnelse: undefined,
              kanLoses: true,
              erAktivt: true,
            },
          ]}
          isReadOnly={false}
          previewCallback={vi.fn()}
          submitCallback={vi.fn()}
          ytelseTypeKode={fagsakYtelsesType.OMSORGSPENGER}
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
