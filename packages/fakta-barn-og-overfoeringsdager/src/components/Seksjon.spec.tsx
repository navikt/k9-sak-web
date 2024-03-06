import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import Seksjon from './Seksjon';

it('rendrer tittel og children', () => {
  const testId = 'test';
  const content = <div id={testId} />;
  const titleId = 'titleId';
  renderWithIntl(
    <Seksjon imgSrc={null} title={{ id: titleId }} bakgrunn="hvit">
      {content}
    </Seksjon>,
    { messages },
  );

  expect(screen.getByText(titleId)).toBeInTheDocument();
});
