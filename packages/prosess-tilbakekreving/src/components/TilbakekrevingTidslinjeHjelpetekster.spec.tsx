import React from 'react';
import { LegendBox } from '@fpsak-frontend/tidslinje';
import TilbakekrevingTidslinjeHjelpetekster from './TilbakekrevingTidslinjeHjelpetekster';
import shallowWithIntl, { intlMock } from '../../i18n';

describe('<TilbakekrevingTidslinjeHjelpetekster>', () => {
  it('skal rendre komponent korrekt', () => {
    const wrapper = shallowWithIntl(<TilbakekrevingTidslinjeHjelpetekster.WrappedComponent intl={intlMock} />);

    expect(wrapper.find(LegendBox)).toHaveLength(1);
  });
});
