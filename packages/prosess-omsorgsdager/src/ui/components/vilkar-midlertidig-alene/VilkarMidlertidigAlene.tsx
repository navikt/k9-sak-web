import { Alert, Button, Fieldset, RadioGroup } from '@navikt/ds-react';
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
  avslagsArsakErPeriodeErIkkeOverSeksMån: string;
  åpenForRedigering: boolean;
};

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
      avslagsArsakErPeriodeErIkkeOverSeksMån: harAksjonspunktOgVilkarLostTidligere
        ? booleanTilTekst(informasjonTilLesemodus.avslagsArsakErPeriodeErIkkeOverSeksMån)
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

  const { erDatoFyltUt, erDatoGyldig, erAvslagsArsakErPeriodeErIkkeOverSeksMånGyldig, erDatoSisteDagenIÅret } =
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
    avslagsArsakErPeriodeErIkkeOverSeksMån,
    fraDato,
    tilDato,
  }) => {
    if (
      !errors.begrunnelse &&
      !errors.fraDato &&
      !errors.tilDato &&
      !errors.erSokerenMidlertidigAleneOmOmsorgen &&
      !errors.avslagsArsakErPeriodeErIkkeOverSeksMån
    ) {
      losAksjonspunkt({
        begrunnelse,
        erSokerenMidlertidigAleneOmOmsorgen: tekstTilBoolean(erSokerenMidlertidigAleneOmOmsorgen),
        fra: tekstTilBoolean(erSokerenMidlertidigAleneOmOmsorgen) ? fraDato.replaceAll('.', '-') : '',
        til: tekstTilBoolean(erSokerenMidlertidigAleneOmOmsorgen) ? tilDato.replaceAll('.', '-') : '',
        avslagsArsakErPeriodeErIkkeOverSeksMån: tekstTilBoolean(avslagsArsakErPeriodeErIkkeOverSeksMån),
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
                <RadioGroup className={styleRadioknapper.horisontalPlassering} legend={tekst.sporsmålVilkarOppfylt}>
                  <RadioButtonWithBooleanValue label="Ja" value="true" name="erSokerenMidlertidigAleneOmOmsorgen" />
                  <RadioButtonWithBooleanValue label="Nei" value="false" name="erSokerenMidlertidigAleneOmOmsorgen" />
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
                        styles.avslagsArsakErPeriodeErIkkeOverSeksMån,
                      )}
                      legend={tekst.velgArsak}
                    >
                      <RadioButtonWithBooleanValue
                        label={tekst.arsakIkkeAleneOmsorg}
                        value="false"
                        name="avslagsArsakErPeriodeErIkkeOverSeksMån"
                        valideringsFunksjoner={erAvslagsArsakErPeriodeErIkkeOverSeksMånGyldig}
                      />
                      <RadioButtonWithBooleanValue
                        label={tekst.arsakPeriodeIkkeOverSeksMån}
                        value="true"
                        name="avslagsArsakErPeriodeErIkkeOverSeksMån"
                        valideringsFunksjoner={erAvslagsArsakErPeriodeErIkkeOverSeksMånGyldig}
                      />
                    </RadioGroup>
                    {errors.avslagsArsakErPeriodeErIkkeOverSeksMån && (
                      <p className="typo-feilmelding">{tekst.feilIngenÅrsak}</p>
                    )}
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

              <Button variant="primary" className={styles.bekreftKnapp} type="submit">
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
