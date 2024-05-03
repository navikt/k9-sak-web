import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { intlMock } from '@k9-sak-web/utils-test/intl-test-helper';
import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../i18n/nb_NO.json';
import StatusForBorgerFaktaPanel from './StatusForBorgerFaktaPanel';

describe('<StatusForBorgerFaktaPanel>', () => {
  it('skal vise radioknapper for vurdering av oppholdsrett', () => {
    renderWithIntlAndReduxForm(
      <StatusForBorgerFaktaPanel.WrappedComponent
        apKode={aksjonspunktCodes.AVKLAR_OPPHOLDSRETT}
        intl={intlMock}
        erEosBorger
        readOnly={false}
        isBorgerAksjonspunktClosed={false}
        alleMerknaderFraBeslutter={{ notAccepted: false }}
      />,
      { messages },
    );

    expect(screen.getAllByRole('radio').length).toBe(4);
    expect(screen.getByRole('radio', { name: 'EØS borger' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Utenlandsk borger utenfor EØS' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Søker har oppholdsrett' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Søker har ikke oppholdsrett' })).toBeInTheDocument();
  });

  it('skal vise radioknapper for vurdering av lovlig opphold', () => {
    renderWithIntlAndReduxForm(
      <StatusForBorgerFaktaPanel.WrappedComponent
        apKode={aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD}
        intl={intlMock}
        erEosBorger={false}
        readOnly={false}
        isBorgerAksjonspunktClosed={false}
        alleMerknaderFraBeslutter={{ notAccepted: false }}
      />,
      { messages },
    );

    expect(screen.getAllByRole('radio').length).toBe(4);
    expect(screen.getByRole('radio', { name: 'EØS borger' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Utenlandsk borger utenfor EØS' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Søker har lovlig opphold' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Søker har ikke lovlig opphold' })).toBeInTheDocument();
  });

  it('skal sette initielle verdi når det er EØS borger og ingen vurdering er lagret', () => {
    const periode = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT],
    };
    const aksjonspunkter = [
      {
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
        },
        status: {
          kode: 'UTFO',
        },
      },
    ];
    const initialValues = StatusForBorgerFaktaPanel.buildInitialValues(periode, aksjonspunkter);

    expect(initialValues).toStrictEqual({
      apKode: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
      erEosBorger: true,
      oppholdsrettVurdering: undefined,
      lovligOppholdVurdering: undefined,
      isBorgerAksjonspunktClosed: true,
    });
  });

  it('skal sette initielle verdi når det er EØS borger og vurdering er lagret', () => {
    const periode = {
      aksjonspunkter: [],
      erEosBorger: true,
      oppholdsrettVurdering: true,
    };

    const aksjonspunkter = [];

    const initialValues = StatusForBorgerFaktaPanel.buildInitialValues(periode, aksjonspunkter);

    expect(initialValues).toStrictEqual({
      apKode: undefined,
      erEosBorger: true,
      oppholdsrettVurdering: true,
      lovligOppholdVurdering: undefined,
      isBorgerAksjonspunktClosed: false,
    });
  });

  it('skal sette initielle verdi når regionkode ikke finnes men en har oppholdsrett-aksjonspunkt', () => {
    const periode = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT],
    };
    const aksjonspunkter = [
      {
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
        },
        status: {
          kode: 'UTFO',
        },
      },
    ];

    const initialValues = StatusForBorgerFaktaPanel.buildInitialValues(periode, aksjonspunkter);

    expect(initialValues).toStrictEqual({
      apKode: aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
      erEosBorger: true,
      oppholdsrettVurdering: undefined,
      lovligOppholdVurdering: undefined,
      isBorgerAksjonspunktClosed: true,
    });
  });

  it('skal sette initielle verdi når det ikke er EØS borger', () => {
    const periode = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT],
      erEosBorger: false,
      lovligOppholdVurdering: false,
    };
    const aksjonspunkter = [];

    const initialValues = StatusForBorgerFaktaPanel.buildInitialValues(periode, aksjonspunkter);

    expect(initialValues).toStrictEqual({
      apKode: undefined,
      erEosBorger: false,
      oppholdsrettVurdering: undefined,
      lovligOppholdVurdering: false,
      isBorgerAksjonspunktClosed: false,
    });
  });
});
