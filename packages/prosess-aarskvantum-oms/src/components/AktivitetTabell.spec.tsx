import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { ArbeidsforholdV2, UtfallEnum, VilkårEnum } from '@k9-sak-web/types';
import { FraværÅrsakEnum } from '@k9-sak-web/types/src/omsorgspenger/Uttaksperiode';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { act } from 'react-dom/test-utils';
import messages from '../../i18n/nb_NO.json';
import Aktivitet from '../dto/Aktivitet';
import AktivitetTabell from './AktivitetTabell';

describe('<AktivitetTabell />', () => {
  const aktivitet: Aktivitet = {
    arbeidsforhold: {
      arbeidsforholdId: '888',
      organisasjonsnummer: '999',
      type: 'selvstendig næringsdrivende',
    },
    uttaksperioder: [
      {
        utfall: UtfallEnum.AVSLÅTT,
        periode: '2020-03-01/2020-03-31',
        fraværÅrsak: FraværÅrsakEnum.ORDINÆRT_FRAVÆR,
        utbetalingsgrad: 0,
        hjemler: [],
        vurderteVilkår: {
          vilkår: {
            [VilkårEnum.ARBEIDSFORHOLD]: UtfallEnum.AVSLÅTT,
            [VilkårEnum.NOK_DAGER]: UtfallEnum.AVSLÅTT,
            [VilkårEnum.ALDERSVILKÅR_BARN]: UtfallEnum.INNVILGET,
          },
        },
      },
    ],
  };

  const arbeidsforhold = {
    id: '123',
    arbeidsgiver: {
      arbeidsgiverOrgnr: '999',
    },
    arbeidsforhold: {
      eksternArbeidsforholdId: '1',
    },
  } as ArbeidsforholdV2;

  it('rendrer tabellrad med rett info', () => {
    renderWithIntl(
      <AktivitetTabell
        behandlingUuid="abc"
        uttaksperioder={aktivitet.uttaksperioder}
        arbeidsforholdtypeKode="AT"
        arbeidsforhold={arbeidsforhold}
        aktivitetsstatuser={[]}
        arbeidsgiverOpplysningerPerId={{}}
      />,
      { messages },
    );

    expect(screen.getByText('01.03.2020 - 31.03.2020')).toBeInTheDocument();
    expect(screen.getByText('Avslått')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('Fullt fravær (31d)')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Utvid rad for perioden 01.03.2020 - 31.03.2020', expanded: false }),
    ).toBeInTheDocument();
  });

  it('Klikk expandknapp rendrer detaljer og viser vilkår om arbeidsforhold sist', async () => {
    renderWithIntl(
      <AktivitetTabell
        behandlingUuid="abc"
        uttaksperioder={aktivitet.uttaksperioder}
        arbeidsforhold={arbeidsforhold}
        arbeidsforholdtypeKode="AT"
        aktivitetsstatuser={[]}
        arbeidsgiverOpplysningerPerId={{}}
      />,
      { messages },
    );
    expect(screen.queryByText('Permittert, permisjon eller opphørt arbeidsforhold')).not.toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Utvid rad for perioden 01.03.2020 - 31.03.2020' }));
    });
    expect(screen.getByText('Permittert, permisjon eller opphørt arbeidsforhold')).toBeInTheDocument();
  });
});
