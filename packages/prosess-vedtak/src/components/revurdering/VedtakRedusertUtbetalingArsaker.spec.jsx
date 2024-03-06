import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';

import { Formik } from 'formik';
import React from 'react';
import messages from '../../../i18n/nb_NO.json';
import redusertUtbetalingArsak from '../../kodeverk/redusertUtbetalingArsak';
import VedtakRedusertUtbetalingArsaker from './VedtakRedusertUtbetalingArsaker';

describe('VedtakRedusertUtbetalingArsaker', () => {
  const vedtakRedusertUtbetalingArsaker = (
    readOnly = false,
    values = new Map(),
    vedtakVarsel = {},
    erSendtInnUtenArsaker = false,
    merkedeArsaker = undefined,
  ) => {
    const attributter = { intl: intlMock, vedtakVarsel, readOnly, values, erSendtInnUtenArsaker, merkedeArsaker };
    renderWithIntl(
      <Formik initialValues={[]}>
        <VedtakRedusertUtbetalingArsaker {...attributter} />
      </Formik>,
      { messages },
    );
  };

  it('Viser avkrysningsboks for hver årsak', () => {
    const expectedLength = Object.keys(redusertUtbetalingArsak).length;
    vedtakRedusertUtbetalingArsaker();
    expect(screen.getAllByRole('checkbox').length).toBe(expectedLength);
  });

  it('Aktiverer avkrysningsboksene når readOnly er usann', () => {
    const readOnly = false;

    vedtakRedusertUtbetalingArsaker(readOnly);
    const checkboxes = screen.getAllByRole('checkbox');
    const disabled = checkboxes.filter(c => c.disabled);
    expect(disabled).toHaveLength(0);
  });

  it('Deaktiverer avkrysningsboksene når readOnly er sann', () => {
    const readOnly = true;
    const expectedLength = Object.keys(redusertUtbetalingArsak).length;
    vedtakRedusertUtbetalingArsaker(readOnly);
    const checkboxes = screen.getAllByRole('checkbox');
    const disabled = checkboxes.filter(c => c.disabled);
    expect(disabled).toHaveLength(expectedLength);
  });
});
