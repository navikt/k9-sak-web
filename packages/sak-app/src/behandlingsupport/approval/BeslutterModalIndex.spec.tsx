import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { FatterVedtakApprovalModalSakIndex } from '@fpsak-frontend/sak-totrinnskontroll';

import { requestApi, FpsakApiKeys } from '../../data/fpsakApi';
import BeslutterModalIndex from './BeslutterModalIndex';

describe('<BeslutterModalIndex>', () => {
  it('skal vise modal når beslutter godkjenner', () => {
    requestApi.mock(FpsakApiKeys.HAR_REVURDERING_SAMME_RESULTAT, {
      harRevurderingSammeResultat: true,
    });

    const wrapper = shallow(
      <BeslutterModalIndex
        selectedBehandlingVersjon={1}
        fagsakYtelseType={{
          kode: fagsakYtelseType.FORELDREPENGER,
          kodeverk: '',
        }}
        behandlingsresultat={{}}
        behandlingId={1}
        behandlingTypeKode={behandlingType.FORSTEGANGSSOKNAD}
        pushLocation={sinon.spy()}
        allAksjonspunktApproved={false}
        behandlingStatus={{
          kode: behandlingStatus.OPPRETTET,
          kodeverk: '',
        }}
        totrinnsKlageVurdering={{}}
      />,
    );

    const modal = wrapper.find(FatterVedtakApprovalModalSakIndex);
    expect(modal).to.have.length(1);
    expect(modal.prop('harSammeResultatSomOriginalBehandling')).is.true;
  });

  it('skal vise modal men ikke hente data når en ikke har url', () => {
    requestApi.mock(FpsakApiKeys.HAR_REVURDERING_SAMME_RESULTAT, {
      harRevurderingSammeResultat: true,
    });
    requestApi.setMissingPath(FpsakApiKeys.HAR_REVURDERING_SAMME_RESULTAT);

    const wrapper = shallow(
      <BeslutterModalIndex
        selectedBehandlingVersjon={1}
        fagsakYtelseType={{
          kode: fagsakYtelseType.FORELDREPENGER,
          kodeverk: '',
        }}
        behandlingsresultat={{}}
        behandlingId={1}
        behandlingTypeKode={behandlingType.FORSTEGANGSSOKNAD}
        pushLocation={sinon.spy()}
        allAksjonspunktApproved={false}
        behandlingStatus={{
          kode: behandlingStatus.OPPRETTET,
          kodeverk: '',
        }}
        totrinnsKlageVurdering={{}}
      />,
    );

    const modal = wrapper.find(FatterVedtakApprovalModalSakIndex);
    expect(modal).to.have.length(1);
    expect(modal.prop('harSammeResultatSomOriginalBehandling')).is.false;
  });
});
