import React from 'react';
import { expect } from 'chai';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import Modal from 'nav-frontend-modal';
import { VedtakFritekstbrevModal } from './VedtakFritekstbrevModal';
import shallowWithIntl, { intlMock } from '../../../i18n';

describe('<VedtakFritekstbrevModal>', () => {
  it('skal vise modal når behandlingsresultat er AVSLATT', () => {
    const wrapper = shallowWithIntl(
      <VedtakFritekstbrevModal
        intl={intlMock}
        readOnly={false}
        behandlingsresultat={{
          type: {
            kode: behandlingResultatType.AVSLATT,
          },
        }}
        erSVP
      />,
    );
    const modal = wrapper.find(Modal);
    const isOpen = modal.prop('isOpen');
    expect(modal).to.have.length(1);
    expect(isOpen).to.eql(true);
  });

  it('skal vise modal når behandlingsresultat er OPPHOR', () => {
    const wrapper = shallowWithIntl(
      <VedtakFritekstbrevModal
        intl={intlMock}
        readOnly={false}
        behandlingsresultat={{
          type: {
            kode: behandlingResultatType.OPPHOR,
          },
        }}
        erSVP
      />,
    );
    const modal = wrapper.find(Modal);
    const isOpen = modal.prop('isOpen');
    expect(modal).to.have.length(1);
    expect(isOpen).to.eql(true);
  });

  it('skal ikke vise modal når behandlingsresultat er noe annet en OPPHOR og AVSLATT', () => {
    const wrapper = shallowWithIntl(
      <VedtakFritekstbrevModal
        intl={intlMock}
        readOnly={false}
        behandlingsresultat={{
          type: {
            kode: behandlingResultatType.INNVILGET,
          },
        }}
        erSVP
      />,
    );
    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(0);
  });

  it('skal ikke vise modal når readOnly er true', () => {
    const wrapper = shallowWithIntl(
      <VedtakFritekstbrevModal
        intl={intlMock}
        readOnly
        behandlingsresultat={{
          type: {
            kode: behandlingResultatType.AVSLATT,
          },
        }}
        erSVP
      />,
    );
    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(0);
  });

  it('skal ikke vise modal når ikke SVP', () => {
    const wrapper = shallowWithIntl(
      <VedtakFritekstbrevModal
        intl={intlMock}
        readOnly={false}
        behandlingsresultat={{
          type: {
            kode: behandlingResultatType.AVSLATT,
          },
        }}
        erSVP={false}
      />,
    );
    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(0);
  });
});
