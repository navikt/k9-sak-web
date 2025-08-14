import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import { isAksjonspunktOpen } from '@navikt/ft-kodeverk';

import { ErrorBoundary } from '@navikt/ft-ui-komponenter';
import { formatCurrencyNoKr, removeSpacesFromNumber } from '@navikt/ft-utils';

import type {
  TilkommetAktivitetFieldValues,
  TilkommetAktivitetFormValues,
  TilkommetAktivitetValues,
  TilkommetInntektsforholdFieldValues,
} from '../../types/FordelBeregningsgrunnlagPanelValues';
import { FaktaFordelBeregningAvklaringsbehovCode } from '../../types/interface/FaktaFordelBeregningAvklaringsbehovCode.js';
import type {
  VurderNyttInntektsforholdAP,
  VurderNyttInntektsforholTransformedValues,
} from '../../types/interface/VurderNyttInntektsforholdAP';
import { type Vilkårperiode } from '../../types/Vilkår';
import { finnVilkårsperiode, vurderesIBehandlingen } from '../felles/vilkårsperiodeUtils';
import { TilkommetAktivitetPanel } from './TilkommetAktivitetPanel';
import { erVurdertTidligere, slaaSammenPerioder } from './TilkommetAktivitetUtils';

import { RhfForm } from '@navikt/ft-form-hooks';
import type { ArbeidsgiverOpplysningerPerId } from '../../types/ArbeidsgiverOpplysninger.js';
import type { BeregningAvklaringsbehov } from '../../types/BeregningAvklaringsbehov.js';
import type { Beregningsgrunnlag } from '../../types/Beregningsgrunnlag.js';
import type { Inntektsforhold, VurderInntektsforholdPeriode } from '../../types/BeregningsgrunnlagFordeling.js';
import type { BeregningsgrunnlagTilBekreftelse } from '../../types/BeregningsgrunnlagTilBekreftelse.js';
import styles from './tilkommetAktivitet.module.css';

dayjs.extend(isBetween);
const { VURDER_NYTT_INNTKTSFRHLD } = FaktaFordelBeregningAvklaringsbehovCode;
export const FORM_NAME = 'VURDER_TILKOMMET_AKTIVITET_FORM';

const findAvklaringsbehov = (avklaringsbehov?: BeregningAvklaringsbehov[]): BeregningAvklaringsbehov => {
  const ak = avklaringsbehov?.find(ap => ap.definisjon === VURDER_NYTT_INNTKTSFRHLD);
  if (!ak) {
    throw Error(`Fant ikke forventet avklaringsbehov ${VURDER_NYTT_INNTKTSFRHLD}`);
  }
  return ak;
};

const finnBeregningsgrunnlag = (
  vilkårsperiodeFom: string,
  beregninsgrunnlagListe: Beregningsgrunnlag[],
): Beregningsgrunnlag => {
  const matchendeBG = beregninsgrunnlagListe.find(bg => bg.vilkårsperiodeFom === vilkårsperiodeFom);
  if (!matchendeBG) {
    throw Error(`Mangler beregningsgrunnlag for vilkårsperiodeFom ${vilkårsperiodeFom}`);
  }
  return matchendeBG;
};

function finnPerioderTilVurdering(beregningsgrunnlag: Beregningsgrunnlag): VurderInntektsforholdPeriode[] {
  const vurderInntektsforholdPerioder =
    beregningsgrunnlag.faktaOmFordeling?.vurderNyttInntektsforholdDto?.vurderInntektsforholdPerioder;

  if (!vurderInntektsforholdPerioder) {
    throw Error('vurderInntektsforholdPerioder skal være definert');
  }

  const sammenslåttPerioder = slaaSammenPerioder(vurderInntektsforholdPerioder, beregningsgrunnlag.forlengelseperioder);
  return sammenslåttPerioder.filter(p => !erVurdertTidligere(p, beregningsgrunnlag));
}

const buildInitalValuesInntektsforhold = (inntektsforhold: Inntektsforhold): TilkommetInntektsforholdFieldValues => ({
  aktivitetStatus: inntektsforhold.aktivitetStatus,
  arbeidsgiverIdent: inntektsforhold.arbeidsgiverId,
  arbeidsforholdId: inntektsforhold.arbeidsforholdId,
  bruttoInntektPrÅr: formatCurrencyNoKr(inntektsforhold.bruttoInntektPrÅr),
  skalRedusereUtbetaling: inntektsforhold.skalRedusereUtbetaling,
});

const buildInitialValuesPeriode = (periode: VurderInntektsforholdPeriode): TilkommetAktivitetValues => ({
  fom: periode.fom,
  tom: periode.tom,
  inntektsforhold: periode.inntektsforholdListe.map(andel => buildInitalValuesInntektsforhold(andel)),
});

const buildFieldInitialValues = (
  beregningsgrunnlag: Beregningsgrunnlag,
  vilkarperioder: Vilkårperiode[],
): TilkommetAktivitetFieldValues => {
  const avklaringsbehov = findAvklaringsbehov(beregningsgrunnlag.avklaringsbehov);
  const perioderTilVurdering = finnPerioderTilVurdering(beregningsgrunnlag);

  return {
    beregningsgrunnlagStp: beregningsgrunnlag.skjaeringstidspunktBeregning,
    begrunnelse: avklaringsbehov && avklaringsbehov.begrunnelse ? avklaringsbehov.begrunnelse : '',
    periode: finnVilkårsperiode(vilkarperioder, beregningsgrunnlag.vilkårsperiodeFom).periode,
    perioder: perioderTilVurdering.map(periode => buildInitialValuesPeriode(periode)),
  };
};

const buildInitialValues = (
  beregningsgrunnlagListe: Beregningsgrunnlag[],
  vilkarperioder: Vilkårperiode[],
): TilkommetAktivitetFormValues => ({
  [`${FORM_NAME}`]: beregningsgrunnlagListe
    .filter(bg =>
      bg.avklaringsbehov.some(v => v.definisjon === FaktaFordelBeregningAvklaringsbehovCode.VURDER_NYTT_INNTKTSFRHLD),
    )
    .map(bg => buildFieldInitialValues(bg, vilkarperioder)),
});

const overlapper = (periode1: { fom: string; tom: string }, periode2: { fom: string; tom: string }): boolean => {
  const periode1OverlapperPeriode2 =
    dayjs(periode1.fom).isBetween(periode2.fom, periode2.tom, 'day', '[]') ||
    dayjs(periode1.tom).isBetween(periode2.fom, periode2.tom, 'day', '[]');
  const periode2OverlapperPeriode1 =
    dayjs(periode2.fom).isBetween(periode1.fom, periode1.tom, 'day', '[]') ||
    dayjs(periode2.tom).isBetween(periode1.fom, periode1.tom, 'day', '[]');
  return periode1OverlapperPeriode2 || periode2OverlapperPeriode1;
};

const andelFieldFinnesIPeriode = (
  andelField: TilkommetInntektsforholdFieldValues,
  periode: VurderInntektsforholdPeriode,
): boolean =>
  periode.inntektsforholdListe.some(
    andel =>
      andel.aktivitetStatus === andelField.aktivitetStatus &&
      andel.arbeidsforholdId === andelField.arbeidsforholdId &&
      andel.arbeidsgiverId === andelField.arbeidsgiverIdent,
  );

export const transformFieldValues = (
  values: TilkommetAktivitetFieldValues,
  bg: Beregningsgrunnlag,
): BeregningsgrunnlagTilBekreftelse<VurderNyttInntektsforholTransformedValues> => {
  const perioderFields = values.perioder;
  const vurderInntektsforholdPerioder =
    bg.faktaOmFordeling?.vurderNyttInntektsforholdDto?.vurderInntektsforholdPerioder || [];
  const allePerioder = vurderInntektsforholdPerioder.flatMap(periode => {
    const overlappendeFields = perioderFields.filter(p => overlapper(p, periode));
    return overlappendeFields.map(periodeField => {
      const andelFields = periodeField.inntektsforhold;
      const transformerteInntektsforhold = andelFields
        .filter(andelField => andelFieldFinnesIPeriode(andelField, periode))
        .map(andelField => {
          const skalUtbetalingReduseres = !!andelField.skalRedusereUtbetaling;
          const bruttoInntektPrÅr = skalUtbetalingReduseres
            ? removeSpacesFromNumber(andelField.bruttoInntektPrÅr)
            : undefined;
          return {
            aktivitetStatus: andelField.aktivitetStatus,
            arbeidsgiverId: andelField.arbeidsgiverIdent,
            arbeidsforholdId: andelField.arbeidsforholdId,
            skalRedusereUtbetaling: skalUtbetalingReduseres,
            bruttoInntektPrÅr,
          };
        });
      return {
        fom: dayjs(periodeField.fom).isBefore(dayjs(periode.fom)) ? periode.fom : periodeField.fom,
        tom: dayjs(periodeField.tom).isAfter(dayjs(periode.tom)) ? periode.tom : periodeField.tom,
        tilkomneInntektsforhold: transformerteInntektsforhold,
      };
    });
  });
  return {
    periode: values.periode,
    begrunnelse: values.begrunnelse,
    tilkomneInntektsforhold: allePerioder,
  };
};

const transformValues = (
  values: TilkommetAktivitetFormValues,
  beregninsgrunnlagListe: Beregningsgrunnlag[],
  vilkarperioder: Vilkårperiode[],
): VurderNyttInntektsforholdAP => {
  const fields = values[FORM_NAME];
  const grunnlag =
    fields
      ?.filter(f => vurderesIBehandlingen(vilkarperioder, f.periode.fom))
      .map(field => transformFieldValues(field, finnBeregningsgrunnlag(field.periode.fom, beregninsgrunnlagListe))) ??
    [];
  const begrunnelse = grunnlag?.map(gr => gr.begrunnelse).reduce((b1, b2) => (b1 !== null ? `${b1} ${b2}` : b2));
  return {
    begrunnelse,
    grunnlag,
    kode: VURDER_NYTT_INNTKTSFRHLD,
  };
};

type Props = {
  aktivtBeregningsgrunnlagIndeks: number;
  formData?: TilkommetAktivitetFormValues;
  setFormData: (data: TilkommetAktivitetFormValues) => void;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  submitCallback: (aksjonspunktData: VurderNyttInntektsforholdAP) => Promise<void>;
  readOnly: boolean;
  submittable: boolean;
  beregningsgrunnlagListe: Beregningsgrunnlag[];
  vilkarperioder: Vilkårperiode[];
};

export const TilkommetAktivitet = ({
  aktivtBeregningsgrunnlagIndeks,
  formData,
  setFormData,
  beregningsgrunnlagListe,
  submitCallback,
  readOnly,
  submittable,
  vilkarperioder,
  arbeidsgiverOpplysningerPerId,
}: Props) => {
  const formMethods = useForm<TilkommetAktivitetFormValues>({
    defaultValues: formData?.['VURDER_TILKOMMET_AKTIVITET_FORM']
      ? formData
      : buildInitialValues(beregningsgrunnlagListe, vilkarperioder),
  });

  const {
    formState: { dirtyFields, isSubmitted, errors },
    trigger,
    control,
  } = formMethods;

  useEffect(() => {
    if (isSubmitted && dirtyFields[FORM_NAME]?.[aktivtBeregningsgrunnlagIndeks]) {
      void trigger();
    }
  }, [aktivtBeregningsgrunnlagIndeks]);

  const { fields } = useFieldArray({
    name: FORM_NAME,
    control,
  });

  const gjeldendeBeregningsgrunnlag = beregningsgrunnlagListe[aktivtBeregningsgrunnlagIndeks];
  const ap = findAvklaringsbehov(gjeldendeBeregningsgrunnlag?.avklaringsbehov);
  const erAksjonspunktÅpent = ap ? isAksjonspunktOpen(ap.status) : false;

  return (
    <ErrorBoundary errorMessage="Noe gikk galt ved visning av tilkommet aktivitet">
      <div className={styles.tilkommetAktivitet}>
        <RhfForm
          formMethods={formMethods}
          onSubmit={async values => {
            if (Object.keys(errors).length === 0) {
              await submitCallback(transformValues(values, beregningsgrunnlagListe, vilkarperioder));
            }
          }}
          setDataOnUnmount={setFormData}
        >
          {fields.map((field, formFieldIndex) => {
            const beregningsgrunnlagIndeks = beregningsgrunnlagListe.findIndex(
              bg => bg.skjaeringstidspunktBeregning === field.beregningsgrunnlagStp,
            );

            if (!beregningsgrunnlagListe[beregningsgrunnlagIndeks]) {
              return null;
            }

            return (
              <div
                key={field.id}
                style={{ display: beregningsgrunnlagIndeks === aktivtBeregningsgrunnlagIndeks ? 'block' : 'none' }}
              >
                <TilkommetAktivitetPanel
                  formName={FORM_NAME}
                  beregningsgrunnlag={beregningsgrunnlagListe[beregningsgrunnlagIndeks]}
                  formFieldIndex={formFieldIndex}
                  readOnly={
                    readOnly ||
                    !vurderesIBehandlingen(
                      vilkarperioder,
                      beregningsgrunnlagListe[beregningsgrunnlagIndeks]?.vilkårsperiodeFom,
                    )
                  }
                  submittable={submittable}
                  erAksjonspunktÅpent={erAksjonspunktÅpent}
                  arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
                />
              </div>
            );
          })}
        </RhfForm>
      </div>
    </ErrorBoundary>
  );
};
