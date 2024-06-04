import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import React from 'react';
import Periodpicker from './Periodpicker';

describe('<Periodpicker>', () => {
  it('skal vise periodefelt med angitt periode', () => {
    const { container } = renderWithIntl(
      <Periodpicker
        names={['fromDate', 'toDate']}
        // @ts-ignore
        fromDate={{ input: { value: '30.08.2017' } }}
        toDate={{ input: { value: '31.10.2017' } }}
      />,
    );

    expect(container.getElementsByClassName('navds-date__field-input').length).toBe(2);
  });
});
