import { ArbeidsforholdV2, UtfallEnum, VilkårEnum } from '@k9-sak-web/types';
import { FraværÅrsakEnum } from '@k9-sak-web/types/src/omsorgspenger/Uttaksperiode';
import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import Aktivitet from '../dto/Aktivitet';
import Uttaksplan from './Uttaksplan';

describe('Uttaksplan', () => {
  const orgNr1 = '999';
  const orgNr2 = '000';
  const orgNr3 = '111';
  const arbForhId1 = '1';
  const arbForhId2 = '2';
  const arbForhId3 = '3';

  const lagAktivitet = (orgNr, arbeidsfoholdId): Aktivitet => ({
    arbeidsforhold: {
      arbeidsforholdId: arbeidsfoholdId,
      organisasjonsnummer: orgNr,
      type: 'selvstendig næringsdrivende',
    },
    uttaksperioder: [
      {
        utfall: UtfallEnum.AVSLÅTT,
        periode: '2020-03-01/2020-03-31',
        fraværÅrsak: FraværÅrsakEnum.UDEFINERT,
        hjemler: [],
        utbetalingsgrad: 0,
        vurderteVilkår: {
          vilkår: {
            [VilkårEnum.NOK_DAGER]: UtfallEnum.INNVILGET,
            [VilkårEnum.ALDERSVILKÅR_BARN]: UtfallEnum.INNVILGET,
          },
        },
      },
    ],
  });

  const arbeidsgiverOpplysningerPerId = {
    [orgNr1]: {
      navn: 'Bedrift 1 AS',
      erPrivatPerson: false,
      identifikator: orgNr1,
      arbeidsforholdreferanser: [{ internArbeidsforholdId: arbForhId1, eksternArbeidsforholdId: 'ifejifes' }],
    },
    [orgNr2]: {
      navn: 'Bedrift 2 AS',
      erPrivatPerson: false,
      identifikator: orgNr2,
      arbeidsforholdreferanser: [{ internArbeidsforholdId: arbForhId2, eksternArbeidsforholdId: 'ifejifes' }],
    },
    [orgNr3]: {
      navn: 'Equinor',
      erPrivatPerson: false,
      identifikator: orgNr3,
      arbeidsforholdreferanser: [{ internArbeidsforholdId: arbForhId3, eksternArbeidsforholdId: 'ifejifes' }],
    },
  };

  const arbeidsforhold = [
    {
      id: arbForhId1,
      arbeidsgiver: {
        arbeidsgiverOrgnr: orgNr1,
      },
      arbeidsforhold: {
        internArbeidsforholdId: arbForhId1,
      },
    },
    {
      id: arbForhId2,
      arbeidsgiver: {
        arbeidsgiverOrgnr: orgNr2,
      },
      arbeidsforhold: {
        internArbeidsforholdId: arbForhId2,
      },
    },
    {
      id: arbForhId3,
      arbeidsgiver: {
        arbeidsgiverOrgnr: orgNr3,
      },
      arbeidsforhold: {
        internArbeidsforholdId: arbForhId3,
      },
    },
  ] as ArbeidsforholdV2[];

  it('rendrer en tabell per arbeidsforhold', () => {
    const aktivitet1 = lagAktivitet(orgNr1, arbForhId1);
    const aktivitet2 = lagAktivitet(orgNr2, arbForhId2);
    const aktivitet3 = lagAktivitet(orgNr3, arbForhId3);
    const aktiviteter: Aktivitet[] = [aktivitet1, aktivitet2, aktivitet3];
    renderWithIntl(
      <Uttaksplan
        behandlingUuid="abc"
        aktiviteterBehandling={aktiviteter}
        aktivitetsstatuser={[]}
        aktiviteterHittilIÅr={[]}
        arbeidsforhold={arbeidsforhold}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        aktiv
      />,
      { messages },
    );

    expect(screen.getAllByRole('table').length).toBe(aktiviteter.length);
  });
});
