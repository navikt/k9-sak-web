import React from 'react';
import { FormattedMessage } from 'react-intl';
import { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import { shallowWithIntl } from '../i18n';
import FaktaBarnIndex from './FaktaBarnIndex';
import VanligeBarn from './components/VanligeBarn';
import BarnFraRammevedtak from './components/BarnFraRammevedtak';
import MidlertidigAlene from './components/MidlertidigAlene';

describe('<FaktaBarnIndex>', () => {
  it('hvis ingen barn, rendres info om dette', () => {
    const wrapper = shallowWithIntl(<FaktaBarnIndex barn={[]} rammevedtak={[]} />);

    expect(wrapper.find(FormattedMessage).prop('id')).toEqual('FaktaBarn.IngenBarn');
  });

  it('viser vanlige barn og rammevedtaksbarn', () => {
    const wrapper = shallowWithIntl(
      <FaktaBarnIndex
        barn={[
          {
            personIdent: '123',
            barnType: BarnType.VANLIG,
            harSammeBosted: true,
          },
          {
            personIdent: '456',
            barnType: BarnType.UTENLANDSK_BARN,
            harSammeBosted: false,
          },
        ]}
        rammevedtak={[
          {
            type: 'Fosterbarn',
            vedtatt: '2021-03-17',
            lengde: 'PT0S',
            gyldigFraOgMed: '2021-03-17',
            gyldigTilOgMed: '2033-12-31',
            mottaker: '150915',
          },
          {
            type: 'UtvidetRett',
            vedtatt: '2021-03-17',
            lengde: 'PT0S',
            gyldigFraOgMed: '2021-03-17',
            gyldigTilOgMed: '2033-12-31',
            utvidetRettFor: '150915 #2',
          },
        ]}
      />,
    );

    expect(wrapper.find(VanligeBarn)).toHaveLength(1);
    expect(wrapper.find(BarnFraRammevedtak)).toHaveLength(1);
    expect(wrapper.find(MidlertidigAlene)).toHaveLength(1);
  });
});
