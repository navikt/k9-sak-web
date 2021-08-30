import React from 'react';
import { shallow } from 'enzyme';

import { RadioGroupField, TextAreaField } from '@fpsak-frontend/form';

import SarligGrunn from '../../../kodeverk/sarligGrunn';
import Aktsomhet from '../../../kodeverk/aktsomhet';
import AktsomhetSarligeGrunnerFormPanel from './AktsomhetSarligeGrunnerFormPanel';
import AktsomhetGradUaktsomhetFormPanel from './AktsomhetGradUaktsomhetFormPanel';

import { intlMock } from '../../../../i18n';

describe('<AktsomhetGradUaktsomhetFormPanel>', () => {
  const sarligGrunnTyper = [
    {
      kode: SarligGrunn.GRAD_AV_UAKTSOMHET,
      navn: 'grad av uaktsomhet',
      kodeverk: '',
    },
    {
      kode: SarligGrunn.HELT_ELLER_DELVIS_NAVS_FEIL,
      navn: 'navs feil',
      kodeverk: '',
    },
  ];

  it('skal måtte velge om en skal tilbakekreve beløp når totalbeløpet er under 4 rettsgebyr når grad er simpel uaktsom', () => {
    const wrapper = shallow(
      <AktsomhetGradUaktsomhetFormPanel.WrappedComponent
        harGrunnerTilReduksjon
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.SIMPEL_UAKTSOM}
        erSerligGrunnAnnetValgt={false}
        sarligGrunnTyper={sarligGrunnTyper}
        harMerEnnEnYtelse
        feilutbetalingBelop={100}
        erTotalBelopUnder4Rettsgebyr
        intl={intlMock}
      />,
    );

    expect(wrapper.find(RadioGroupField)).toHaveLength(1);
    expect(wrapper.find(AktsomhetSarligeGrunnerFormPanel)).toHaveLength(1);
  });

  it('skal ikke måtte velge om en skal tilbakekreve beløp når totalbeløpet er under 4 rettsgebyr med grad er ulik simpel uaktsom', () => {
    const wrapper = shallow(
      <AktsomhetGradUaktsomhetFormPanel.WrappedComponent
        harGrunnerTilReduksjon
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.GROVT_UAKTSOM}
        erSerligGrunnAnnetValgt={false}
        sarligGrunnTyper={sarligGrunnTyper}
        harMerEnnEnYtelse
        feilutbetalingBelop={100}
        erTotalBelopUnder4Rettsgebyr
        intl={intlMock}
      />,
    );

    expect(wrapper.find(RadioGroupField)).toHaveLength(0);
    expect(wrapper.find(TextAreaField)).toHaveLength(1);
    expect(wrapper.find(AktsomhetSarligeGrunnerFormPanel)).toHaveLength(1);
  });

  it('skal ikke måtte velge om en skal tilbakekreve beløp når totalbeløpet er over 4 rettsgebyr med grad er lik simpel uaktsom', () => {
    const wrapper = shallow(
      <AktsomhetGradUaktsomhetFormPanel.WrappedComponent
        harGrunnerTilReduksjon
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.SIMPEL_UAKTSOM}
        erSerligGrunnAnnetValgt={false}
        sarligGrunnTyper={sarligGrunnTyper}
        harMerEnnEnYtelse
        feilutbetalingBelop={100}
        erTotalBelopUnder4Rettsgebyr={false}
        intl={intlMock}
      />,
    );

    expect(wrapper.find(RadioGroupField)).toHaveLength(0);
    expect(wrapper.find(TextAreaField)).toHaveLength(1);
    expect(wrapper.find(AktsomhetSarligeGrunnerFormPanel)).toHaveLength(1);
  });
});
