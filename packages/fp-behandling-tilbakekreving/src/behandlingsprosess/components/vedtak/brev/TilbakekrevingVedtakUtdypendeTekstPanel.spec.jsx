import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl, intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { Image } from '@fpsak-frontend/shared-components';
import { TextAreaField } from '@fpsak-frontend/form';

import { TilbakekrevingVedtakUtdypendeTekstPanel } from './TilbakekrevingVedtakUtdypendeTekstPanel';

describe('<TilbakekrevingVedtakUtdypendeTekstPanel>', () => {
  it('skal vise lenke for å skrive inn tekst når felt ikke har verdi og en ikke er i readonly-modus', () => {
    const wrapper = shallowWithIntl(<TilbakekrevingVedtakUtdypendeTekstPanel
      intl={intlMock}
      isEmpty
      type="OPPSUMMERING"
      readOnly={false}
    />);

    expect(wrapper.find(Image)).to.have.length(1);
    expect(wrapper.find(TextAreaField)).to.have.length(0);
  });

  it('skal vise textarea når en har trykket på lenke', () => {
    const wrapper = shallowWithIntl(<TilbakekrevingVedtakUtdypendeTekstPanel
      intl={intlMock}
      isEmpty={false}
      type="OPPSUMMERING"
      readOnly={false}
    />);

    expect(wrapper.find(Image)).to.have.length(0);
    expect(wrapper.find(TextAreaField)).to.have.length(1);
  });

  it('skal ikke vise lenke eller textarea når verdi ikke finnes og en er i readonly-modus', () => {
    const wrapper = shallowWithIntl(<TilbakekrevingVedtakUtdypendeTekstPanel
      intl={intlMock}
      isEmpty
      type="OPPSUMMERING"
      readOnly
    />);

    expect(wrapper.find(Image)).to.have.length(0);
    expect(wrapper.find(TextAreaField)).to.have.length(0);
  });
});
