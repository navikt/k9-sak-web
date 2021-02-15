import React from 'react';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { LegendBox } from '@fpsak-frontend/tidslinje';
import TilbakekrevingTidslinjeHjelpetekster from './TilbakekrevingTidslinjeHjelpetekster';
import shallowWithIntl from '../../i18n';

describe('<TilbakekrevingTidslinjeHjelpetekster>', () => {
  it('skal rendre komponent korrekt', () => {
    const wrapper = shallowWithIntl(<TilbakekrevingTidslinjeHjelpetekster.WrappedComponent intl={intlMock} />);

    expect(wrapper.find(LegendBox)).toHaveLength(1);
  });
});
