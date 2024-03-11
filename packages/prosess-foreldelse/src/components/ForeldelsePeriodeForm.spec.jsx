import foreldelseVurderingType from '@fpsak-frontend/kodeverk/src/foreldelseVurderingType';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import { ForeldelsePeriodeFormImpl } from './ForeldelsePeriodeForm';

describe('<ForeldelsePeriodeForm>', () => {
  it('skal rendre komponent korrekt', () => {
    const periode = { fom: '2020-01-01', tom: '2020-02-01' };
    renderWithIntlAndReduxForm(
      <ForeldelsePeriodeFormImpl
        periode={periode}
        behandlingFormPrefix="form"
        skjulPeriode={vi.fn()}
        readOnly={false}
        foreldelseVurderingTyper={[
          {
            kode: foreldelseVurderingType.IKKE_VURDERT,
            navn: 'IKKE_VURDERT',
            kodeverk: '',
          },
          {
            kode: foreldelseVurderingType.FORELDET,
            navn: 'FORELDET',
            kodeverk: '',
          },
          {
            kode: foreldelseVurderingType.IKKE_FORELDET,
            navn: 'IKKE_FORELDET',
            kodeverk: '',
          },
          {
            kode: foreldelseVurderingType.TILLEGGSFRIST,
            navn: 'TILLEGGSFRIST',
            kodeverk: '',
          },
        ]}
        setNestePeriode={vi.fn()}
        setForrigePeriode={vi.fn()}
        oppdaterSplittedePerioder={vi.fn()}
        behandlingId={1}
        behandlingVersjon={2}
        beregnBelop={vi.fn()}
        {...reduxFormPropsMock}
      />,
      { messages },
    );

    expect(screen.getByRole('radio', { name: 'IKKE_VURDERT' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'FORELDET' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'IKKE_FORELDET' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'TILLEGGSFRIST' })).toBeInTheDocument();
  });
});
