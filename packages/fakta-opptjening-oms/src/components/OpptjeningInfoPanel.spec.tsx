import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { Aksjonspunkt, Opptjening } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import OpptjeningInfoPanel, { buildInitialValues } from './OpptjeningInfoPanel';

describe('<OpptjeningInfoPanel>', () => {
  it('skal vise opptjeningspanel', () => {
    renderWithIntlAndReduxForm(
      <OpptjeningInfoPanel
        {...reduxFormPropsMock}
        aksjonspunkter={[{ definisjon: { kode: '5058' }, erAktivt: true, toTrinnsBehandling: false }]}
        behandlingId={1}
        behandlingVersjon={1}
        intl={intlMock}
        harApneAksjonspunkter
        readOnly={false}
        fastsattOpptjening={{
          opptjeningFom: '2017-01-01',
          opptjeningTom: '2017-10-01',
        }}
        alleMerknaderFraBeslutter={{}}
        alleKodeverk={{}}
        // initialValues={{ opptjeningList: [] }}
      />,
      { messages },
    );

    expect(screen.getByText('Fant ingen opptjeningsaktiviteter')).toBeInTheDocument();
  });

  it('skal ikke bruke aktiviteter som er utenfor opptjeningperioden', () => {
    const opptjeningAktivitetList = [
      {
        opptjeningFom: '2017-06-01',
        opptjeningTom: '2017-12-31',
        begrunnelse: 'test1',
      },
      {
        opptjeningFom: '2018-10-02',
        opptjeningTom: '2019-06-01',
        begrunnelse: 'test2',
      },
      {
        opptjeningFom: '2017-12-15',
        opptjeningTom: '2018-11-01',
        begrunnelse: 'test3',
      },
      {
        opptjeningFom: '2017-12-15',
        opptjeningTom: '2018-01-01',
        begrunnelse: 'test4',
      },
      {
        opptjeningFom: '2018-10-01',
        opptjeningTom: '2018-12-01',
        begrunnelse: 'test5',
      },
    ];
    const fastsattOpptjening = {
      opptjeningFom: '2018-01-01',
      opptjeningTom: '2018-10-01',
    };
    const aksjonspunkter = [{ definisjon: { kode: '5058' }, erAktivt: true, toTrinnsBehandling: false }];
    const opptjeningList = [{ opptjeningAktivitetList, fastsattOpptjening }];

    const initialValues = buildInitialValues.resultFunc(
      opptjeningList as Partial<Opptjening[]>,
      aksjonspunkter as Partial<Aksjonspunkt[]>,
    );
    expect(initialValues).toStrictEqual({
      aksjonspunkter: [],
      opptjeningList: [
        {
          fastsattOpptjening: {
            opptjeningFom: '2018-01-01',
            opptjeningTom: '2018-10-01',
          },
          opptjeningAktivitetList: [
            {
              opptjeningFom: '2018-01-01',
              opptjeningTom: '2018-10-01',
              begrunnelse: 'test3',
              originalFom: '2017-12-15',
              originalTom: '2018-11-01',
              id: 1,
            },
            {
              opptjeningFom: '2018-01-01',
              opptjeningTom: '2018-01-01',
              begrunnelse: 'test4',
              originalFom: '2017-12-15',
              originalTom: '2018-01-01',
              id: 2,
            },
            {
              opptjeningFom: '2018-10-01',
              opptjeningTom: '2018-10-01',
              begrunnelse: 'test5',
              originalFom: '2018-10-01',
              originalTom: '2018-12-01',
              id: 3,
            },
          ],
        },
      ],
    });
  });
  it('skal ikke bruke aktiviteter som er utenfor opptjeningperioden og vise korrekt aksjonspunkt', () => {
    const opptjeningAktivitetList = [
      {
        opptjeningFom: '2017-06-01',
        opptjeningTom: '2017-12-31',
        begrunnelse: 'test1',
      },
      {
        opptjeningFom: '2018-10-02',
        opptjeningTom: '2019-06-01',
        begrunnelse: 'test2',
      },
      {
        opptjeningFom: '2017-12-15',
        opptjeningTom: '2018-11-01',
        begrunnelse: 'test3',
      },
      {
        opptjeningFom: '2017-12-15',
        opptjeningTom: '2018-01-01',
        begrunnelse: 'test4',
      },
      {
        opptjeningFom: '2018-10-01',
        opptjeningTom: '2018-12-01',
        begrunnelse: 'test5',
      },
    ];
    const fastsattOpptjening = {
      opptjeningFom: '2018-01-01',
      opptjeningTom: '2018-10-01',
    };
    const aksjonspunkter = [
      { definisjon: { kode: '5051' }, erAktivt: true, toTrinnsBehandling: false },
      { definisjon: { kode: '5080' }, erAktivt: true, toTrinnsBehandling: false },
    ];
    const opptjeningList = [{ opptjeningAktivitetList, fastsattOpptjening }];

    const initialValues = buildInitialValues.resultFunc(
      opptjeningList as Partial<Opptjening[]>,
      aksjonspunkter as Partial<Aksjonspunkt[]>,
    );
    expect(initialValues).toStrictEqual({
      aksjonspunkter: [
        {
          definisjon: {
            kode: '5051',
          },
          erAktivt: true,
          toTrinnsBehandling: false,
        },
      ],
      opptjeningList: [
        {
          fastsattOpptjening: {
            opptjeningFom: '2018-01-01',
            opptjeningTom: '2018-10-01',
          },
          opptjeningAktivitetList: [
            {
              opptjeningFom: '2018-01-01',
              opptjeningTom: '2018-10-01',
              begrunnelse: 'test3',
              originalFom: '2017-12-15',
              originalTom: '2018-11-01',
              id: 1,
            },
            {
              opptjeningFom: '2018-01-01',
              opptjeningTom: '2018-01-01',
              begrunnelse: 'test4',
              originalFom: '2017-12-15',
              originalTom: '2018-01-01',
              id: 2,
            },
            {
              opptjeningFom: '2018-10-01',
              opptjeningTom: '2018-10-01',
              begrunnelse: 'test5',
              originalFom: '2018-10-01',
              originalTom: '2018-12-01',
              id: 3,
            },
          ],
        },
      ],
    });
  });
});
