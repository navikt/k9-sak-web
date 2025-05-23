import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import { isMedholdIKlage, VedtakKlageSubmitPanelImpl } from './VedtakKlageSubmitPanel';

describe('<VedtakKlageSubmitPanel>', () => {
  const forhandsvisVedtaksbrevFunc = vi.fn();

  it('skal returnere false om behandling ikke har medhold i klage', () => {
    const klageVurderingResultatNK = {
      klageVurdering: 'TEST',
    };

    const isNotMedhold = isMedholdIKlage({}, klageVurderingResultatNK);

    expect(isNotMedhold).toBe(false);
  });

  it('skal rendre submit panel uten medhold i klagevurdering', () => {
    renderWithIntl(
      <VedtakKlageSubmitPanelImpl
        intl={intlMock}
        formProps={reduxFormPropsMock}
        readOnly={false}
        behandlingPåVent={false}
        previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Til godkjenning' })).toBeInTheDocument();
    expect(screen.getByTestId('previewLink')).toBeInTheDocument();
  });

  it('skal rendre submit panel med medhold i klagevurdering', () => {
    renderWithIntl(
      <VedtakKlageSubmitPanelImpl
        intl={intlMock}
        formProps={reduxFormPropsMock}
        readOnly={false}
        behandlingPåVent={false}
        previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Til godkjenning' })).toBeInTheDocument();
    expect(screen.getByTestId('previewLink')).toBeInTheDocument();
  });

  it('skal rendre submit panel med behandling på vent', () => {
    renderWithIntl(
      <VedtakKlageSubmitPanelImpl
        intl={intlMock}
        formProps={reduxFormPropsMock}
        readOnly={false}
        behandlingPåVent
        previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Til godkjenning' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Til godkjenning' })).toBeDisabled();
    expect(screen.getByTestId('previewLink')).toBeInTheDocument();
  });
});
