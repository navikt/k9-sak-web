import sinon from 'sinon';
import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme/build';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { SelectField } from '@fpsak-frontend/form';
import { BrevPanel } from './BrevPanel';
import { VedtakPreviewLink } from '../PreviewLink';
import FritekstBrevPanel from '../FritekstBrevPanel';
import InformasjonsbehovAutomatiskVedtaksbrev from './InformasjonsbehovAutomatiskVedtaksbrev';

describe('<BrevPanel>', () => {
  it('skal forhåndsvise brev når ingen behandlingsresultat', () => {
    const wrapper = shallow(
      <BrevPanel
        intl={intlMock}
        readOnly={false}
        sprakkode={{ kode: 'NB' }}
        beregningErManueltFastsatt={false}
        dokumentdata={{}}
        tilgjengeligeVedtaksbrev={['AUTOMATISK']}
        skalBrukeOverstyrendeFritekstBrev={false}
        begrunnelse=""
        previewCallback={sinon.spy()}
        redusertUtbetalingÅrsaker={[]}
        brødtekst={null}
        overskrift={null}
        behandlingResultat={null}
        overstyrtMottaker={null}
        formProps={reduxFormPropsMock}
      />,
    );

    expect(wrapper.find(InformasjonsbehovAutomatiskVedtaksbrev)).to.have.length(1);
    expect(wrapper.find(VedtakPreviewLink)).to.have.length(1);
    expect(wrapper.find(FritekstBrevPanel)).to.have.length(0);
  });

  it('skal vise fritekstpanel når overstyrt', () => {
    const wrapper = shallow(
      <BrevPanel
        intl={intlMock}
        readOnly={false}
        sprakkode={{ kode: 'NB' }}
        beregningErManueltFastsatt={false}
        dokumentdata={{}}
        tilgjengeligeVedtaksbrev={['AUTOMATISK', 'FRITEKST']}
        skalBrukeOverstyrendeFritekstBrev
        begrunnelse=""
        previewCallback={sinon.spy()}
        redusertUtbetalingÅrsaker={[]}
        brødtekst={null}
        overskrift={null}
        behandlingResultat={null}
        overstyrtMottaker={null}
        formProps={reduxFormPropsMock}
      />,
    );

    expect(wrapper.find(FritekstBrevPanel)).to.have.length(1);
    expect(wrapper.find(VedtakPreviewLink)).to.have.length(1);
    expect(wrapper.find(InformasjonsbehovAutomatiskVedtaksbrev)).to.have.length(0);
  });

  it('skal vise fritekstpanel selv om ikke overstyrt når fritekst er eneste typen', () => {
    const wrapper = shallow(
      <BrevPanel
        intl={intlMock}
        readOnly={false}
        sprakkode={{ kode: 'NB' }}
        beregningErManueltFastsatt={false}
        dokumentdata={{}}
        tilgjengeligeVedtaksbrev={['FRITEKST']}
        skalBrukeOverstyrendeFritekstBrev={false}
        begrunnelse=""
        previewCallback={sinon.spy()}
        redusertUtbetalingÅrsaker={[]}
        brødtekst={null}
        overskrift={null}
        behandlingResultat={null}
        overstyrtMottaker={null}
        formProps={reduxFormPropsMock}
      />,
    );

    expect(wrapper.find(FritekstBrevPanel)).to.have.length(1);
    expect(wrapper.find(VedtakPreviewLink)).to.have.length(1);
    expect(wrapper.find(InformasjonsbehovAutomatiskVedtaksbrev)).to.have.length(0);
  });

  it('skal vise varsel om ingen brev når ingen brev', () => {
    const wrapper = shallow(
      <BrevPanel
        intl={intlMock}
        readOnly={false}
        sprakkode={{ kode: 'NB' }}
        beregningErManueltFastsatt={false}
        dokumentdata={{}}
        tilgjengeligeVedtaksbrev={[]}
        skalBrukeOverstyrendeFritekstBrev={false}
        begrunnelse=""
        previewCallback={sinon.spy()}
        redusertUtbetalingÅrsaker={[]}
        brødtekst={null}
        overskrift={null}
        behandlingResultat={null}
        overstyrtMottaker={null}
        formProps={reduxFormPropsMock}
      />,
    );
    expect(wrapper.find(InformasjonsbehovAutomatiskVedtaksbrev)).to.have.length(0);
    expect(wrapper.find(VedtakPreviewLink)).to.have.length(0);
    expect(wrapper.find(FritekstBrevPanel)).to.have.length(0);
    expect(wrapper.find(AlertStripeInfo)).to.have.length(1);
  });

  it('skal vise valg av mottaker hvis alternative mottakere er definert', () => {
    const wrapper = shallow(
      <BrevPanel
        intl={intlMock}
        readOnly={false}
        sprakkode={{ kode: 'NB' }}
        beregningErManueltFastsatt={false}
        dokumentdata={{}}
        tilgjengeligeVedtaksbrev={{
          vedtaksbrev: ['AUTOMATISK', 'FRITEKST'],
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
        skalBrukeOverstyrendeFritekstBrev={false}
        begrunnelse=""
        previewCallback={sinon.spy()}
        redusertUtbetalingÅrsaker={[]}
        brødtekst={null}
        overskrift={null}
        behandlingResultat={null}
        overstyrtMottaker={null}
        formProps={reduxFormPropsMock}
      />,
    );

    expect(wrapper.find(SelectField)).to.have.length(1);
    expect(wrapper.find(VedtakPreviewLink)).to.have.length(1);
    expect(wrapper.find(FritekstBrevPanel)).to.have.length(0);
  });
});
