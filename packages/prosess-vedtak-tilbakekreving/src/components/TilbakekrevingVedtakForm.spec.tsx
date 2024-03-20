import React from 'react';

import userEvent from '@testing-library/user-event';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';

import { renderWithIntlAndReduxForm, screen } from '@fpsak-frontend/utils-test/test-utils';

// import { FlexColumn } from '@fpsak-frontend/shared-components';
// import TilbakekrevingEditerVedtaksbrevPanel from './brev/TilbakekrevingEditerVedtaksbrevPanel';
import underavsnittType from '../kodeverk/avsnittType';
import { TilbakekrevingVedtakFormImplWithIntl as TilbakekrevingVedtakForm } from './TilbakekrevingVedtakForm';

import messages from '../../i18n/nb_NO.json';

test('<TilbakekrevingVedtakForm> skal vise tekstfelt for begrunnelse og godkjenningsknapp', () => {
  renderWithIntlAndReduxForm(
    <TilbakekrevingVedtakForm
      {...reduxFormPropsMock}
      submitCallback={vi.fn()}
      readOnly={false}
      fetchPreviewVedtaksbrev={vi.fn()}
      formVerdier={{}}
      vedtaksbrevAvsnitt={[
        {
          avsnittstype: 'test',
          overskrift: 'Dette er en overskrift',
          underavsnittsliste: [
            {
              fritekstTillatt: false,
            },
          ],
        },
      ]}
      behandlingId={1}
      behandlingUuid="uuid"
      behandlingVersjon={1}
      perioderSomIkkeHarUtfyltObligatoriskVerdi={[]}
    />,
    { messages },
  );

  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Vedtaksbrev');
  expect(screen.getByText('Til godkjenning')).not.toBeDisabled();
  expect(screen.getByRole('link')).toHaveTextContent('Forhåndsvis brev');
});

test('<TilbakekrevingVedtakForm> skal formatere data for forhåndsvisning av vedtaksbrevet', async () => {
  const fetchPreview = vi.fn();
  renderWithIntlAndReduxForm(
    <TilbakekrevingVedtakForm
      {...reduxFormPropsMock}
      submitCallback={vi.fn()}
      readOnly={false}
      fetchPreviewVedtaksbrev={fetchPreview}
      formVerdier={{
        OPPSUMMERING: 'Dette er oppsummeringen',
        '2019-10-10_2019-11-10': {
          FAKTA: 'dette er faktateksten',
          VILKÅR: 'dette er vilkårteksten',
          SÆRLIGEGRUNNER: 'dette er særligegrunnerteksten',
          SÆRLIGEGRUNNER_ANNET: 'dette er særligegrunnerteksten for annet',
        },
      }}
      vedtaksbrevAvsnitt={[
        {
          avsnittstype: 'test',
          overskrift: 'Dette er en overskrift',
          underavsnittsliste: [
            {
              fritekstTillatt: false,
            },
          ],
        },
      ]}
      behandlingId={2}
      behandlingUuid="uuid"
      behandlingVersjon={1}
      perioderSomIkkeHarUtfyltObligatoriskVerdi={[]}
    />,
    { messages },
  );

  await userEvent.click(screen.getByRole('link'));
  expect(fetchPreview.mock.calls.length).toBe(1);
  expect(fetchPreview.mock.calls[0][0]).toEqual({
    uuid: 'uuid',
    oppsummeringstekst: 'Dette er oppsummeringen',
    perioderMedTekst: [
      {
        fom: '2019-10-10',
        tom: '2019-11-10',
        faktaAvsnitt: 'dette er faktateksten',
        vilkaarAvsnitt: 'dette er vilkårteksten',
        saerligeGrunnerAvsnitt: 'dette er særligegrunnerteksten',
        saerligeGrunnerAnnetAvsnitt: 'dette er særligegrunnerteksten for annet',
      },
    ],
  });
});

test('<TilbakekrevingVedtakForm> skal ikke vise trykkbar godkjenningsknapp og forhåndsvisningslenke når obligatoriske verdier ikke er utfylt', () => {
  renderWithIntlAndReduxForm(
    <TilbakekrevingVedtakForm
      {...reduxFormPropsMock}
      submitCallback={vi.fn()}
      readOnly={false}
      fetchPreviewVedtaksbrev={vi.fn()}
      formVerdier={{}}
      vedtaksbrevAvsnitt={[
        {
          avsnittstype: 'test',
          overskrift: 'Dette er en overskrift',
          underavsnittsliste: [
            {
              fritekstTillatt: false,
            },
          ],
        },
      ]}
      behandlingId={1}
      behandlingUuid="uuid"
      behandlingVersjon={1}
      perioderSomIkkeHarUtfyltObligatoriskVerdi={['2019-01-01_2019-02-02']}
    />,
    { messages },
  );

  expect(screen.getByText('Til godkjenning')).toBeDisabled();
  expect(screen.queryByText('Forhåndsvis brev')).not.toBeInTheDocument();
});

test(`<TilbakekrevingVedtakForm> skal ikke vise trykkbar godkjenningsknapp og forhåndsvisningslenke
  når obligatorisk oppsummering for revurdering tilbakekreving ikke er utfylt`, () => {
  renderWithIntlAndReduxForm(
    <TilbakekrevingVedtakForm
      {...reduxFormPropsMock}
      submitCallback={vi.fn()}
      readOnly={false}
      fetchPreviewVedtaksbrev={vi.fn()}
      formVerdier={{}}
      vedtaksbrevAvsnitt={[
        {
          avsnittstype: 'test',
          overskrift: 'Dette er en overskrift',
          underavsnittsliste: [
            {
              fritekstTillatt: false,
            },
          ],
        },
        {
          avsnittstype: underavsnittType.OPPSUMMERING,
          overskrift: 'Dette er en overskrift',
          underavsnittsliste: [
            {
              fritekstTillatt: false,
            },
          ],
        },
      ]}
      behandlingId={1}
      behandlingUuid="uuid"
      behandlingVersjon={1}
      perioderSomIkkeHarUtfyltObligatoriskVerdi={[]}
      erRevurderingTilbakekrevingKlage
      fritekstOppsummeringPakrevdMenIkkeUtfylt
    />,
    { messages },
  );

  expect(screen.getByText('Til godkjenning')).toBeDisabled();
  expect(screen.getByText('Forhåndsvis brev')).toBeInTheDocument();

  const form = screen.getByRole('form');
  expect(form.querySelectorAll('.flexColumn')).toHaveLength(5);
});
