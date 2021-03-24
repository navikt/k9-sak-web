import React from 'react';
import { ArbeidsforholdV2, UtfallEnum, VilkårEnum } from '@k9-sak-web/types';
import { shallowWithIntl } from '../../i18n';
import Uttaksplan from './Uttaksplan';
import Aktivitet from '../dto/Aktivitet';
import AktivitetTabell from './AktivitetTabell';

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
    },
    [orgNr2]: {
      navn: 'Bedrift 2 AS',
      erPrivatPerson: false,
      identifikator: orgNr2,
    },
    [orgNr3]: {
      navn: 'Equinor',
      erPrivatPerson: false,
      identifikator: orgNr3,
    },
  };

  // {
  //   id: '910909088-ab549827-4f9c-40f3-875c-3c28631b2291',
  //   arbeidsgiver: { arbeidsgiverOrgnr: '910909088', arbeidsgiverAktørId: null },
  //   arbeidsforhold: {
  //     internArbeidsforholdId: 'ab549827-4f9c-40f3-875c-3c28631b2291',
  //     eksternArbeidsforholdId: 'ARB001-001',
  //   },
  //   yrkestittel: 'Ukjent',
  //   begrunnelse: null,
  //   perioder: [{ fom: '2020-06-30', tom: '9999-12-31' }],
  //   handlingType: { kode: 'BRUK', kodeverk: 'ARBEIDSFORHOLD_HANDLING_TYPE' },
  //   kilde: [{ kode: 'AA-Registeret', kodeverk: 'ARBEIDSFORHOLD_KILDE' }],
  //   permisjoner: [],
  //   stillingsprosent: 100.0,
  //   aksjonspunktÅrsaker: [],
  //   inntektsmeldinger: null,
  // },

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
    const wrapper = shallowWithIntl(
      <Uttaksplan
        aktiviteterBehandling={aktiviteter}
        aktivitetsstatuser={[]}
        aktiviteterHittilIÅr={[]}
        arbeidsforhold={arbeidsforhold}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        aktiv
      />,
    );

    const tabeller = wrapper.find(AktivitetTabell);

    arbeidsforhold.forEach(forhold => {
      const tabell = tabeller.findWhere(tab => {
        const tabellForhold = tab.prop('arbeidsforhold');
        return (
          tabellForhold.arbeidsgiver.arbeidsgiverOrgnr === forhold.arbeidsgiver.arbeidsgiverOrgnr &&
          tabellForhold.id === forhold.id
        );
      });

      expect(tabell).toHaveLength(1);
    });

    expect(tabeller).toHaveLength(aktiviteter.length);
  });
});
