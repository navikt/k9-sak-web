import React from 'react';
import sinon from 'sinon';
import { Aksjonspunkt, FamilieHendelse, Personopplysninger, ArbeidsforholdV2, Soknad } from '@k9-sak-web/types';
import { Undertittel } from 'nav-frontend-typografi';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import { TilkjentYtelsePanelImpl } from './TilkjentYtelsePanel';
import Tilbaketrekkpanel from './tilbaketrekk/Tilbaketrekkpanel';
import shallowWithIntl from '../../i18n';

const tilbaketrekkAP = {
  definisjon: {
    kode: aksjonspunktCodes.VURDER_TILBAKETREKK,
  },
  status: {
    kode: 'OPPR',
  },
  begrunnelse: undefined,
} as Aksjonspunkt;

const arbeidsforhold = [
  {
    id: '910909088-ab549827-4f9c-40f3-875c-3c28631b2291',
    arbeidsgiver: { arbeidsgiverOrgnr: '910909088', arbeidsgiverAktørId: null },
    arbeidsforhold: {
      internArbeidsforholdId: 'ab549827-4f9c-40f3-875c-3c28631b2291',
      eksternArbeidsforholdId: 'ARB001-001',
    },
    yrkestittel: 'Ukjent',
    begrunnelse: null,
    perioder: [{ fom: '2020-06-30', tom: '9999-12-31' }],
    handlingType: { kode: 'BRUK', kodeverk: 'ARBEIDSFORHOLD_HANDLING_TYPE' },
    kilde: [{ kode: 'AA-Registeret', kodeverk: 'ARBEIDSFORHOLD_KILDE' }],
    permisjoner: [],
    stillingsprosent: 100.0,
    aksjonspunktÅrsaker: [],
    inntektsmeldinger: null,
  },
] as ArbeidsforholdV2[];

describe('<TilkjentYtelsePanelImpl>', () => {
  it('skall innehålla rätt undertekst', () => {
    const wrapper = shallowWithIntl(
      <TilkjentYtelsePanelImpl
        readOnly
        beregningresultat={null}
        submitCallback={sinon.spy()}
        readOnlySubmitButton
        behandlingId={1}
        alleKodeverk={{}}
        behandlingVersjon={1}
        aksjonspunkter={[]}
        gjeldendeFamiliehendelse={{} as FamilieHendelse}
        personopplysninger={{} as Personopplysninger}
        soknad={{} as Soknad}
        fagsakYtelseTypeKode=""
        arbeidsforhold={arbeidsforhold}
        arbeidsgiverOpplysningerPerId={{}}
        vilkar={[]}
      />,
    );
    expect(wrapper.find(Undertittel)).toHaveLength(1);
    // @ts-ignore fiks
    expect(wrapper.find(Undertittel).props().children.props.id).toBe('TilkjentYtelse.Title');
    expect(wrapper.find(Tilbaketrekkpanel)).toHaveLength(0);
  });

  it('Skal vise tilbaketrekkpanel gitt tilbaketrekkaksjonspunkt', () => {
    const wrapper = shallowWithIntl(
      <TilkjentYtelsePanelImpl
        readOnly
        aksjonspunkter={[]}
        beregningresultat={null}
        submitCallback={sinon.spy()}
        readOnlySubmitButton
        vurderTilbaketrekkAP={tilbaketrekkAP}
        behandlingId={1}
        alleKodeverk={{}}
        behandlingVersjon={1}
        gjeldendeFamiliehendelse={{} as FamilieHendelse}
        personopplysninger={{} as Personopplysninger}
        soknad={{} as Soknad}
        fagsakYtelseTypeKode=""
        arbeidsforhold={arbeidsforhold}
        arbeidsgiverOpplysningerPerId={{}}
        vilkar={[]}
      />,
    );
    expect(wrapper.find(Tilbaketrekkpanel)).toHaveLength(1);
  });
});
