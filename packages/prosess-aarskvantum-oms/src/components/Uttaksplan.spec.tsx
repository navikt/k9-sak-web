import React from 'react';
import { expect } from 'chai';
import { Arbeidsforhold } from '@k9-sak-web/types';
import { shallowWithIntl } from '../../i18n/intl-enzyme-test-helper-uttaksplan';
import Uttaksplan from './Uttaksplan';
import Aktivitet from '../dto/Aktivitet';
import { UtfallEnum } from '../dto/Utfall';
import { VilkårEnum } from '../dto/Vilkår';
import AktivitetTabell from './AktivitetTabell';

describe('Uttaksplan', () => {
  const orgNr1 = '999';
  const arbForhId1 = '1';
  const arbForhId2 = '2';
  const orgNr2 = '000';

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

  const arbeidsforhold: Arbeidsforhold[] = [
    // @ts-ignore
    {
      navn: 'Bedrift AS',
      arbeidsgiverIdentifikator: orgNr1,
      arbeidsforholdId: arbForhId1,
    },
    // @ts-ignore
    {
      navn: 'Bedrift AS',
      arbeidsgiverIdentifikator: orgNr1,
      arbeidsforholdId: arbForhId2,
    },
    // @ts-ignore
    {
      navn: 'Equinor',
      arbeidsgiverIdentifikator: orgNr2,
      arbeidsforholdId: arbForhId1,
    },
  ];

  it('rendrer en tabell per arbeidsforhold', () => {
    const aktivitet1 = lagAktivitet(orgNr1, arbForhId1);
    const aktivitet2 = lagAktivitet(orgNr1, arbForhId2);
    const aktivitet3 = lagAktivitet(orgNr2, arbForhId1);
    const aktiviteter: Aktivitet[] = [aktivitet1, aktivitet2, aktivitet3];
    const wrapper = shallowWithIntl(
      <Uttaksplan
        aktiviteterBehandling={aktiviteter}
        aktivitetsstatuser={[]}
        aktiviteterHittilIÅr={[]}
        arbeidsforhold={arbeidsforhold}
        aktiv
      />,
    );

    const tabeller = wrapper.find(AktivitetTabell);

    arbeidsforhold.forEach(forhold => {
      const tabell = tabeller.findWhere(tab => {
        const tabellForhold = tab.prop('arbeidsforhold');
        return (
          tabellForhold.arbeidsgiverIdentifikator === forhold.arbeidsgiverIdentifikator &&
          tabellForhold.arbeidsforholdId === forhold.arbeidsforholdId
        );
      });

      expect(tabell).to.have.length(1);
    });

    expect(tabeller).to.have.length(aktiviteter.length);
  });
});
