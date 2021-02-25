import * as React from 'react';
import { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import { FormattedMessage } from 'react-intl';
import { shallowWithIntl } from '../../i18n';
import BarnInfo from './BarnInfo';

describe('<BarnInfo>', () => {
  it('viser om barnet ikke bor med søker, men ikke om barnet er fosterbarn, dødt eller utenlandsk dersom det ikke er det', () => {
    const wrapper = shallowWithIntl(
      <BarnInfo
        barnet={{
          harSammeBosted: false,
          personIdent: '123',
          barnType: BarnType.VANLIG,
        }}
        barnnummer={1}
      />,
    );

    const elementMedTekstId = tekstId =>
      wrapper.find(FormattedMessage).filterWhere(message => message.prop('id') === tekstId);

    expect(elementMedTekstId('FaktaBarn.BorIkkeMedSøker')).toHaveLength(1);
    expect(elementMedTekstId('FaktaBarn.Død')).toHaveLength(0);
    expect(elementMedTekstId('FaktaBarn.Fosterbarn')).toHaveLength(0);
    expect(elementMedTekstId('FaktaBarn.UtenlandskBarn')).toHaveLength(0);
  });

  it('viser om barnet bor med søker, er fosterbarn, dødt eller utenlandsk', () => {
    const wrapper = shallowWithIntl(
      <BarnInfo
        barnet={{
          harSammeBosted: true,
          personIdent: '123',
          barnType: BarnType.FOSTERBARN,
          dødsdato: '2020-06-05',
        }}
        barnnummer={1}
      />,
    );

    const htmlElementMedTekstId = tekstId =>
      wrapper.find(FormattedMessage).filterWhere(message => message.prop('id') === tekstId);

    const elementMedTekstId = tekstId =>
      wrapper.find(FormattedMessage).filterWhere(message => message.prop('id') === tekstId);

    expect(htmlElementMedTekstId('FaktaBarn.BorMedSøker')).toHaveLength(1);
    expect(elementMedTekstId('FaktaBarn.Død')).toHaveLength(1);
    expect(elementMedTekstId('FaktaBarn.Fosterbarn')).toHaveLength(1);
  });
});
