import { Alert, Button, Fieldset, HStack, RadioGroup } from '@navikt/ds-react';
import classNames from 'classnames';
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
    },
  });

  const {
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
  } = methods;
  const harDokumentasjonOgFravaerRisiko = watch('harDokumentasjonOgFravaerRisiko');
  const åpenForRedigering = watch('åpenForRedigering');
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

  const bekreftAksjonspunkt = data => {
    if (!errors.begrunnelse && !errors.avslagsårsakKode && !errors.fraDato && !errors.harDokumentasjonOgFravaerRisiko) {
      losAksjonspunkt(
        tekstTilBoolean(data.harDokumentasjonOgFravaerRisiko),
        data.begrunnelse,
        data.avslagsårsakKode,
        tekstTilBoolean(harDokumentasjonOgFravaerRisiko) ? data.fraDato.replaceAll('.', '-') : '',
      );
      setValue('åpenForRedigering', false);
      mellomlagringFormState.fjerneState();
    }
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

            <form className={styles.form} onSubmit={handleSubmit(bekreftAksjonspunkt)}>
              <TextArea label={tekst.begrunnelse} name="begrunnelse" />

              <div>
                <RadioGroup
                  className={styleRadioknapper.horisontalPlassering}
                  legend={tekst.sporsmalHarDokumentasjonOgFravaerRisiko}
                  size="small"
                  name="harDokumentasjonOgFravaerRisiko"
                >
                  <HStack gap="1">
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
                    <HStack gap="1">
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
                  <Fieldset
                    className={styles.fraDato}
                    legend={tekst.sporsmalPeriodeVedtakGyldig}
                    error={
                      (errors.fraDato && errors.fraDato.type === 'erDatoFyltUt' && tekst.feilmedlingManglerFraDato) ||
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
