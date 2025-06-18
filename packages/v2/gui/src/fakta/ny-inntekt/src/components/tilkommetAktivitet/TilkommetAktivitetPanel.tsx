import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ScissorsIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Box, Button, Heading, HStack, Label } from '@navikt/ds-react';
import dayjs from 'dayjs';

import { AktivitetStatus } from '@navikt/ft-kodeverk';
import { ISO_DATE_FORMAT, sortPeriodsByFom } from '@navikt/ft-utils';

import { type TilkommetAktivitetFormValues } from '../../types/FordelBeregningsgrunnlagPanelValues';
import { type Periode } from './PeriodesplittDatoValg';
import { PeriodesplittModal } from './PeriodesplittModal';
import { TilkommetAktivitetAccordion } from './TilkommetAktivitetAccordion';

import type { ArbeidsgiverOpplysningerPerId } from '../../types/ArbeidsgiverOpplysninger';
import type { Beregningsgrunnlag } from '../../types/Beregningsgrunnlag';
import type { VurderInntektsforholdPeriode } from '../../types/BeregningsgrunnlagFordeling';
import styles from './tilkommetAktivitet.module.css';

const finnAktivitetStatus = (
  aktivitetStatus: AktivitetStatus,
  vurderInntektsforholdPerioder?: VurderInntektsforholdPeriode[],
) =>
  vurderInntektsforholdPerioder?.some(inntektsforholdPeriode =>
    inntektsforholdPeriode.inntektsforholdListe.some(
      inntektsforhold => inntektsforhold.aktivitetStatus === aktivitetStatus,
    ),
  );

type Props = {
  formName: string;
  beregningsgrunnlag: Beregningsgrunnlag;
  formFieldIndex: number;
  readOnly: boolean;
  submittable: boolean;
  erAksjonspunktÅpent: boolean;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
};

export const TilkommetAktivitetPanel = ({
  formName,
  beregningsgrunnlag,
  formFieldIndex,
  readOnly,
  submittable,
  erAksjonspunktÅpent,
  arbeidsgiverOpplysningerPerId,
}: Props) => {
  const [modalErÅpen, setModalErÅpen] = useState<boolean>(false);

  const { control, watch } = useFormContext<TilkommetAktivitetFormValues>();
  const { fields, remove, insert } = useFieldArray({
    control,
    name: `VURDER_TILKOMMET_AKTIVITET_FORM.${formFieldIndex}.perioder`,
  });
  const sortedFields = fields.toSorted(sortPeriodsByFom);

  const vurderInntektsforholdPerioder =
    beregningsgrunnlag.faktaOmFordeling?.vurderNyttInntektsforholdDto?.vurderInntektsforholdPerioder;

  const getAlertHeading = () => {
    const unikestatuser = vurderInntektsforholdPerioder
      ?.flatMap(p => p.inntektsforholdListe.map(a => a.aktivitetStatus))
      .reduce((liste: string[], a) => {
        if (!liste.some(it => it === a)) {
          liste.push(a);
        }
        return liste;
      }, []);

    const antallStatuser = !unikestatuser ? 0 : unikestatuser.length;

    if (antallStatuser > 1) {
      return 'Søker har nye aktiviteter';
    }

    const harSNAktvitet = finnAktivitetStatus(
      AktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
      vurderInntektsforholdPerioder,
    );
    if (harSNAktvitet) {
      return 'Søker har opplyst om ny inntekt som selvstendig næringsdrivende.';
    }

    const harFrilanserAktvitet = finnAktivitetStatus(AktivitetStatus.FRILANSER, vurderInntektsforholdPerioder);
    if (harFrilanserAktvitet) {
      return 'Søker har en ny frilansaktivitet i AA-registeret.';
    }

    const harDagpengerAktivitet = finnAktivitetStatus(AktivitetStatus.DAGPENGER, vurderInntektsforholdPerioder);
    if (harDagpengerAktivitet) {
      return 'Søker har en ny periode med dagpenger';
    }

    return 'Søker har et nytt arbeidsforhold i AA-registeret';
  };

  const getAksjonspunktText = () => {
    if (erAksjonspunktÅpent) {
      return (
        <Alert size="small" variant="warning">
          <Heading size="xsmall" level="3">
            {getAlertHeading()}
          </Heading>
          Vurder om pleiepengene skal reduseres på grunn av den nye inntekten.
        </Alert>
      );
    }
    return (
      <>
        <Label size="small">
          {`Behandlet aksjonspunkt: `}
          {getAlertHeading()}
        </Label>
        <BodyShort size="small">Vurder om pleiepengene skal reduseres på grunn av den nye inntekten.</BodyShort>
      </>
    );
  };

  const mapInntektsforhold = (
    andel: any,
    taMedAlleFelter: boolean,
    periodeFieldIndex: number,
    andelFieldIndex: number,
  ) => {
    const skalRedusereValg = watch(
      `${formName}.${formFieldIndex}.perioder.${periodeFieldIndex}.inntektsforhold.${andelFieldIndex}.skalRedusereUtbetaling`,
    );
    const bruttoVerdi = watch(
      `${formName}.${formFieldIndex}.perioder.${periodeFieldIndex}.inntektsforhold.${andelFieldIndex}.bruttoInntektPrÅr`,
    );
    return {
      aktivitetStatus: andel.aktivitetStatus,
      arbeidsgiverIdent: andel.arbeidsgiverIdent,
      arbeidsforholdId: andel.arbeidsforholdId,
      bruttoInntektPrÅr: taMedAlleFelter ? bruttoVerdi : undefined,
      skalRedusereUtbetaling: taMedAlleFelter ? skalRedusereValg : undefined,
    };
  };

  const overlapper = (fom: string, tom: string, dato: string): boolean =>
    !dayjs(fom).isAfter(dayjs(dato)) && !dayjs(tom).isBefore(dayjs(dato));

  const finnNyePerioder = (nyFom: string): Periode[] => {
    const fieldSomSplittes = sortedFields.find(field => overlapper(field.fom, field.tom, nyFom));
    if (!fieldSomSplittes) {
      throw new Error(`Finner ikke field som inneholder dato ${nyFom}`);
    }
    const splittDel1Tom = dayjs(nyFom).subtract(1, 'day');
    const splittDel1 = {
      fom: dayjs(fieldSomSplittes.fom).format(ISO_DATE_FORMAT),
      tom: splittDel1Tom.format(ISO_DATE_FORMAT),
    };
    const splittDel2 = {
      fom: dayjs(nyFom).format(ISO_DATE_FORMAT),
      tom: fieldSomSplittes.tom,
    };
    return [splittDel1, splittDel2];
  };

  const splittPeriode = (nyFom: string) => {
    const fieldSomSplittes = sortedFields.find(field => overlapper(field.fom, field.tom, nyFom));
    if (!fieldSomSplittes) {
      throw new Error(`Finner ikke field som inneholder dato ${nyFom}`);
    }
    const nyePerioder = finnNyePerioder(nyFom);
    const periodeFieldIndex = sortedFields.indexOf(fieldSomSplittes);
    const andelerFraField = fieldSomSplittes.inntektsforhold || [];
    const splittDel1 = {
      inntektsforhold: andelerFraField.map((andel, index) => mapInntektsforhold(andel, true, periodeFieldIndex, index)),
      fom: nyePerioder[0].fom,
      tom: nyePerioder[0].tom,
    };
    const splittDel2 = {
      inntektsforhold: andelerFraField.map((andel, index) =>
        mapInntektsforhold(andel, false, periodeFieldIndex, index),
      ),
      fom: nyePerioder[1].fom,
      tom: nyePerioder[1].tom,
    };
    remove(periodeFieldIndex);
    insert(periodeFieldIndex, [splittDel1, splittDel2]);
  };

  const åpneModal = () => {
    setModalErÅpen(true);
  };

  const lukkModal = () => {
    setModalErÅpen(false);
  };

  return (
    <>
      {getAksjonspunktText()}
      {!!vurderInntektsforholdPerioder && erAksjonspunktÅpent && (
        <Box marginBlock="2 0">
          <Alert size="small" variant="info" title="">
            Inntekter som kommer til underveis i en løpende pleiepengeperiode er ikke en del av søkers
            beregningsgrunnlag. Dersom inntekten reduserer søkers inntektstap, må det vurderes om pleiepengene skal
            graderes mot den nye inntekten.
          </Alert>
        </Box>
      )}
      <Box marginBlock="10 0">
        <HStack gap="4" justify="space-between">
          <Heading size="small" level="3">
            Perioder med ny aktivitet
          </Heading>
          <div className={styles.modalKnapp}>
            <Button
              variant="tertiary"
              loading={false}
              disabled={readOnly}
              onClick={åpneModal}
              size="small"
              type="button"
              icon={<ScissorsIcon height={32} width={32} />}
            >
              Del opp periode
            </Button>
          </div>
        </HStack>
      </Box>
      {modalErÅpen && (
        <PeriodesplittModal
          fields={sortedFields}
          forhåndsvisPeriodesplitt={finnNyePerioder}
          lukkModal={lukkModal}
          skalViseModal={modalErÅpen}
          utførPeriodesplitt={splittPeriode}
        />
      )}
      <TilkommetAktivitetAccordion
        beregningsgrunnlag={beregningsgrunnlag}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        formName={formName}
        fields={sortedFields}
        formFieldIndex={formFieldIndex}
        readOnly={readOnly}
        erAksjonspunktÅpent={erAksjonspunktÅpent}
        submittable={submittable}
      />
    </>
  );
};
