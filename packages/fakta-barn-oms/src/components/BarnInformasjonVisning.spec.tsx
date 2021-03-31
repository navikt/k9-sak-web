import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import KombinertBarnOgRammevedtak from '../dto/KombinertBarnOgRammevedtak';
import BarnInformasjonVisning from './BarnInformasjonVisning';

it('<BarnInformasjonVisning> med rett info', () => {
  const barn: KombinertBarnOgRammevedtak = {
    personIdent: '',
    barnRelevantIBehandling: {
      personIdent: '12312312312',
      fødselsdato: '2014-08-31',
      dødsdato: null,
      harSammeBosted: true,
      barnType: BarnType.FOSTERBARN,
    },
  };

  const wrapper = shallow(<BarnInformasjonVisning barnet={barn} />);

  const elementerMedFormatterTekstId = tekstId =>
    wrapper.find(FormattedMessage).filterWhere(formatert => formatert.prop('id') === tekstId);

  const sammaBosted = elementerMedFormatterTekstId('FaktaBarn.BorMedSøker');
  const fosterBarn = elementerMedFormatterTekstId('FaktaBarn.Fosterbarn');
  const utenlandskBarn = elementerMedFormatterTekstId('FaktaBarn.UtenlandskBarn');

  expect(sammaBosted).toHaveLength(1);
  expect(fosterBarn).toHaveLength(1);
  expect(utenlandskBarn).toHaveLength(0);
});
