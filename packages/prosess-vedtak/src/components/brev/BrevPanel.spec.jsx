import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { screen } from '@testing-library/react';

import { Formik } from 'formik';
import React from 'react';
import { intlMock } from '../../../i18n/index';
import messages from '../../../i18n/nb_NO.json';
import { BrevPanel } from './BrevPanel';

describe('<BrevPanel>', () => {
  const ingenTilgjengeligeVedtaksbrev = { vedtaksbrevmaler: [] };
  const alleTilgjengeligeVedtaksbrev = {
    vedtaksbrevmaler: {
      [vedtaksbrevtype.AUTOMATISK]: dokumentMalType.INNVILGELSE,
      [vedtaksbrevtype.FRITEKST]: dokumentMalType.FRITKS,
    },
  };
  const automatiskInnvilgelsebrevTilgjengelig = {
    vedtaksbrevmaler: { [vedtaksbrevtype.AUTOMATISK]: dokumentMalType.INNVILGELSE },
  };
  const fritekstbrevTilgjenglig = { vedtaksbrevmaler: { [vedtaksbrevtype.FRITEKST]: dokumentMalType.FRITKS } };

  it('skal forhåndsvise brev når ingen behandlingsresultat', async () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);

    renderWithIntl(
      <Formik initialValues={[]}>
        <BrevPanel
          intl={intlMock}
          readOnly={false}
          sprakkode={{ kode: 'NB' }}
          beregningErManueltFastsatt={false}
          dokumentdata={{}}
          tilgjengeligeVedtaksbrev={automatiskInnvilgelsebrevTilgjengelig}
          informasjonsbehovValues={[]}
          skalBrukeOverstyrendeFritekstBrev={false}
          begrunnelse=""
          previewCallback={vi.fn()}
          redusertUtbetalingÅrsaker={[]}
          brødtekst={null}
          overskrift={null}
          behandlingResultat={null}
          overstyrtMottaker={null}
          formikProps={{ values: [] }}
          getPreviewAutomatiskBrevCallback={() => () => {}}
        />
      </Formik>,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Forhåndsvis brev' })).toBeInTheDocument();
  });

  it('skal vise fritekstpanel når overstyrt', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    renderWithIntl(
      <Formik initialValues={[]}>
        <BrevPanel
          intl={intlMock}
          readOnly={false}
          sprakkode={{ kode: 'NB' }}
          beregningErManueltFastsatt={false}
          dokumentdata={{}}
          tilgjengeligeVedtaksbrev={alleTilgjengeligeVedtaksbrev}
          informasjonsbehovValues={[]}
          skalBrukeOverstyrendeFritekstBrev
          begrunnelse=""
          previewCallback={vi.fn()}
          redusertUtbetalingÅrsaker={[]}
          brødtekst={null}
          overskrift={null}
          behandlingResultat={null}
          overstyrtMottaker={null}
          formikProps={{ values: [] }}
          getPreviewAutomatiskBrevCallback={() => () => {}}
        />
      </Formik>,
      { messages },
    );
    expect(screen.getByRole('button', { name: 'Forhåndsvis brev' })).toBeInTheDocument();
    expect(screen.getByText('Innhold fra det automatiske brevet kan nå redigeres')).toBeInTheDocument();
  });

  it('skal vise fritekstpanel selv om ikke overstyrt når fritekst er eneste typen', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    renderWithIntl(
      <Formik initialValues={[]}>
        <BrevPanel
          intl={intlMock}
          readOnly={false}
          sprakkode={{ kode: 'NB' }}
          beregningErManueltFastsatt={false}
          dokumentdata={{}}
          tilgjengeligeVedtaksbrev={fritekstbrevTilgjenglig}
          informasjonsbehovValues={[]}
          skalBrukeOverstyrendeFritekstBrev={false}
          begrunnelse=""
          previewCallback={vi.fn()}
          redusertUtbetalingÅrsaker={[]}
          brødtekst={null}
          overskrift={null}
          behandlingResultat={null}
          overstyrtMottaker={null}
          formikProps={{ values: [] }}
          getPreviewAutomatiskBrevCallback={() => () => {}}
        />
      </Formik>,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Forhåndsvis brev' })).toBeInTheDocument();
    expect(
      screen.getByText('Denne type behandling er det ikke utviklet automatisk brev for enda.'),
    ).toBeInTheDocument();
  });

  it('skal vise varsel om ingen brev når ingen brev', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    renderWithIntl(
      <Formik initialValues={[]}>
        <BrevPanel
          intl={intlMock}
          readOnly={false}
          sprakkode={{ kode: 'NB' }}
          beregningErManueltFastsatt={false}
          dokumentdata={{}}
          tilgjengeligeVedtaksbrev={ingenTilgjengeligeVedtaksbrev}
          informasjonsbehovValues={[]}
          skalBrukeOverstyrendeFritekstBrev={false}
          begrunnelse=""
          previewCallback={vi.fn()}
          redusertUtbetalingÅrsaker={[]}
          brødtekst={null}
          overskrift={null}
          behandlingResultat={null}
          overstyrtMottaker={null}
          formikProps={{ values: [] }}
          getPreviewAutomatiskBrevCallback={() => () => {}}
        />
      </Formik>,
      { messages },
    );

    expect(screen.getByText('I denne behandlingen er det ikke vedtaksbrev.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Forhåndsvis brev' })).not.toBeInTheDocument();
  });

  it('skal vise valg av mottaker hvis alternative mottakere er definert', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    renderWithIntl(
      <Formik initialValues={[]}>
        <BrevPanel
          intl={intlMock}
          readOnly={false}
          sprakkode={{ kode: 'NB' }}
          beregningErManueltFastsatt={false}
          dokumentdata={{}}
          tilgjengeligeVedtaksbrev={{
            vedtaksbrevmaler: alleTilgjengeligeVedtaksbrev.vedtaksbrevmaler,
            begrunnelse: null,
            alternativeMottakere: [
              {
                id: '00000000000',
                idType: 'AKTØRID',
              },
              {
                id: '979312059',
                idType: 'ORGNR',
              },
            ],
          }}
          informasjonsbehovValues={[]}
          skalBrukeOverstyrendeFritekstBrev={false}
          begrunnelse=""
          previewCallback={vi.fn()}
          redusertUtbetalingÅrsaker={[]}
          brødtekst={null}
          overskrift={null}
          behandlingResultat={null}
          overstyrtMottaker={null}
          formikProps={{ values: [] }}
          getPreviewAutomatiskBrevCallback={() => () => {}}
        />
      </Formik>,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Forhåndsvis brev' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Velg mottaker' })).toBeInTheDocument();
    expect(screen.queryByText('I denne behandlingen er det ikke vedtaksbrev.')).not.toBeInTheDocument();
    expect(screen.queryByText('Innhold fra det automatiske brevet kan nå redigeres')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Denne type behandling er det ikke utviklet automatisk brev for enda.'),
    ).not.toBeInTheDocument();
  });
});
