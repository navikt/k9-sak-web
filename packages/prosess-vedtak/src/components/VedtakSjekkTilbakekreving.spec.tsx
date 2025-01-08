import { screen } from '@testing-library/react';

import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { ProsessStegContainer } from '@k9-sak-web/behandling-felles';

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
