import klageVurdering from '@fpsak-frontend/kodeverk/src/klageVurdering';
import { renderWithIntl } from '@fpsak-frontend/utils-test';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { screen } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import { isMedholdIKlage, VedtakKlageSubmitPanelImpl } from './VedtakKlageSubmitPanel';

describe('<VedtakKlageSubmitPanel>', () => {
  const forhandsvisVedtaksbrevFunc = sinon.spy();

  it('skal returnere false om behandling ikke har medhold i klage', () => {
    const klageVurderingResultatNK = {
      klageVurdering: 'TEST',
    };

    const isNotMedhold = isMedholdIKlage({}, klageVurderingResultatNK);

    expect(isNotMedhold).to.eql(false);
  });

  it('skal rendre submit panel uten medhold i klagevurdering', () => {
    const klageVurderingResultatNK = {
      klageVurdering: 'TEST',
    };

    renderWithIntl(
      <VedtakKlageSubmitPanelImpl
        intl={intlMock}
        formProps={reduxFormPropsMock}
        readOnly={false}
        behandlingPaaVent={false}
        klageVurderingResultatNK={klageVurderingResultatNK}
        previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Til godkjenning' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Forhåndsvis vedtaksbrev' })).toBeInTheDocument();
  });

  it('skal rendre submit panel med medhold i klagevurdering', () => {
    const klageVurderingResultatNK = {
      klageVurdering: klageVurdering.MEDHOLD_I_KLAGE,
    };

    renderWithIntl(
      <VedtakKlageSubmitPanelImpl
        intl={intlMock}
        formProps={reduxFormPropsMock}
        readOnly={false}
        behandlingPaaVent={false}
        klageVurderingResultatNK={klageVurderingResultatNK}
        previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Til godkjenning' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Forhåndsvis vedtaksbrev' })).toBeInTheDocument();
  });

  it('skal rendre submit panel med behandling på vent', () => {
    renderWithIntl(
      <VedtakKlageSubmitPanelImpl
        intl={intlMock}
        formProps={reduxFormPropsMock}
        readOnly={false}
        behandlingPaaVent
        previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Til godkjenning' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Til godkjenning' })).toBeDisabled();
    expect(screen.getByRole('link', { name: 'Forhåndsvis vedtaksbrev' })).toBeInTheDocument();
  });
});
