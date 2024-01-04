import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import classNames from 'classnames';
import dayjs from 'dayjs';

import { Label } from '@navikt/ds-react';
import { Hovedknapp } from 'nav-frontend-knapper';
import { RadioGruppe, Select, SkjemaGruppe } from 'nav-frontend-skjema';

import useFormSessionStorage from '../../../util/useFormSessionStorageUtils';
import { valideringsFunksjoner } from '../../../util/validationReactHookFormUtils';
import AleneOmOmsorgenLesemodus from '../alene-om-omsorgen-lesemodus/AleneOmOmsorgenLesemodus';
import AlertStripeTrekantVarsel from '../alertstripe-trekant-varsel/AlertStripeTrekantVarsel';
import styleLesemodus from '../lesemodus/lesemodusboks.css';
import OpplysningerFraSoknad from '../opplysninger-fra-soknad/OpplysningerFraSoknad';
import DatePicker from '../react-hook-form-wrappers/DatePicker';
import RadioButtonWithBooleanValue from '../react-hook-form-wrappers/RadioButton';
import TextArea from '../react-hook-form-wrappers/TextArea';
import VilkarStatus from '../vilkar-status/VilkarStatus';
import tekst from './alene-om-omsorgen-tekst';
import {
  booleanTilTekst,
  formatereDato,
  formatereDatoTilLesemodus,
  tekstTilBoolean,
  utledTilgjengeligeÅr,
} from '../../../util/stringUtils';
import { AleneOmOmsorgenProps } from '../../../types/AleneOmOmsorgenProps';

import styles from '../vilkar-midlertidig-alene/vilkarMidlertidigAlene.css';
import styleRadioknapper from '../styles/radioknapper/radioknapper.css';

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
  fraDatoFraSoknad,
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
  const tilDatovalue = watch('tilDato');

  const { erDatoFyltUt, erDatoGyldig } = valideringsFunksjoner(getValues, 'erSokerenAleneOmOmsorgen');

  useEffect(() => {
    if (tekstTilBoolean(erSokerAleneOmOmsorgen)) {
      setValue('fraDato', formatereDato(fraDatoFraSoknad));
    }
  }, [erSokerAleneOmOmsorgen, fraDatoFraSoknad]);

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
          fraDatoFraSoknad={fraDatoFraSoknad}
          informasjonTilLesemodus={informasjonTilLesemodus}
          harAksjonspunktBlivitLostTidligare={aksjonspunktLost}
          åpneForRedigereInformasjon={() => setValue('åpenForRedigering', true)}
          erBehandlingstypeRevurdering={erBehandlingstypeRevurdering}
        />
      )}

      {(åpenForRedigering || (!lesemodus && !vedtakFattetVilkarOppfylt)) && (
        <>
          <AlertStripeTrekantVarsel text={tekst.aksjonspunkt} />

          <OpplysningerFraSoknad
            periodeTekst="Fra dato oppgitt"
            periode={formatereDatoTilLesemodus(fraDatoFraSoknad)}
          />

          <FormProvider {...methods}>
            <form className={styles.form} onSubmit={handleSubmit(bekreftAksjonspunkt)}>
              <TextArea label={tekst.begrunnelse} name="begrunnelse" />

              <div>
                <RadioGruppe className={styleRadioknapper.horisontalPlassering} legend={tekst.sporsmålVilkarOppfylt}>
                  <RadioButtonWithBooleanValue label="Ja" value="true" name="erSokerenAleneOmOmsorgen" />
                  <RadioButtonWithBooleanValue label="Nei" value="false" name="erSokerenAleneOmOmsorgen" />
                </RadioGruppe>
                {errors.erSokerenAleneOmOmsorgen && <p className="typo-feilmelding">{tekst.feilIngenVurdering}</p>}
              </div>

              {tekstTilBoolean(erSokerAleneOmOmsorgen) && (
                <SkjemaGruppe
                  className={
                    erBehandlingstypeRevurdering
                      ? styles.gyldigVedtaksPeriode
                      : styles.gyldigVedtaksPeriode_forstegangsbehandling_aleneOmOmsorgen
                  }
                  legend={tekst.sporsmalPeriodeVedtakGyldig}
                  feil={
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
                    <>
                      <Select
                        label="Til"
                        onChange={settTilDatoFraÅr}
                        defaultValue={
                          informasjonTilLesemodus.tilDato ? dayjs(informasjonTilLesemodus.tilDato).year() : '0'
                        }
                      >
                        {utledTilgjengeligeÅr(fraDatoFraSoknad).map(år => (
                          <option key={år.value} value={år.value} disabled={år.disabled}>
                            {år.title}
                          </option>
                        ))}
                      </Select>
                      {tilDatovalue !== 'dd.mm.åååå' && tilDatovalue !== 'false' && (
                        <Label as="p" className={styles.tilDatoVisning}>
                          {dayjs(tilDatovalue).format('DD.MM.YYYY')}
                        </Label>
                      )}
                    </>
                  )}
                </SkjemaGruppe>
              )}
              <Hovedknapp className={styles.bekreftKnapp} htmlType="submit">
                {' '}
                {tekst.bekreftFortsettKnapp}
              </Hovedknapp>
            </form>
          </FormProvider>
        </>
      )}
    </div>
  );
};
export default AleneOmOmsorgen;
