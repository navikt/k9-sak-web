import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { act, screen } from '@testing-library/react';

import { MemoryRouter } from 'react-router';
import messages from '../../i18n/nb_NO.json';
import FritekstBrevPanel from './FritekstBrevPanel';

describe('<FritekstBrevPanel>', () => {
  beforeEach(() => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, [{ key: 'FRITEKST_REDIGERING', value: true }]);
  });

  const eventCallback = vi.fn();

  it('skal vise manuelt fritekstbrev i read only', async () => {
    const alleTilgjengeligeVedtaksbrev = {
      vedtaksbrevmaler: {
        [vedtaksbrevtype.MANUELL]: dokumentMalType.MANUELL,
        [vedtaksbrevtype.AUTOMATISK]: dokumentMalType.INNVILGELSE,
      },
      maler: [{ dokumentMalType: dokumentMalType.MANUELL, redigerbarMalType: 'test' }],
      begrunnelse: '',
      alternativeMottakere: [],
    };

    await act(() => {
      renderWithIntl(
        <MemoryRouter>
          <FritekstBrevPanel
            previewBrev={eventCallback}
            readOnly
            harAutomatiskVedtaksbrev
            formikProps={{
              values: { skalBrukeOverstyrendeFritekstBrev: true },
              setFieldValue: vi.fn(),
              validateForm: vi.fn(),
              setTouched: vi.fn(),
            }}
            tilgjengeligeVedtaksbrev={alleTilgjengeligeVedtaksbrev}
            lagreDokumentdata={vi.fn()}
            kanInkludereKalender={false}
            dokumentdata={{}}
            dokumentdataInformasjonsbehov={[]}
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
    const alleTilgjengeligeVedtaksbrev = {
      vedtaksbrevmaler: {
        [vedtaksbrevtype.MANUELL]: dokumentMalType.MANUELL,
        [vedtaksbrevtype.AUTOMATISK]: dokumentMalType.INNVILGELSE,
      },
      maler: [{ dokumentMalType: dokumentMalType.MANUELL, redigerbarMalType: 'test' }],
      begrunnelse: '',
      alternativeMottakere: [],
    };

    await act(() => {
      renderWithIntl(
        <MemoryRouter>
          <FritekstBrevPanel
            previewBrev={eventCallback}
            readOnly={false}
            harAutomatiskVedtaksbrev
            formikProps={{
              values: { skalBrukeOverstyrendeFritekstBrev: true },
              setFieldValue: vi.fn(),
              validateForm: vi.fn(),
              setTouched: vi.fn(),
            }}
            tilgjengeligeVedtaksbrev={alleTilgjengeligeVedtaksbrev}
            lagreDokumentdata={vi.fn()}
            kanInkludereKalender={false}
            dokumentdata={{}}
            dokumentdataInformasjonsbehov={[]}
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
    const alleTilgjengeligeVedtaksbrev = {
      vedtaksbrevmaler: {
        [vedtaksbrevtype.MANUELL]: dokumentMalType.MANUELL,
      },
      maler: [{ dokumentMalType: dokumentMalType.MANUELL, redigerbarMalType: 'test' }],
      begrunnelse: '',
      alternativeMottakere: [],
    };

    await act(() => {
      renderWithIntl(
        <MemoryRouter>
          <FritekstBrevPanel
            previewBrev={eventCallback}
            readOnly={false}
            harAutomatiskVedtaksbrev={false}
            formikProps={{
              values: { skalBrukeOverstyrendeFritekstBrev: true },
              setFieldValue: vi.fn(),
              validateForm: vi.fn(),
              setTouched: vi.fn(),
            }}
            tilgjengeligeVedtaksbrev={alleTilgjengeligeVedtaksbrev}
            lagreDokumentdata={vi.fn()}
            kanInkludereKalender={false}
            dokumentdata={{}}
            dokumentdataInformasjonsbehov={[]}
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
