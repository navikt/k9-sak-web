import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import sinon from 'sinon';
import messages from '../../i18n/nb_NO.json';
import { FeilutbetalingPerioderFormImpl } from './FeilutbetalingPerioderForm';

const periode = {
  belop: 51000,
  fom: '2016-03-16',
  tom: '2016-05-26',
};

const mockProps = {
  ...reduxFormPropsMock,
  periode,
  elementId: 0,
  årsaker: [],
  readOnly: false,
  onChangeÅrsak: sinon.spy(),
  onChangeUnderÅrsak: sinon.spy(),
};

describe('<FeilutbetalingPerioderFormImpl>', () => {
  it('skal rendre FeilutbetalingInfoPanel', () => {
    renderWithIntlAndReduxForm(<FeilutbetalingPerioderFormImpl {...mockProps} />, { messages });

    expect(screen.getByText('16.03.2016 - 26.05.2016')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('skal rendre underÅrsak selectfield hvis årsak har underÅrsaker', () => {
    const årsak = 'MEDLEMSKAP_VILKAARET_TYPE';
    const årsaker = [
      {
        kodeverk: 'MEDLEMSKAP_VILKAARET_TYPE',
        årsak: 'Medlemskapsvilkåret §14-2',
        hendelseType: {
          kode: 'MEDLEMSKAP_VILKAARET_TYPE',
        },
        hendelseUndertyper: [
          {
            kodeverk: 'MEDLEMSKAP_VILKAAR',
            underÅrsak: 'Utvandret – fødsel',
            underÅrsakKode: 'UTVANDRET_FODSEL',
          },
        ],
      },
    ];
    const props = {
      ...mockProps,
      årsak,
      årsaker,
    };
    renderWithIntlAndReduxForm(<FeilutbetalingPerioderFormImpl {...props} />, { messages });

    expect(screen.getAllByRole('combobox').length).toBe(2);
  });
});
