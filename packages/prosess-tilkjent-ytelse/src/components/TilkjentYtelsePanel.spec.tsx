import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { Aksjonspunkt, FamilieHendelse, InntektArbeidYtelse, Personopplysninger, Soknad } from '@k9-sak-web/types';
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
        inntektArbeidYtelse={{} as InntektArbeidYtelse}
        vilkar={[]}
      />,
    );
    expect(wrapper.find(Undertittel)).to.have.length(1);
    // @ts-ignore fiks
    expect(wrapper.find(Undertittel).props().children.props.id).to.equal('TilkjentYtelse.Title');
    expect(wrapper.find(Tilbaketrekkpanel)).to.have.length(0);
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
        inntektArbeidYtelse={{} as InntektArbeidYtelse}
        vilkar={[]}
      />,
    );
    expect(wrapper.find(Tilbaketrekkpanel)).to.have.length(1);
  });
});
