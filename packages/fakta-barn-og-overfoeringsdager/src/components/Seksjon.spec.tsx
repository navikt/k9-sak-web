import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shallowWithIntl } from '../../i18n';
import Seksjon from './Seksjon';

it('rendrer tittel og children', () => {
  const testId = 'test';
  const content = <div id={testId} />;
  const titleId = 'titleId';
  const wrapper = shallowWithIntl(
    <Seksjon imgSrc={null} title={{ id: titleId }} bakgrunn="hvit">
      {content}
    </Seksjon>,
  );

  expect(wrapper.find(FormattedMessage).filterWhere(formatert => formatert.prop('id') === titleId)).toHaveLength(1);
  expect(wrapper.find(`#${testId}`)).toHaveLength(1);
});
