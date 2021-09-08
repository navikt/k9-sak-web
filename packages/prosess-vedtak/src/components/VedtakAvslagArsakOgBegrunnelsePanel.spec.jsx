import React from 'react';
import { expect } from 'chai';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { VedtakAvslagArsakOgBegrunnelsePanel } from './VedtakAvslagArsakOgBegrunnelsePanel';
import shallowWithIntl, { intlMock } from '../../i18n';

describe('<VedtakAvslagArsakOgBegrunnelsePanel>', () => {
  it('skal rendre avslagspanel og textArea når en har ikke oppfylt søknadsfristvilkår', () => {
    const sprakkode = {
      kode: 'NO',
      navn: 'norsk',
    };
    const vilkar = [
      {
        vilkarType: {
          kode: vilkarType.SOKNADFRISTVILKARET,
        },
        lovReferanse: '§ 22-13, 2. ledd',
        perioder: [
          {
            vilkarStatus: {
              kode: vilkarUtfallType.IKKE_OPPFYLT,
            },
          },
        ],
      },
    ];
    const behandlingsresultat = {
      id: 1,
      type: {
        kode: 'test',
        navn: 'test',
      },
    };
    const vedtakVarsel = {
      avslagsarsakFritekst: null,
      avslagsarsak: {
        kode: '1019',
      },
    };
    const wrapper = shallowWithIntl(
      <VedtakAvslagArsakOgBegrunnelsePanel
        intl={intlMock}
        behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
        vilkar={vilkar}
        aksjonspunkter={[]}
        behandlingsresultat={behandlingsresultat}
        sprakkode={sprakkode}
        readOnly
        alleKodeverk={{}}
        vedtakVarsel={vedtakVarsel}
      />,
    );

    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(1);
    expect(undertekstFields.last().childAt(0).text()).to.eql('Årsak til avslag');

    const textArea = wrapper.find('TextAreaField');
    expect(textArea).to.have.length(1);
    expect(textArea.prop('name')).is.eql('begrunnelse');
    expect(textArea.prop('maxLength')).is.eql(1500);
  });
});
