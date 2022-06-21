import React from 'react';
import { expect } from 'chai';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import StatusForBorgerFaktaPanel from './StatusForBorgerFaktaPanel';
import shallowWithIntl, { intlMock } from '../../../i18n';

describe('<StatusForBorgerFaktaPanel>', () => {
  it('skal vise radioknapper for vurdering av oppholdsrett', () => {
    const wrapper = shallowWithIntl(
      <StatusForBorgerFaktaPanel.WrappedComponent
        apKode={aksjonspunktCodes.AVKLAR_OPPHOLDSRETT}
        intl={intlMock}
        erEosBorger
        readOnly={false}
        isBorgerAksjonspunktClosed={false}
        alleMerknaderFraBeslutter={{}}
      />,
    );
    const groups = wrapper.find('RadioGroupField');
    expect(groups).to.have.length(2);

    const radioFieldsGroup1 = groups.first().find('RadioOption');
    expect(radioFieldsGroup1).to.have.length(2);
    expect(radioFieldsGroup1.first().prop('label').id).to.eql('StatusForBorgerFaktaPanel.CitizenEEA');
    expect(radioFieldsGroup1.last().prop('label').id).to.eql('StatusForBorgerFaktaPanel.CitizenOutsideEEA');
    const radioFieldsGroup2 = groups.last().find('RadioOption');
    expect(radioFieldsGroup2).to.have.length(2);
    expect(radioFieldsGroup2.first().prop('label').id).to.eql('StatusForBorgerFaktaPanel.HarOppholdsrett');
    expect(radioFieldsGroup2.last().prop('label').props.id).to.eql('StatusForBorgerFaktaPanel.HarIkkeOppholdsrett');
  });

  it('skal vise radioknapper for vurdering av lovlig opphold', () => {
    const wrapper = shallowWithIntl(
      <StatusForBorgerFaktaPanel.WrappedComponent
        apKode={aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD}
        intl={intlMock}
        erEosBorger={false}
        readOnly={false}
        isBorgerAksjonspunktClosed={false}
        alleMerknaderFraBeslutter={{}}
      />,
    );

    const groups = wrapper.find('RadioGroupField');
    expect(groups).to.have.length(2);
    const radioFieldsGroup1 = groups.first().find('RadioOption');
    expect(radioFieldsGroup1).to.have.length(2);
    expect(radioFieldsGroup1.first().prop('label').id).to.eql('StatusForBorgerFaktaPanel.CitizenEEA');
    expect(radioFieldsGroup1.last().prop('label').id).to.eql('StatusForBorgerFaktaPanel.CitizenOutsideEEA');
    const radioFieldsGroup2 = groups.last().find('RadioOption');
    expect(radioFieldsGroup2).to.have.length(2);
    expect(radioFieldsGroup2.first().prop('label').id).to.eql('StatusForBorgerFaktaPanel.HarLovligOpphold');
  });

  it('skal sette initielle verdi når det er EØS borger og ingen vurdering er lagret', () => {
    const periode = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT],
    };
    const aksjonspunkter = [
      {
        definisjon: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
        status: 'UTFO',
      },
    ];
    const initialValues = StatusForBorgerFaktaPanel.buildInitialValues(periode, aksjonspunkter);

    expect(initialValues).to.eql({
      apKode: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
      erEosBorger: true,
      oppholdsrettVurdering: undefined,
      lovligOppholdVurdering: undefined,
      isBorgerAksjonspunktClosed: true,
    });
  });

  it('skal sette initielle verdi når det er EØS borger og vurdering er lagret', () => {
    const periode = {
      aksjonspunkter: [],
      erEosBorger: true,
      oppholdsrettVurdering: true,
    };

    const aksjonspunkter = [];

    const initialValues = StatusForBorgerFaktaPanel.buildInitialValues(periode, aksjonspunkter);

    expect(initialValues).to.eql({
      apKode: undefined,
      erEosBorger: true,
      oppholdsrettVurdering: true,
      lovligOppholdVurdering: undefined,
      isBorgerAksjonspunktClosed: false,
    });
  });

  it('skal sette initielle verdi når regionkode ikke finnes men en har oppholdsrett-aksjonspunkt', () => {
    const periode = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT],
    };
    const aksjonspunkter = [
      {
        definisjon: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
        status: 'UTFO',
      },
    ];

    const initialValues = StatusForBorgerFaktaPanel.buildInitialValues(periode, aksjonspunkter);

    expect(initialValues).to.eql({
      apKode: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
      erEosBorger: true,
      oppholdsrettVurdering: undefined,
      lovligOppholdVurdering: undefined,
      isBorgerAksjonspunktClosed: true,
    });
  });

  it('skal sette initielle verdi når det ikke er EØS borger', () => {
    const periode = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT],
      erEosBorger: false,
      lovligOppholdVurdering: false,
    };
    const aksjonspunkter = [];

    const initialValues = StatusForBorgerFaktaPanel.buildInitialValues(periode, aksjonspunkter);

    expect(initialValues).to.eql({
      apKode: undefined,
      erEosBorger: false,
      oppholdsrettVurdering: undefined,
      lovligOppholdVurdering: false,
      isBorgerAksjonspunktClosed: false,
    });
  });
});
