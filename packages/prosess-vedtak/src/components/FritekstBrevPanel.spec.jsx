import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import { renderWithIntl } from '@fpsak-frontend/utils-test';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { act, screen } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { MemoryRouter } from 'react-router';
import sinon from 'sinon';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import FritekstBrevPanel from './FritekstBrevPanel';

describe('<FritekstBrevPanel>', () => {
  const eventCallback = sinon.spy();

  it('skal vise manuelt fritekstbrev i read only', async () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, [{ FRITEKST_REDIGERING: false }]);

    const alleTilgjengeligeVedtaksbrev = {
      vedtaksbrevmaler: {
        [vedtaksbrevtype.MANUELL]: dokumentMalType.REDIGERTBREV,
        [vedtaksbrevtype.AUTOMATISK]: dokumentMalType.INNVILGELSE,
      },
      maler: [{ dokumentMalType: dokumentMalType.MANUELL, redigerbarMalType: 'test' }],
    };

    await act(() => {
      renderWithIntl(
        <MemoryRouter>
          <FritekstBrevPanel
            intl={intlMock}
            previewBrev={eventCallback}
            readOnly
            harAutomatiskVedtaksbrev
            formikProps={{ values: { skalBrukeOverstyrendeFritekstBrev: true }, setFieldValue: vi.fn() }}
            tilgjengeligeVedtaksbrev={alleTilgjengeligeVedtaksbrev}
            setForhaandsvisningKlart={vi.fn()}
            hentFritekstbrevHtmlCallback={vi.fn()}
          />
        </MemoryRouter>,
        { messages },
      );
    });
    expect(screen.queryByRole('link', { name: 'Forhåndsvis brev' })).not.toBeInTheDocument();
    expect(screen.queryByTestId('harIkkeAutomatiskVedtaksbrev')).not.toBeInTheDocument();
    expect(screen.queryByTestId('harAutomatiskVedtaksbrev')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Rediger brev til søker' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Rediger brev' })).toBeDisabled();
  });

  it('skal vise manuelt fritekstbrev', async () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, [{ FRITEKST_REDIGERING: true }]);

    const alleTilgjengeligeVedtaksbrev = {
      vedtaksbrevmaler: {
        [vedtaksbrevtype.MANUELL]: dokumentMalType.REDIGERTBREV,
        [vedtaksbrevtype.AUTOMATISK]: dokumentMalType.INNVILGELSE,
      },
      maler: [{ dokumentMalType: dokumentMalType.MANUELL, redigerbarMalType: 'test' }],
    };

    await act(() => {
      renderWithIntl(
        <MemoryRouter>
          <FritekstBrevPanel
            intl={intlMock}
            previewBrev={eventCallback}
            readOnly={false}
            harAutomatiskVedtaksbrev
            formikProps={{ values: { skalBrukeOverstyrendeFritekstBrev: true }, setFieldValue: vi.fn() }}
            tilgjengeligeVedtaksbrev={alleTilgjengeligeVedtaksbrev}
            setForhaandsvisningKlart={vi.fn()}
            hentFritekstbrevHtmlCallback={vi.fn()}
          />
        </MemoryRouter>,
        { messages },
      );
    });

    expect(screen.getByRole('heading', { name: 'Rediger brev til søker' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Rediger brev' })).not.toBeDisabled();
    expect(screen.getByTestId('harAutomatiskVedtaksbrev')).toBeInTheDocument();
  });

  it('skal vise manuelt brev uten automatisk vedtaksbrev', async () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, [{ FRITEKST_REDIGERING: true }]);

    const alleTilgjengeligeVedtaksbrev = {
      vedtaksbrevmaler: {
        [vedtaksbrevtype.MANUELL]: dokumentMalType.REDIGERTBREV,
      },
      maler: [{ dokumentMalType: dokumentMalType.MANUELL, redigerbarMalType: 'test' }],
    };

    await act(() => {
      renderWithIntl(
        <MemoryRouter>
          <FritekstBrevPanel
            intl={intlMock}
            previewBrev={eventCallback}
            readOnly={false}
            harAutomatiskVedtaksbrev={false}
            formikProps={{ values: { skalBrukeOverstyrendeFritekstBrev: true }, setFieldValue: vi.fn() }}
            tilgjengeligeVedtaksbrev={alleTilgjengeligeVedtaksbrev}
            setForhaandsvisningKlart={vi.fn()}
            hentFritekstbrevHtmlCallback={vi.fn()}
          />
        </MemoryRouter>,
        { messages },
      );
    });

    expect(screen.getByRole('heading', { name: 'Rediger brev til søker' })).toBeInTheDocument();
    expect(screen.getByTestId('harIkkeAutomatiskVedtaksbrev')).toBeInTheDocument();
    expect(screen.queryByTestId('harAutomatiskVedtaksbrev')).not.toBeInTheDocument();
  });
});
