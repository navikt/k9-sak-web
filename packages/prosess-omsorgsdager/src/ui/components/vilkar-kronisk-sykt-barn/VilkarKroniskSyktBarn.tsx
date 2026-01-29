import { Alert, Button, Checkbox, Fieldset, HelpText, HStack, RadioGroup, Select, VStack } from '@navikt/ds-react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { VilkarKroniskSyktBarnProps } from '../../../types/VilkarKroniskSyktBarnProps';
import { booleanTilTekst, formatereDato, formatereDatoTilLesemodus, tekstTilBoolean } from '../../../util/stringUtils';
import useFormSessionStorage from '../../../util/useFormSessionStorageUtils';
import { valideringsFunksjoner } from '../../../util/validationReactHookFormUtils';
import AksjonspunktLesemodus from '../aksjonspunkt-lesemodus/AksjonspunktLesemodus';
import styleLesemodus from '../lesemodus/lesemodusboks.module.css';
import DatePicker from '../react-hook-form-wrappers/DatePicker';
import RadioButtonWithBooleanValue from '../react-hook-form-wrappers/RadioButton';
import TextArea from '../react-hook-form-wrappers/TextArea';
import styleRadioknapper from '../styles/radioknapper/radioknapper.module.css';
import VilkarStatus from '../vilkar-status/VilkarStatus';
import styles from './vilkarKronisSyktBarn.module.css';

type FormData = {
  harDokumentasjonOgFravaerRisiko: string;
  avslagsårsakKode: string;
  begrunnelse: string;
  åpenForRedigering: boolean;
  fraDato: string;
  tilDato: string;
  erTidsbegrenset: boolean;
};

export enum AvslagskoderKroniskSyk {
  IKKE_UTVIDET_RETT = '1072',
  IKKE_KRONISK_SYK_ELLER_FUNKSJONSHEMMET = '1073',
  IKKE_OKT_RISIKO_FRA_FRAVAER = '1074',
  MANGLENDE_DOKUMENTASJON = '1019',
}

const tekst = {
  instruksjon:
    'Se på vedlagt legeerklæring og vurder om barnet har en kronisk eller langvarig sykdom, eller en funksjonshemming. Vurder også om det er en markert økt risiko for fravær. Langvarig syk gjelder fra 1.1.2023.',
  sporsmalHarDokumentasjonOgFravaerRisiko:
    'Er det dokumentert at barnet har en kronisk eller langvarig sykdom, eller en funksjonshemming, som gir markert økt risiko for fravær?',
  arsak: 'Årsak',
  begrunnelse: 'Vurdering',
  velgArsak: 'Velg årsak',
  arsakIkkeSyk: 'Barnet har ikke en kronisk eller langvarig sykdom, eller funksjonshemming',
  arsakIkkeRisikoFraFravaer: 'Det er ikke økt risiko for fravær fra arbeid',
  arsakManglerDokumentasjon: 'Dokumentasjon mangler',
  feilOppgiÅrsak: 'Årsak må oppgis.',
  feilOppgiHvisDokumentasjonGirRett: 'Resultat må oppgis.',
  sporsmalPeriodeVedtakGyldig: 'Fra hvilken dato er vedtaket gyldig?',
  feilmedlingManglerDato: 'Mangler dato.',
  feilmedlingManglerFraDato: 'Mangler fra-dato.',
  feilmedlingUgyldigDato: 'Ugyldig dato.',
  feilmedlingerDatoIkkeIFremtid: 'Fra-dato kan ikke være frem i tid.',
  soknadsdato: 'Søknadsdato',
  begrunnelseFraBruker: 'Begrunnelse for risiko for økt fravær',
};

const mapTilAvslagstekst = (avslagsKode: string): string => {
  if (avslagsKode === AvslagskoderKroniskSyk.IKKE_OKT_RISIKO_FRA_FRAVAER) {
    return tekst.arsakIkkeRisikoFraFravaer;
  }
  if (
    avslagsKode === AvslagskoderKroniskSyk.IKKE_KRONISK_SYK_ELLER_FUNKSJONSHEMMET ||
    // Brukes bare for bakoverkompatiblitet
    avslagsKode === AvslagskoderKroniskSyk.IKKE_UTVIDET_RETT
  ) {
    return tekst.arsakIkkeSyk;
  }
  if (avslagsKode === AvslagskoderKroniskSyk.MANGLENDE_DOKUMENTASJON) {
    return tekst.arsakManglerDokumentasjon;
  }
  return '';
};

const VilkarKroniskSyktBarn: React.FunctionComponent<VilkarKroniskSyktBarnProps> = ({
  behandlingsID,
  lesemodus,
  losAksjonspunkt,
  informasjonTilLesemodus,
  aksjonspunktLost,
  vedtakFattetVilkarOppfylt,
  informasjonOmVilkar,
  formState,
  soknadsdato,
  begrunnelseFraBruker,
  personopplysninger,
}) => {
  const harAksjonspunktOgVilkarLostTidligere = informasjonTilLesemodus?.begrunnelse.length > 0;
  const methods = useForm<FormData>({
    defaultValues: {
      begrunnelse: harAksjonspunktOgVilkarLostTidligere ? informasjonTilLesemodus.begrunnelse : '',
      harDokumentasjonOgFravaerRisiko: harAksjonspunktOgVilkarLostTidligere
        ? booleanTilTekst(informasjonTilLesemodus.vilkarOppfylt)
        : '',
      avslagsårsakKode: harAksjonspunktOgVilkarLostTidligere ? informasjonTilLesemodus.avslagsårsakKode : '',
      fraDato: harAksjonspunktOgVilkarLostTidligere ? formatereDato(informasjonTilLesemodus.fraDato) : 'dd.mm.åååå',
      tilDato: harAksjonspunktOgVilkarLostTidligere ? informasjonTilLesemodus.tilDato : 'dd.mm.åååå',
      erTidsbegrenset: harAksjonspunktOgVilkarLostTidligere ? informasjonTilLesemodus.erTidsbegrenset : false,
    },
  });

  const {
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
    register,
  } = methods;
  const harDokumentasjonOgFravaerRisiko = watch('harDokumentasjonOgFravaerRisiko');
  const åpenForRedigering = watch('åpenForRedigering');
  const erTidsbegrenset = watch('erTidsbegrenset');
  const formStateKey = `${behandlingsID}-utvidetrett-ks`;
  const { erDatoFyltUt, erDatoGyldig, erDatoIkkeIFremtid } = valideringsFunksjoner(
    getValues,
    'harDokumentasjonOgFravaerRisiko',
  );

  const erArsakErIkkeRiskioFraFravaer = val => {
    if (tekstTilBoolean(getValues().harDokumentasjonOgFravaerRisiko)) return true;
    return val !== null && val.length > 0;
  };

  const mellomlagringFormState = useFormSessionStorage(
    formStateKey,
    formState,
    methods.watch,
    methods.setValue,
    lesemodus,
    åpenForRedigering,
    getValues,
  );

  const bekreftAksjonspunkt = (data: FormData) => {
    if (
      !errors.begrunnelse &&
      !errors.avslagsårsakKode &&
      !errors.fraDato &&
      !errors.harDokumentasjonOgFravaerRisiko &&
      !errors.tilDato
    ) {
      losAksjonspunkt(
        tekstTilBoolean(data.harDokumentasjonOgFravaerRisiko),
        data.begrunnelse,
        data.avslagsårsakKode,
        tekstTilBoolean(harDokumentasjonOgFravaerRisiko) ? data.fraDato.replaceAll('.', '-') : '',
        data.erTidsbegrenset && data.tilDato ? data.tilDato : '',
        data.erTidsbegrenset,
      );
      setValue('åpenForRedigering', false);
      mellomlagringFormState.fjerneState();
    }
  };

  /**
   * Sjekker om barnet fyller 18 år i inneværende år eller er eldre.
   *
   * Denne funksjonen brukes for å avgjøre om checkboxen for tidsbegrenset vedtak skal vises.
   * Dersom barnet allerede fyller 18 år i inneværende år eller er eldre, skjules alternativet
   * for tidsbegrenset vedtak, siden vedtaket uansett bare varer til barnet fyller 18 år.
   *
   * @returns `true` hvis barnet fyller 18 år i inneværende år eller allerede er eldre,
   * `false` hvis fødselsdato mangler eller barnet er yngre enn 18 år i inneværende år.
   */
  const getErBarnetFyller18IÅr = (): boolean => {
    const fødselsdato = personopplysninger.pleietrengendePart?.fodselsdato;

    if (!fødselsdato) {
      return false;
    }

    const født = dayjs(fødselsdato);
    const inneværendeÅr = dayjs().year();
    const åretBarnetFyller18 = født.year() + 18;

    return åretBarnetFyller18 <= inneværendeÅr;
  };

  const kroniskTidsbegrensetToggle = !getErBarnetFyller18IÅr();

  /**
   * Genererer en liste med årssluttdatoer for tidsbegrensede perioder basert på barnets alder.
   *
   * Dersom barnets fødselsdato ikke er tilgjengelig, returneres en standard liste med 17 årssluttdatoer
   * som starter fra neste år.
   *
   * Dersom barnet fyller 17 år i inneværende år, returneres kun 31.12 dette året.
   * Ellers beregnes datoer frem til året før barnet fyller 18 år.
   *
   * @returns En array med ISO-datostrenger i formatet "YYYY-12-31", som representerer
   * 31. desember for hvert år i den tidsbegrensede perioden.
   */
  const hentTidsbegrensetÅrstallListe = (): string[] => {
    const nesteÅr = dayjs().year() + 1;
    const fødselsdato = personopplysninger.pleietrengendePart?.fodselsdato;

    if (!fødselsdato) {
      return Array.from({ length: 17 }, (_, index) => `${nesteÅr + index}-12-31`);
    }

    const født = dayjs(fødselsdato);
    const inneværendeÅr = dayjs().year();
    const åretBarnetFyller17 = født.year() + 17;
    const åretBarnetFyller18 = født.year() + 18;

    // Hvis barnet fyller 17 år i inneværende år, returner kun dette året
    if (åretBarnetFyller17 === inneværendeÅr) {
      return [`${inneværendeÅr}-12-31`];
    }

    // Ellers beregn fra neste år til året før barnet fyller 18
    const antallÅr = Math.max(1, åretBarnetFyller18 - nesteÅr);
    return Array.from({ length: antallÅr }, (_, index) => `${nesteÅr + index}-12-31`);
  };

  return (
    <div
      className={classNames(
        styles.vilkarKroniskSyktBarn,
        lesemodus && !åpenForRedigering && !vedtakFattetVilkarOppfylt && styleLesemodus.lesemodusboks,
      )}
    >
      {vedtakFattetVilkarOppfylt && (
        <VilkarStatus
          vilkarOppfylt={informasjonOmVilkar.vilkarOppfylt}
          aksjonspunktNavn={informasjonOmVilkar.navnPåAksjonspunkt}
          vilkarReferanse={informasjonOmVilkar.vilkar}
          begrunnelse={informasjonOmVilkar.begrunnelse}
          erVilkaretForOmsorgenFor={false}
        />
      )}

      {lesemodus && !åpenForRedigering && !vedtakFattetVilkarOppfylt && (
        <>
          <AksjonspunktLesemodus
            aksjonspunktTekst={tekst.instruksjon}
            harAksjonspunktBlivitLostTidligare={aksjonspunktLost}
            åpneForRedigereInformasjon={() => setValue('åpenForRedigering', true)}
          />

          {informasjonTilLesemodus.vilkarOppfylt && (
            <>
              <p className={styleLesemodus.label}>{tekst.soknadsdato}</p>
              <p className={styleLesemodus.text}>{formatereDatoTilLesemodus(soknadsdato)}</p>
            </>
          )}

          {typeof begrunnelseFraBruker !== 'undefined' && begrunnelseFraBruker.length > 0 && (
            <>
              <p className={styleLesemodus.label}>{tekst.begrunnelseFraBruker}</p>
              <p className={styleLesemodus.text}>{begrunnelseFraBruker}</p>
            </>
          )}

          <p className={styleLesemodus.label}>{tekst.sporsmalHarDokumentasjonOgFravaerRisiko}</p>
          <p className={styleLesemodus.text}>{informasjonTilLesemodus.vilkarOppfylt ? 'Ja' : 'Nei'}</p>

          {!informasjonTilLesemodus.vilkarOppfylt && (
            <>
              <p className={styleLesemodus.label}>{tekst.arsak}</p>
              <p className={styleLesemodus.text}>{mapTilAvslagstekst(informasjonTilLesemodus.avslagsårsakKode)}</p>
            </>
          )}

          {informasjonTilLesemodus.vilkarOppfylt && (
            <>
              <p className={styleLesemodus.label}>{tekst.sporsmalPeriodeVedtakGyldig}</p>
              <p className={styleLesemodus.text}>{formatereDatoTilLesemodus(informasjonTilLesemodus.fraDato)}</p>
              {kroniskTidsbegrensetToggle && (
                <>
                  <p className={styleLesemodus.label}>Er vedtaket tidsbegrenset?</p>
                  <p className={styleLesemodus.text}>{informasjonTilLesemodus?.erTidsbegrenset ? 'Ja' : 'Nei'}</p>
                </>
              )}
              {kroniskTidsbegrensetToggle && informasjonTilLesemodus?.erTidsbegrenset && (
                <>
                  <p className={styleLesemodus.label}>Til dato</p>
                  <p className={styleLesemodus.text}>{formatereDatoTilLesemodus(informasjonTilLesemodus.tilDato)}</p>
                </>
              )}
            </>
          )}

          <p className={styleLesemodus.label}>{tekst.begrunnelse}</p>
          <p className={styleLesemodus.fritekst}>{informasjonTilLesemodus.begrunnelse}</p>
        </>
      )}

      {(åpenForRedigering || (!lesemodus && !vedtakFattetVilkarOppfylt)) && (
        <>
          <Alert size="small" variant="warning" className="max-w-fit">
            {tekst.instruksjon}
          </Alert>
          <FormProvider {...methods}>
            <>
              <p className={styleLesemodus.label}>{tekst.soknadsdato}</p>
              <p className={styleLesemodus.text}>{formatereDatoTilLesemodus(soknadsdato)}</p>
            </>

            {typeof begrunnelseFraBruker !== 'undefined' && begrunnelseFraBruker.length > 0 && (
              <>
                <p className={styleLesemodus.label}>{tekst.begrunnelseFraBruker}</p>
                <p className={styleLesemodus.text}>{begrunnelseFraBruker}</p>
              </>
            )}

            <form className={styles.form} onSubmit={handleSubmit(bekreftAksjonspunkt)}>
              <TextArea label={tekst.begrunnelse} name="begrunnelse" />

              <div>
                <RadioGroup
                  className={styleRadioknapper.horisontalPlassering}
                  legend={tekst.sporsmalHarDokumentasjonOgFravaerRisiko}
                  size="small"
                  name="harDokumentasjonOgFravaerRisiko"
                >
                  <HStack gap="space-4">
                    <RadioButtonWithBooleanValue label="Ja" value="true" name="harDokumentasjonOgFravaerRisiko" />
                    <RadioButtonWithBooleanValue label="Nei" value="false" name="harDokumentasjonOgFravaerRisiko" />
                  </HStack>
                </RadioGroup>
                {errors.harDokumentasjonOgFravaerRisiko && (
                  <p className="typo-feilmelding">{tekst.feilOppgiHvisDokumentasjonGirRett}</p>
                )}
              </div>

              {harDokumentasjonOgFravaerRisiko.length > 0 && !tekstTilBoolean(harDokumentasjonOgFravaerRisiko) && (
                <div>
                  <RadioGroup
                    className={styleRadioknapper.horisontalPlassering}
                    legend={tekst.velgArsak}
                    size="small"
                    name="avslagsårsakKode"
                  >
                    <HStack gap="space-4">
                      <RadioButtonWithBooleanValue
                        label={tekst.arsakIkkeSyk}
                        value={AvslagskoderKroniskSyk.IKKE_KRONISK_SYK_ELLER_FUNKSJONSHEMMET}
                        name="avslagsårsakKode"
                        valideringsFunksjoner={erArsakErIkkeRiskioFraFravaer}
                      />
                      <RadioButtonWithBooleanValue
                        label={tekst.arsakIkkeRisikoFraFravaer}
                        value={AvslagskoderKroniskSyk.IKKE_OKT_RISIKO_FRA_FRAVAER}
                        name="avslagsårsakKode"
                        valideringsFunksjoner={erArsakErIkkeRiskioFraFravaer}
                      />
                      <RadioButtonWithBooleanValue
                        label={tekst.arsakManglerDokumentasjon}
                        value={AvslagskoderKroniskSyk.MANGLENDE_DOKUMENTASJON}
                        name="avslagsårsakKode"
                        valideringsFunksjoner={erArsakErIkkeRiskioFraFravaer}
                      />
                    </HStack>
                  </RadioGroup>
                  {errors.avslagsårsakKode && <p className="typo-feilmelding">{tekst.feilOppgiÅrsak}</p>}
                </div>
              )}

              {harDokumentasjonOgFravaerRisiko.length > 0 && tekstTilBoolean(harDokumentasjonOgFravaerRisiko) && (
                <div>
                  <VStack gap="space-8">
                    <div>
                      <Fieldset
                        legend={tekst.sporsmalPeriodeVedtakGyldig}
                        error={
                          (errors.fraDato &&
                            errors.fraDato.type === 'erDatoFyltUt' &&
                            tekst.feilmedlingManglerFraDato) ||
                          (errors.fraDato && errors.fraDato.type === 'erDatoGyldig' && tekst.feilmedlingUgyldigDato) ||
                          (errors.fraDato &&
                            errors.fraDato.type === 'erDatoIkkeIFremtid' &&
                            tekst.feilmedlingerDatoIkkeIFremtid)
                        }
                      >
                        <DatePicker
                          titel=""
                          navn="fraDato"
                          valideringsFunksjoner={{
                            erDatoFyltUt,
                            erDatoGyldig,
                            erDatoIkkeIFremtid,
                          }}
                        />
                      </Fieldset>
                    </div>
                    {kroniskTidsbegrensetToggle && (
                      <>
                        <HStack gap="space-8" align="center">
                          <Checkbox {...register('erTidsbegrenset')}>Vedtaket er tidsbegrenset</Checkbox>
                          <HelpText>
                            Her "huker du av" dersom vedtaket skal være tidsbegrenset. Når det ikke "hukes av" her, så
                            varer vedtaket ut det kalenderåret barnet fyller 18 år.
                          </HelpText>
                        </HStack>
                        {erTidsbegrenset && (
                          <HStack marginBlock="0 4">
                            <Select
                              {...register('tilDato', {
                                validate: { erDatoFyltUt },
                                required: true,
                              })}
                              label="Til"
                              size="small"
                            >
                              {hentTidsbegrensetÅrstallListe().map(årstall => (
                                <option key={årstall} value={årstall}>
                                  {dayjs(årstall).format('DD.MM.YYYY')}
                                </option>
                              ))}
                            </Select>
                          </HStack>
                        )}
                      </>
                    )}
                  </VStack>
                </div>
              )}

              <Button size="small" variant="primary" type="submit">
                Bekreft og fortsett
              </Button>
            </form>
          </FormProvider>
        </>
      )}
    </div>
  );
};
export default VilkarKroniskSyktBarn;
