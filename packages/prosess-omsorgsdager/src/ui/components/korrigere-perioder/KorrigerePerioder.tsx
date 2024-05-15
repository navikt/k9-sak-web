import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Alert, Button, HelpText } from '@navikt/ds-react';
import { RadioGruppe } from 'nav-frontend-skjema';

import { KorrigerePerioderProps } from '../../../types/KorrigerePerioderProps';
import { booleanTilTekst } from '../../../util/stringUtils';
import useFormSessionStorage from '../../../util/useFormSessionStorageUtils';
import AksjonspunktLesemodus from '../aksjonspunkt-lesemodus/AksjonspunktLesemodus';
import styleLesemodus from '../lesemodus/lesemodusboks.module.css';
import InputField from '../react-hook-form-wrappers/InputField';
import RadioButtonWithBooleanValue from '../react-hook-form-wrappers/RadioButton';
import TextArea from '../react-hook-form-wrappers/TextArea';
import styleRadioknapper from '../styles/radioknapper/radioknapper.module.css';

import styles from './korrigerePerioder.module.css';

type FormData = {
  fravaerGrunnetSmittevernhensynEllerStengt: string;
  begrunnelse: string;
  åpenForRedigering: boolean;
  antallDagerDelvisInnvilget: number;
};

const tekst = {
  instruksjon: 'Vurder om søker har rett til å få utbetalt dager.',
  sporsmalErInnvilget: 'Har søker rett på å få utbetalt dager?',
  antallDagerInnvilget: 'Antall dager innvilget',
  begrunnelse: 'Vurdering',
  feilIngenVurdering: 'Resultat må oppgis.',
  feilManglerDager: 'Antall dager må oppgis.',
};

const tekstKonfliktMedArbeidsgiver = {
  instruksjon:
    'Se på mottatt dokumentasjon, vurder om vi har nok til å vurdere om søker har rett til omsorgspenger fra NAV? Hvis ikke, be om nødvendig dokumentasjon. Ved uenighet, må vi ha skriftlig forklaring fra arbeidsgiver.',
  sporsmalErInnvilget: 'Har søker rett på alle dagene det søkes om?',
  begrunnelse: 'Vurder om søker har rett på omsorgspenger fra NAV',
};

const hentOmLostAksjonspunktHarBlivitLostHeltEllerDelvis = (vilkarOppfylt: boolean, dagerInnvilget: number) => {
  if (vilkarOppfylt && !!dagerInnvilget && dagerInnvilget > 0) {
    return 'delvis';
  }
  return booleanTilTekst(vilkarOppfylt);
};
// TODO Når saerlig smittevern ikke skal brukes lengre må denne ha en bedre navngivning for att brukes som AP for konfliktMedArbeidsgiver

const KorrigerePerioder: React.FunctionComponent<KorrigerePerioderProps> = ({
  behandlingsID,
  aksjonspunktLost,
  informasjonTilLesemodus,
  losAksjonspunkt,
  lesemodus,
  konfliktMedArbeidsgiver,
  formState,
}) => {
  const harAksjonspunktOgVilkarLostTidligere = informasjonTilLesemodus.begrunnelse.length > 0;
  const methods = useForm<FormData>({
    defaultValues: {
      begrunnelse: harAksjonspunktOgVilkarLostTidligere ? informasjonTilLesemodus.begrunnelse : '',
      fravaerGrunnetSmittevernhensynEllerStengt: harAksjonspunktOgVilkarLostTidligere
        ? hentOmLostAksjonspunktHarBlivitLostHeltEllerDelvis(
            informasjonTilLesemodus.vilkarOppfylt,
            informasjonTilLesemodus.antallDagerDelvisInnvilget,
          )
        : '',
      åpenForRedigering: false,
      antallDagerDelvisInnvilget:
        harAksjonspunktOgVilkarLostTidligere &&
        typeof informasjonTilLesemodus.antallDagerDelvisInnvilget !== 'undefined'
          ? informasjonTilLesemodus.antallDagerDelvisInnvilget
          : null,
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = methods;
  const åpenForRedigering = watch('åpenForRedigering');
  const formStateKey = `${behandlingsID}-saerlig-smittevern`;

  const mellomlagringFormState = useFormSessionStorage(
    formStateKey,
    formState,
    methods.watch,
    methods.setValue,
    lesemodus,
    åpenForRedigering,
    getValues,
  );

  const bekreftAksjonspunkt = data => {
    if (!errors.begrunnelse && !errors.fravaerGrunnetSmittevernhensynEllerStengt) {
      if (data.fravaerGrunnetSmittevernhensynEllerStengt === 'delvis') {
        losAksjonspunkt(true, data.begrunnelse, Number(data.antallDagerDelvisInnvilget));
      } else {
        losAksjonspunkt(data.fravaerGrunnetSmittevernhensynEllerStengt, data.begrunnelse, null);
      }
      setValue('åpenForRedigering', false);
      mellomlagringFormState.fjerneState();
    }
  };

  const avbrytRedigereInformasjon = () => {
    setValue('åpenForRedigering', false);
    mellomlagringFormState.fjerneState();
  };

  const erAntallDagerDelvisInnvilgetFyltUt = () => {
    if (getValues().fravaerGrunnetSmittevernhensynEllerStengt !== 'delvis') return true;
    const antallDager = Number(getValues().antallDagerDelvisInnvilget);
    return !Number.isNaN(antallDager) && antallDager > 0;
  };

  const vilkarOppfyltTekstTilLesemodus = (vilkarOppfylt, antallDager) => {
    if (vilkarOppfylt && antallDager !== null) return 'Delvis';
    return vilkarOppfylt ? 'Ja' : 'Nei';
  };

  if (lesemodus && !åpenForRedigering) {
    return (
      <div className={styleLesemodus.lesemodusboks}>
        <AksjonspunktLesemodus
          aksjonspunktTekst={konfliktMedArbeidsgiver ? tekstKonfliktMedArbeidsgiver.instruksjon : tekst.instruksjon}
          harAksjonspunktBlivitLostTidligare={aksjonspunktLost}
          åpneForRedigereInformasjon={() => setValue('åpenForRedigering', true)}
        />
        <p className={styleLesemodus.label}>
          {konfliktMedArbeidsgiver ? tekstKonfliktMedArbeidsgiver.sporsmalErInnvilget : tekst.sporsmalErInnvilget}
        </p>
        <p className={styleLesemodus.text}>
          {vilkarOppfyltTekstTilLesemodus(
            informasjonTilLesemodus.vilkarOppfylt,
            informasjonTilLesemodus.antallDagerDelvisInnvilget,
          )}{' '}
        </p>

        {informasjonTilLesemodus.vilkarOppfylt && informasjonTilLesemodus.antallDagerDelvisInnvilget !== null && (
          <>
            <p className={styleLesemodus.label}>{tekst.antallDagerInnvilget}</p>
            <p className={styleLesemodus.text}>{informasjonTilLesemodus.antallDagerDelvisInnvilget} </p>
          </>
        )}
        <p className={styleLesemodus.label}>
          {konfliktMedArbeidsgiver ? tekstKonfliktMedArbeidsgiver.begrunnelse : tekst.begrunnelse}
        </p>
        <p className={styleLesemodus.fritekst}>{informasjonTilLesemodus.begrunnelse}</p>
      </div>
    );
  }

  return (
    <div className={styles.korrigerePerioder}>
      <div className={styles.korrigerePerioderAlertStripe}>
        <Alert size="small" variant="warning">
          {konfliktMedArbeidsgiver ? tekstKonfliktMedArbeidsgiver.instruksjon : tekst.instruksjon}
        </Alert>
        {!konfliktMedArbeidsgiver && (
          <HelpText className={styles.korrigerePerioderHelpText} placement="right">
            Disse situasjonene kan gi rett til at det skal utbetales dager:
            <ul>
              <li>
                Omsorgen for er manuelt oppfylt etter § 9-5, gjelder også fosterbarn. Det kan gis dager ut fra søkers
                situasjon, ta hensyn til brukers grunnrett og eventuelle ekstra dager.
              </li>
              <li>
                Det er fordelt dager fra annen forelder etter § 9-6, femte ledd. Det kan gis dager ut fra hvor mange
                dager den andre forelderen har ut over grunnretten.
              </li>
              <li>
                Det er overført dager fra ektefelle/ samboer etter 9-6, sjette ledd. Det kan gis dager ut fra hvor mange
                dager ektefelle/ samboer har ut over grunnretten.
              </li>
            </ul>
            For alle tilfeller sjekk også om det er utbetalt dager tidligere for samme år.
          </HelpText>
        )}
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(bekreftAksjonspunkt)}>
          <TextArea
            label={konfliktMedArbeidsgiver ? tekstKonfliktMedArbeidsgiver.begrunnelse : tekst.begrunnelse}
            name="begrunnelse"
          />
          <RadioGruppe
            legend={
              konfliktMedArbeidsgiver ? tekstKonfliktMedArbeidsgiver.sporsmalErInnvilget : tekst.sporsmalErInnvilget
            }
            className={styleRadioknapper.horisontalPlassering}
          >
            <RadioButtonWithBooleanValue label="Ja" value="true" name="fravaerGrunnetSmittevernhensynEllerStengt" />
            <RadioButtonWithBooleanValue label="Nei" value="false" name="fravaerGrunnetSmittevernhensynEllerStengt" />
            <RadioButtonWithBooleanValue
              label="Delvis"
              value="delvis"
              name="fravaerGrunnetSmittevernhensynEllerStengt"
            />
          </RadioGruppe>

          {errors.fravaerGrunnetSmittevernhensynEllerStengt && (
            <p className="typo-feilmelding">{tekst.feilIngenVurdering}</p>
          )}

          {getValues().fravaerGrunnetSmittevernhensynEllerStengt === 'delvis' && (
            <div className={styles.antallDagerDelvisInnvilgetContainer}>
              <InputField
                label="Hvor mange dager har søker rett på?"
                name="antallDagerDelvisInnvilget"
                valideringsFunksjoner={erAntallDagerDelvisInnvilgetFyltUt}
                feil={errors.antallDagerDelvisInnvilget !== undefined ? tekst.feilManglerDager : ''}
              />
            </div>
          )}
          <Button size="small" variant="primary" className={styles.knapp} type="submit">
            Bekreft og fortsett
          </Button>
          <Button
            size="small"
            variant="secondary"
            className={styles.knapp}
            type="button"
            onClick={avbrytRedigereInformasjon}
          >
            Avbryt
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};
export default KorrigerePerioder;
