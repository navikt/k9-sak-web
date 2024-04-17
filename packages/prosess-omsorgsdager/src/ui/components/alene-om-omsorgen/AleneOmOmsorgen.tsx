import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Alert, Button, Fieldset, RadioGroup, Select } from '@navikt/ds-react';
import { AleneOmOmsorgenProps } from '../../../types/AleneOmOmsorgenProps';
import {
  booleanTilTekst,
  formatereDato,
  formatereDatoTilLesemodus,
  tekstTilBoolean,
  utledTilgjengeligeÅr,
} from '../../../util/stringUtils';
import useFormSessionStorage from '../../../util/useFormSessionStorageUtils';
import { valideringsFunksjoner } from '../../../util/validationReactHookFormUtils';
import AleneOmOmsorgenLesemodus from '../alene-om-omsorgen-lesemodus/AleneOmOmsorgenLesemodus';
import styleLesemodus from '../lesemodus/lesemodusboks.module.css';
import OpplysningerFraSoknad from '../opplysninger-fra-soknad/OpplysningerFraSoknad';
import DatePicker from '../react-hook-form-wrappers/DatePicker';
import RadioButtonWithBooleanValue from '../react-hook-form-wrappers/RadioButton';
import TextArea from '../react-hook-form-wrappers/TextArea';
import styleRadioknapper from '../styles/radioknapper/radioknapper.module.css';
import styles from '../vilkar-midlertidig-alene/vilkarMidlertidigAlene.module.css';
import VilkarStatus from '../vilkar-status/VilkarStatus';
import tekst from './alene-om-omsorgen-tekst';

type FormData = {
  begrunnelse: string;
  fraDato: string;
  tilDato: string;
  erSokerenAleneOmOmsorgen: string;
  åpenForRedigering: boolean;
};

const AleneOmOmsorgen: React.FunctionComponent<AleneOmOmsorgenProps> = ({
  behandlingsID,
  aksjonspunktLost,
  lesemodus,
  fraDatoFraVilkar,
  informasjonTilLesemodus,
  vedtakFattetVilkarOppfylt,
  erBehandlingstypeRevurdering,
  informasjonOmVilkar,
  losAksjonspunkt,
  formState,
}) => {
  const formStateKey = `${behandlingsID}-utvidetrett-alene-om-omsorgen`;
  const harAksjonspunktOgVilkarLostTidligere =
    informasjonTilLesemodus?.fraDato.length > 0 && informasjonTilLesemodus?.begrunnelse.length > 0;

  const methods = useForm<FormData>({
    reValidateMode: 'onSubmit',
    defaultValues: {
      begrunnelse: harAksjonspunktOgVilkarLostTidligere ? informasjonTilLesemodus.begrunnelse : '',
      fraDato: harAksjonspunktOgVilkarLostTidligere ? formatereDato(informasjonTilLesemodus.fraDato) : 'dd.mm.åååå',
      tilDato: harAksjonspunktOgVilkarLostTidligere ? formatereDato(informasjonTilLesemodus.tilDato) : 'dd.mm.åååå',
      erSokerenAleneOmOmsorgen: harAksjonspunktOgVilkarLostTidligere
        ? booleanTilTekst(informasjonTilLesemodus.vilkarOppfylt)
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
  const erSokerAleneOmOmsorgen = watch('erSokerenAleneOmOmsorgen');
  const åpenForRedigering = watch('åpenForRedigering');

  const { erDatoFyltUt, erDatoGyldig } = valideringsFunksjoner(getValues, 'erSokerenAleneOmOmsorgen');

  useEffect(() => {
    if (tekstTilBoolean(erSokerAleneOmOmsorgen)) {
      setValue('fraDato', formatereDato(fraDatoFraVilkar));
    }
  }, [erSokerAleneOmOmsorgen, fraDatoFraVilkar]);

  const settTilDatoFraÅr = (e: any) => {
    setValue('tilDato', e.target.value === 'false' ? 'false' : `${e.target.value}.12.31`);
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

  const bekreftAksjonspunkt = ({ begrunnelse, erSokerenAleneOmOmsorgen, fraDato, tilDato }) => {
    if (
      (!errors.begrunnelse && !errors.fraDato && !errors.erSokerenAleneOmOmsorgen && !erBehandlingstypeRevurdering) ||
      (!errors.begrunnelse &&
        !errors.fraDato &&
        !errors.tilDato &&
        !errors.erSokerenAleneOmOmsorgen &&
        erBehandlingstypeRevurdering)
    ) {
      losAksjonspunkt({
        begrunnelse,
        vilkarOppfylt: tekstTilBoolean(erSokerenAleneOmOmsorgen),
        fraDato: tekstTilBoolean(erSokerenAleneOmOmsorgen) ? fraDato.replaceAll('.', '-') : '',
        tilDato: tilDato.replaceAll('.', '-'),
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
          periode={informasjonOmVilkar.periode}
        />
      )}

      {lesemodus && !åpenForRedigering && !vedtakFattetVilkarOppfylt && (
        <AleneOmOmsorgenLesemodus
          fraDatoFraSoknad={fraDatoFraVilkar}
          informasjonTilLesemodus={informasjonTilLesemodus}
          harAksjonspunktBlivitLostTidligare={aksjonspunktLost}
          åpneForRedigereInformasjon={() => setValue('åpenForRedigering', true)}
          erBehandlingstypeRevurdering={erBehandlingstypeRevurdering}
        />
      )}

      {(åpenForRedigering || (!lesemodus && !vedtakFattetVilkarOppfylt)) && (
        <>
          <Alert size="small" variant="warning">
            {tekst.aksjonspunkt}
          </Alert>

          <OpplysningerFraSoknad
            periodeTekst="Fra dato oppgitt"
            periode={formatereDatoTilLesemodus(fraDatoFraVilkar)}
          />

          <FormProvider {...methods}>
            <form className={styles.form} onSubmit={handleSubmit(bekreftAksjonspunkt)}>
              <TextArea label={tekst.begrunnelse} name="begrunnelse" />

              <div>
                <RadioGroup
                  className={styleRadioknapper.horisontalPlassering}
                  legend={tekst.sporsmålVilkarOppfylt}
                  size="small"
                >
                  <RadioButtonWithBooleanValue label="Ja" value="true" name="erSokerenAleneOmOmsorgen" />
                  <RadioButtonWithBooleanValue label="Nei" value="false" name="erSokerenAleneOmOmsorgen" />
                </RadioGroup>
                {errors.erSokerenAleneOmOmsorgen && <p className="typo-feilmelding">{tekst.feilIngenVurdering}</p>}
              </div>

              {tekstTilBoolean(erSokerAleneOmOmsorgen) && (
                <Fieldset
                  className={
                    erBehandlingstypeRevurdering
                      ? styles.gyldigVedtaksPeriode
                      : styles.gyldigVedtaksPeriode_forstegangsbehandling_aleneOmOmsorgen
                  }
                  legend={tekst.sporsmalPeriodeVedtakGyldig}
                  error={
                    (errors.fraDato && errors.fraDato.type === 'erDatoFyltUt' && tekst.feilmedlingManglerFraDato) ||
                    (errors.fraDato && errors.fraDato.type === 'erDatoGyldig' && tekst.feilmedlingUgyldigDato) ||
                    (erBehandlingstypeRevurdering &&
                      errors.tilDato &&
                      errors.tilDato.type === 'erDatoFyltUt' &&
                      tekst.feilmeldingManglerTilDato) ||
                    (erBehandlingstypeRevurdering &&
                      errors.tilDato &&
                      errors.tilDato.type === 'erDatoGyldig' &&
                      tekst.feilmedlingUgyldigDato)
                  }
                >
                  <DatePicker
                    titel="Fra"
                    navn="fraDato"
                    valideringsFunksjoner={{ erDatoFyltUt, erDatoGyldig }}
                    disabled={erBehandlingstypeRevurdering}
                  />

                  {erBehandlingstypeRevurdering && (
                    <Select
                      label="Til"
                      onChange={settTilDatoFraÅr}
                      defaultValue={
                        informasjonTilLesemodus.tilDato ? dayjs(informasjonTilLesemodus.tilDato).year() : '0'
                      }
                      size="small"
                    >
                      {utledTilgjengeligeÅr(fraDatoFraVilkar).map(år => (
                        <option key={år.value} value={år.value} disabled={år.disabled}>
                          {år.title}
                        </option>
                      ))}
                    </Select>
                  )}
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
export default AleneOmOmsorgen;
