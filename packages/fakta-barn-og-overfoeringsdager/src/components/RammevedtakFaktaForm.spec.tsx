import React from 'react';
import { expect } from 'chai';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { shallowWithIntl } from '../../i18n/intl-enzyme-test-helper-fakta-rammevedtak';
import { RammevedtakFaktaFormImpl } from './RammevedtakFaktaForm';
import FormValues from '../types/FormValues';
import BegrunnBekreftTilbakestillSeksjon from './BegrunnBekreftTilbakestillSeksjon';
import Seksjon from './Seksjon';
import OmsorgsdagerGrunnlagDto from '../dto/OmsorgsdagerGrunnlagDto';

describe('<RammevedtakFaktaFormImpl>', () => {
  const omsorgsdagerGrunnlag: OmsorgsdagerGrunnlagDto = {
    aleneOmOmsorgen: [],
    barn: [],
    barnLagtTilAvSakbehandler: [],
    fordelingFår: [],
    fordelingGir: [],
    koronaoverføringFår: [],
    koronaoverføringGir: [],
    overføringFår: [],
    overføringGir: [],
    uidentifiserteRammevedtak: [],
    utvidetRett: [],
  };
  const formValues: FormValues = {
    barn: [],
    barnLagtTilAvSaksbehandler: [],
    begrunnelse: '',
    fordelingFår: [],
    fordelingGir: [],
    koronaoverføringFår: [],
    koronaoverføringGir: [],
    overføringFår: [],
    overføringGir: [],
  };

  it('rendrer barn, overføringer og midlertidig aleneansvar-seksjoner', () => {
    const wrapper = shallowWithIntl(
      <RammevedtakFaktaFormImpl
        {...reduxFormPropsMock}
        formValues={formValues}
        omsorgsdagerGrunnlag={omsorgsdagerGrunnlag}
      />,
    );

    expect(wrapper.find(Seksjon)).to.have.length(3);
  });

  it('rendrer begrunnelsefelt hvis man har redigert noe', () => {
    const uredigert = { ...reduxFormPropsMock, pristine: true };
    const wrapperUredigert = shallowWithIntl(
      <RammevedtakFaktaFormImpl {...uredigert} formValues={formValues} omsorgsdagerGrunnlag={omsorgsdagerGrunnlag} />,
    );
    expect(wrapperUredigert.find(BegrunnBekreftTilbakestillSeksjon)).to.have.length(0);

    const redigert = { ...reduxFormPropsMock, pristine: false };
    const wrapperRedigert = shallowWithIntl(
      <RammevedtakFaktaFormImpl {...redigert} formValues={formValues} omsorgsdagerGrunnlag={omsorgsdagerGrunnlag} />,
    );
    expect(wrapperRedigert.find(BegrunnBekreftTilbakestillSeksjon)).to.have.length(1);
  });
});
