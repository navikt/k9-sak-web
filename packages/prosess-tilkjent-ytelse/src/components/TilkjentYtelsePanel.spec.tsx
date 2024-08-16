import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { Aksjonspunkt, FamilieHendelse, Personopplysninger, Soknad } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import messages from '../../i18n/nb_NO.json';
import TilkjentYtelsePanelImpl from './TilkjentYtelsePanel';

const tilbaketrekkAP = {
  definisjon: {
    kode: aksjonspunktCodes.VURDER_TILBAKETREKK,
  },
  status: {
    kode: 'OPPR',
  },
  begrunnelse: undefined,
} as Aksjonspunkt;

describe('<TilkjentYtelsePanelImpl>', () => {
  it('skall innehålla rätt undertekst', () => {
    renderWithIntl(
      <TilkjentYtelsePanelImpl
        readOnly
        beregningsresultat={null}
        submitCallback={vi.fn()}
        readOnlySubmitButton
        behandlingId={1}
        alleKodeverk={{}}
        behandlingVersjon={1}
        aksjonspunkter={[]}
        gjeldendeFamiliehendelse={{} as FamilieHendelse}
        personopplysninger={{} as Personopplysninger}
        soknad={{} as Soknad}
        fagsakYtelseTypeKode=""
        arbeidsgiverOpplysningerPerId={{}}
      />,
      { messages },
    );

    expect(screen.getByRole('heading', { name: 'Tilkjent ytelse' })).toBeInTheDocument();
  });

  it('Skal vise tilbaketrekkpanel gitt tilbaketrekkaksjonspunkt', () => {
    renderWithIntl(
      <TilkjentYtelsePanelImpl
        readOnly
        aksjonspunkter={[tilbaketrekkAP]}
        beregningsresultat={null}
        submitCallback={vi.fn()}
        readOnlySubmitButton
        behandlingId={1}
        alleKodeverk={{}}
        behandlingVersjon={1}
        gjeldendeFamiliehendelse={{} as FamilieHendelse}
        personopplysninger={{} as Personopplysninger}
        soknad={{} as Soknad}
        fagsakYtelseTypeKode=""
        arbeidsgiverOpplysningerPerId={{}}
      />,
      { messages },
    );
    expect(screen.getByRole('heading', { name: 'Tilkjent ytelse' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Pleiepengene er utbetalt til søker, arbeidsgiver krever nå refusjon fra startdato av pleiepengene. Vurder om beløpet som er feilutbetalt skal tilbakekreves fra søker eller om dette er en sak mellom arbeidstaker og arbeidsgiver.',
      ),
    ).toBeInTheDocument();
  });
});
