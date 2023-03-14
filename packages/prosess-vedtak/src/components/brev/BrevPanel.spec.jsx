import sinon from 'sinon';
import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme/build';
import { Alert } from '@navikt/ds-react';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import SelectFieldFormik from '@fpsak-frontend/form/src/SelectFieldFormik';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';

import { BrevPanel } from './BrevPanel';
import { VedtakPreviewLink } from '../PreviewLink';
import FritekstBrevPanel from '../FritekstBrevPanel';
import InformasjonsbehovAutomatiskVedtaksbrev from './InformasjonsbehovAutomatiskVedtaksbrev';

import { intlMock } from '../../../i18n/index';

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

  it('skal forhåndsvise brev når ingen behandlingsresultat', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const wrapper = shallow(
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
        previewCallback={sinon.spy()}
        redusertUtbetalingÅrsaker={[]}
        brødtekst={null}
        overskrift={null}
        behandlingResultat={null}
        overstyrtMottaker={null}
        formikProps={{ values: [] }}
        getPreviewAutomatiskBrevCallback={() => () => {}}
      />,
    );

    expect(wrapper.find(InformasjonsbehovAutomatiskVedtaksbrev)).to.have.length(1);
    expect(wrapper.find(VedtakPreviewLink)).to.have.length(1);
    expect(wrapper.find(FritekstBrevPanel)).to.have.length(0);
  });

  it('skal vise fritekstpanel når overstyrt', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const wrapper = shallow(
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
        previewCallback={sinon.spy()}
        redusertUtbetalingÅrsaker={[]}
        brødtekst={null}
        overskrift={null}
        behandlingResultat={null}
        overstyrtMottaker={null}
        formikProps={{ values: [] }}
        getPreviewAutomatiskBrevCallback={() => () => {}}
      />,
    );

    expect(wrapper.find(FritekstBrevPanel)).to.have.length(1);
    expect(wrapper.find(VedtakPreviewLink)).to.have.length(1);
    expect(wrapper.find(InformasjonsbehovAutomatiskVedtaksbrev)).to.have.length(0);
  });

  it('skal vise fritekstpanel selv om ikke overstyrt når fritekst er eneste typen', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const wrapper = shallow(
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
        previewCallback={sinon.spy()}
        redusertUtbetalingÅrsaker={[]}
        brødtekst={null}
        overskrift={null}
        behandlingResultat={null}
        overstyrtMottaker={null}
        formikProps={{ values: [] }}
        getPreviewAutomatiskBrevCallback={() => () => {}}
      />,
    );

    expect(wrapper.find(FritekstBrevPanel)).to.have.length(1);
    expect(wrapper.find(VedtakPreviewLink)).to.have.length(1);
    expect(wrapper.find(InformasjonsbehovAutomatiskVedtaksbrev)).to.have.length(0);
  });

  it('skal vise varsel om ingen brev når ingen brev', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const wrapper = shallow(
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
        previewCallback={sinon.spy()}
        redusertUtbetalingÅrsaker={[]}
        brødtekst={null}
        overskrift={null}
        behandlingResultat={null}
        overstyrtMottaker={null}
        formikProps={{ values: [] }}
        getPreviewAutomatiskBrevCallback={() => () => {}}
      />,
    );
    expect(wrapper.find(InformasjonsbehovAutomatiskVedtaksbrev)).to.have.length(0);
    expect(wrapper.find(VedtakPreviewLink)).to.have.length(0);
    expect(wrapper.find(FritekstBrevPanel)).to.have.length(0);
    expect(wrapper.find(Alert)).to.have.length(1);
  });

  it('skal vise valg av mottaker hvis alternative mottakere er definert', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const wrapper = shallow(
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
        previewCallback={sinon.spy()}
        redusertUtbetalingÅrsaker={[]}
        brødtekst={null}
        overskrift={null}
        behandlingResultat={null}
        overstyrtMottaker={null}
        formikProps={{ values: [] }}
        getPreviewAutomatiskBrevCallback={() => () => {}}
      />,
    );

    expect(wrapper.find(SelectFieldFormik)).to.have.length(1);
    expect(wrapper.find(VedtakPreviewLink)).to.have.length(1);
    expect(wrapper.find(FritekstBrevPanel)).to.have.length(0);
  });
});
