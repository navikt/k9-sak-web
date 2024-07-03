import { Alert, Button, Fieldset, HStack, RadioGroup } from '@navikt/ds-react';
import classNames from 'classnames';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { VilkarMidlertidigAleneProps } from '../../../types/VilkarMidlertidigAleneProps';
import { hanteringAvDatoForDatoVelger } from '../../../util/dateUtils';
import { booleanTilTekst, tekstTilBoolean } from '../../../util/stringUtils';
import useFormSessionStorage from '../../../util/useFormSessionStorageUtils';
import { valideringsFunksjoner } from '../../../util/validationReactHookFormUtils';
import styleLesemodus from '../lesemodus/lesemodusboks.module.css';
import OpplysningerFraSoknad from '../opplysninger-fra-soknad/OpplysningerFraSoknad';
import DatePicker from '../react-hook-form-wrappers/DatePicker';
import RadioButtonWithBooleanValue from '../react-hook-form-wrappers/RadioButton';
import TextArea from '../react-hook-form-wrappers/TextArea';
import styleRadioknapper from '../styles/radioknapper/radioknapper.module.css';
import VilkarMidlertidigAleneLesemodus from '../vilkar-midlertidig-alene-lesemodus/VilkarMidlertidigAleneLesemodus';
import VilkarStatus from '../vilkar-status/VilkarStatus';
import tekst from './vilkar-midlertidig-alene-tekst';
import styles from './vilkarMidlertidigAlene.module.css';

type FormData = {
  begrunnelse: string;
  fraDato: string;
  tilDato: string;
  erSokerenMidlertidigAleneOmOmsorgen: string;
  avslagsårsakKode: string;
  åpenForRedigering: boolean;
};

export enum AvslagskoderMidlertidigAlene {
  REGNES_IKKE_SOM_Å_HA_ALENEOMSORG = '1076',
  VARIGHET_UNDER_SEKS_MÅN = '1075',
  ANNET = '1093'
}

const VilkarMidlertidigAlene: React.FunctionComponent<VilkarMidlertidigAleneProps> = ({
  behandlingsID,
  aksjonspunktLost,
  lesemodus,
  soknadsopplysninger,
  informasjonTilLesemodus,
  vedtakFattetVilkarOppfylt,
  informasjonOmVilkar,
  losAksjonspunkt,
  formState,
}) => {
  const [harAksjonspunktBlivitLostTidligare] = useState<boolean>(aksjonspunktLost);
  const formStateKey = `${behandlingsID}-utvidetrett-ma`;
  const harAksjonspunktOgVilkarLostTidligere =
    informasjonTilLesemodus.begrunnelse.length > 0 &&
    informasjonTilLesemodus.dato.til.length > 0 &&
    informasjonTilLesemodus.dato.fra.length > 0;

  const methods = useForm<FormData>({
    reValidateMode: 'onSubmit',
    defaultValues: {
      begrunnelse: harAksjonspunktOgVilkarLostTidligere ? informasjonTilLesemodus.begrunnelse : '',
      fraDato: harAksjonspunktOgVilkarLostTidligere
        ? informasjonTilLesemodus.dato.fra
        : soknadsopplysninger.soknadsdato,
      tilDato: harAksjonspunktOgVilkarLostTidligere ? informasjonTilLesemodus.dato.til : 'dd.mm.åååå',
      erSokerenMidlertidigAleneOmOmsorgen: harAksjonspunktOgVilkarLostTidligere
        ? booleanTilTekst(informasjonTilLesemodus.vilkarOppfylt)
        : '',
      avslagsårsakKode: harAksjonspunktOgVilkarLostTidligere
        ? informasjonTilLesemodus.avslagsårsakKode
        : '',
      åpenForRedigering: false,
    },
  });

  const {
    formState: { errors },
    getValues,
    handleSubmit,
    watch,
    setValue,
  } = methods;
  const sokerenMidlertidigAleneOmOmsorgen = watch('erSokerenMidlertidigAleneOmOmsorgen');
  const åpenForRedigering = watch('åpenForRedigering');

  const { erDatoFyltUt, erDatoGyldig, erDatoSisteDagenIÅret } =
    valideringsFunksjoner(getValues, 'erSokerenMidlertidigAleneOmOmsorgen');

  const mellomlagringFormState = useFormSessionStorage(
    formStateKey,
    formState,
    methods.watch,
    methods.setValue,
    lesemodus,
    åpenForRedigering,
    getValues,
  );

  const bekreftAksjonspunkt = ({
    begrunnelse,
    erSokerenMidlertidigAleneOmOmsorgen,
    avslagsårsakKode,
    fraDato,
    tilDato,
  }) => {
    if (
      !errors.begrunnelse &&
      !errors.fraDato &&
      !errors.tilDato &&
      !errors.erSokerenMidlertidigAleneOmOmsorgen &&
      !errors.avslagsårsakKode
    ) {
      losAksjonspunkt({
        begrunnelse,
        erSokerenMidlertidigAleneOmOmsorgen: tekstTilBoolean(erSokerenMidlertidigAleneOmOmsorgen),
        fra: tekstTilBoolean(erSokerenMidlertidigAleneOmOmsorgen) ? fraDato.replaceAll('.', '-') : '',
        til: tekstTilBoolean(erSokerenMidlertidigAleneOmOmsorgen) ? tilDato.replaceAll('.', '-') : '',
        avslagsårsakKode,
      });
      setValue('åpenForRedigering', false);
      mellomlagringFormState.fjerneState();
    }
  };

  return (
    <div
      className={classNames(
        styles.vilkarMidlerTidigAlene,
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
        <VilkarMidlertidigAleneLesemodus
          soknadsopplysninger={soknadsopplysninger}
          informasjonTilLesemodus={informasjonTilLesemodus}
          harAksjonspunktBlivitLostTidligare={harAksjonspunktBlivitLostTidligare}
          åpneForRedigereInformasjon={() => setValue('åpenForRedigering', true)}
        />
      )}

      {(åpenForRedigering || (!lesemodus && !vedtakFattetVilkarOppfylt)) && (
        <>
          <Alert size="small" variant="warning">
            {tekst.aksjonspunkt}
          </Alert>

          <OpplysningerFraSoknad periodeTekst="Oppgitt periode" {...soknadsopplysninger} />

          <FormProvider {...methods}>
            <form className={styles.form} onSubmit={handleSubmit(bekreftAksjonspunkt)}>
              <TextArea label={tekst.begrunnelse} name="begrunnelse" />

              <div>
                <RadioGroup
                  className={styleRadioknapper.horisontalPlassering}
                  legend={tekst.sporsmålVilkarOppfylt}
                  size="small"
                  name="erSokerenMidlertidigAleneOmOmsorgen"
                >
                  <HStack gap="1">
                    <RadioButtonWithBooleanValue label="Ja" value="true" name="erSokerenMidlertidigAleneOmOmsorgen" />
                    <RadioButtonWithBooleanValue label="Nei" value="false" name="erSokerenMidlertidigAleneOmOmsorgen" />
                  </HStack>
                </RadioGroup>
                {errors.erSokerenMidlertidigAleneOmOmsorgen && (
                  <p className="typo-feilmelding">{tekst.feilIngenVurdering}</p>
                )}
              </div>

              {sokerenMidlertidigAleneOmOmsorgen !== null &&
                sokerenMidlertidigAleneOmOmsorgen.length > 0 &&
                !tekstTilBoolean(sokerenMidlertidigAleneOmOmsorgen) && (
                  <div>
                    <RadioGroup
                      className={classNames(
                        styleRadioknapper.horisontalPlassering,
                        styles.avslagsårsakKode,
                      )}
                      legend={tekst.velgArsak}
                      size="small"
                      name="avslagsårsakKode"
                    >
                      <HStack gap="1">
                        <RadioButtonWithBooleanValue
                          label={tekst.arsakIkkeAleneOmsorg}
                          value={AvslagskoderMidlertidigAlene.REGNES_IKKE_SOM_Å_HA_ALENEOMSORG}
                          name="avslagsårsakKode"
                        />
                        <RadioButtonWithBooleanValue
                          label={tekst.arsakPeriodeIkkeOverSeksMån}
                          value={AvslagskoderMidlertidigAlene.VARIGHET_UNDER_SEKS_MÅN}
                          name="avslagsårsakKode"
                        />
                        <RadioButtonWithBooleanValue
                          label={tekst.arsakIkkeAleneOmsorgAnnet}
                          value={AvslagskoderMidlertidigAlene.ANNET}
                          name="avslagsårsakKode"
                        />
                      </HStack>
                    </RadioGroup>
                  </div>
                )}

              {tekstTilBoolean(sokerenMidlertidigAleneOmOmsorgen) && (
                <Fieldset
                  className={styles.gyldigVedtaksPeriode}
                  legend={tekst.sporsmalPeriodeVedtakGyldig}
                  error={
                    (errors.fraDato && errors.fraDato.type === 'erDatoFyltUt' && tekst.feilmedlingManglerFraDato) ||
                    (errors.fraDato && errors.fraDato.type === 'erDatoGyldig' && tekst.feilmedlingUgyldigDato) ||
                    (errors.tilDato && errors.tilDato.type === 'erDatoFyltUt' && tekst.feilmeldingManglerTilDato) ||
                    (errors.tilDato && errors.tilDato.type === 'erDatoSisteDagenIÅret' && tekst.feilmedlingFeilDato) ||
                    (errors.tilDato && errors.tilDato.type === 'erDatoGyldig' && tekst.feilmedlingUgyldigDato)
                  }
                >
                  <DatePicker titel="Fra" navn="fraDato" valideringsFunksjoner={{ erDatoFyltUt, erDatoGyldig }} />

                  <DatePicker
                    titel="Til"
                    navn="tilDato"
                    valideringsFunksjoner={{ erDatoFyltUt, erDatoGyldig, erDatoSisteDagenIÅret }}
                    begrensningerIKalender={hanteringAvDatoForDatoVelger(soknadsopplysninger.soknadsdato)}
                  />
                </Fieldset>
              )}

              <Button size="small" variant="primary" className={styles.bekreftKnapp} type="submit">
                {' '}
                {tekst.bekreftFortsettKnapp}
              </Button>
            </form>
          </FormProvider>
        </>
      )}
    </div>
  );
};
export default VilkarMidlertidigAlene;
