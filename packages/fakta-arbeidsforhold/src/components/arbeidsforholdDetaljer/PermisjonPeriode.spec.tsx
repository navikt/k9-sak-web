import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../i18n/nb_NO.json';
import PermisjonPeriode from './PermisjonPeriode';

describe('<PermisjonPeriode>', () => {
  it('skal ikke vise permisjon når arbeidsforholdet har undefined permisjoner', () => {
    renderWithIntl(
      <PermisjonPeriode
        arbeidsforhold={
          {
            permisjoner: undefined,
          } as ArbeidsforholdV2
        }
      />,
      { messages },
    );

    expect(screen.queryByText('Permisjon')).not.toBeInTheDocument();
    expect(screen.queryByText('Permisjoner')).not.toBeInTheDocument();
  });
  it('skal ikke vise permisjon når arbeidsforholdet en tom liste med permisjoner', () => {
    renderWithIntl(
      <PermisjonPeriode
        arbeidsforhold={
          {
            permisjoner: [],
          } as ArbeidsforholdV2
        }
      />,
      { messages },
    );
    expect(screen.queryByText('Permisjon')).not.toBeInTheDocument();
    expect(screen.queryByText('Permisjoner')).not.toBeInTheDocument();
  });
  it('skal vise permisjon når arbeidsforholdet har kun en permisjon', () => {
    renderWithIntl(
      <PermisjonPeriode
        arbeidsforhold={
          {
            permisjoner: [
              {
                permisjonFom: '2018-10-10',
                permisjonTom: undefined,
                permisjonsprosent: 100,
              },
            ],
          } as ArbeidsforholdV2
        }
      />,
      { messages },
    );
    expect(screen.getByText('Permisjon')).toBeInTheDocument();
    expect(screen.getByText('10.10.2018-')).toBeInTheDocument();
  });
  it('skal vise permisjoner når arbeidsforholdet har flere permisjoner', () => {
    renderWithIntl(
      <PermisjonPeriode
        arbeidsforhold={
          {
            permisjoner: [
              {
                permisjonFom: '2015-01-01',
                permisjonTom: undefined,
                permisjonsprosent: 100,
              },
              {
                permisjonFom: '2017-01-01',
                permisjonTom: '2019-01-01',
                permisjonsprosent: 100,
              },
            ],
          } as ArbeidsforholdV2
        }
      />,
      { messages },
    );
    expect(screen.getByText('Permisjoner')).toBeInTheDocument();
    expect(screen.getByText('01.01.2015-')).toBeInTheDocument();
    expect(screen.getByText('01.01.2017-01.01.2019')).toBeInTheDocument();
  });
});
