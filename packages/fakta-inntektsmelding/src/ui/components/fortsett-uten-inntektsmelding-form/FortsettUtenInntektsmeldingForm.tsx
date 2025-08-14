/* eslint-disable jsx-a11y/label-has-associated-control */
import { Alert, Box, Button, Heading } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import React, { type JSX } from 'react';
import { UseFormReturn } from 'react-hook-form';
import ContainerContext from '../../../context/ContainerContext';
import Aksjonspunkt from '../../../types/Aksjonspunkt';
import AksjonspunktRequestPayload, { Perioder } from '../../../types/AksjonspunktRequestPayload';
import { Kode, TilstandBeriket } from '../../../types/KompletthetData';
import TilstandStatus from '../../../types/TilstandStatus';
import { skalVurderes } from '../../../util/utils';
import styles from './fortsettUtenInntektsMeldingForm.module.css';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';

export interface FortsettUtenInntektsmeldingFormState {
  begrunnelse: string;
  beslutning: string;
}

interface FortsettUtenInntektsmeldingFormProps {
  tilstand: TilstandBeriket;
  onSubmit: (payload: AksjonspunktRequestPayload) => void;
  redigeringsmodus: boolean;
  aksjonspunkt: Aksjonspunkt;
  setRedigeringsmodus: (state: boolean) => void;
  formMethods: UseFormReturn;
  harFlereTilstanderTilVurdering: boolean;
}

const FortsettUtenInntektsmeldingForm = ({
  onSubmit,
  tilstand,
  redigeringsmodus,
  setRedigeringsmodus,
  aksjonspunkt,
  formMethods,
  harFlereTilstanderTilVurdering,
}: FortsettUtenInntektsmeldingFormProps): JSX.Element => {
  const featureToggles = React.useContext(FeatureTogglesContext);
  const containerContext = React.useContext(ContainerContext);
  const arbeidsforhold = containerContext?.arbeidsforhold ?? {};
  const readOnly = containerContext?.readOnly ?? false;

  const { watch, reset, control } = formMethods;
  const { beslutningFieldName = 'beslutning', begrunnelseFieldName = 'begrunnelse' } = tilstand;
  const beslutningId = `beslutning-${tilstand.periodeOpprinneligFormat}`;
  const begrunnelseId = `begrunnelse-${tilstand.periodeOpprinneligFormat}`;
  const beslutningRaw = watch(beslutningFieldName);
  const beslutning = Array.isArray(beslutningRaw) ? beslutningRaw[0] : beslutningRaw;
  const aksjonspunktKode = aksjonspunkt?.definisjon?.kode;
  const vis = ((skalVurderes(tilstand) && !readOnly) || redigeringsmodus) && aksjonspunkt && tilstand.tilVurdering;
  const skalViseBegrunnelse = !(aksjonspunktKode === '9069' && beslutning !== Kode.FORTSETT);
  const fortsettKnappTekstFunc = {
    '9069': (kode: Kode) =>
      kode === Kode.FORTSETT ? 'Fortsett uten inntektsmelding' : 'Send purring med varsel om avslag',
    '9071': (kode: Kode) => {
      switch (kode) {
        case Kode.FORTSETT:
          return 'Fortsett uten inntektsmelding';
        case Kode.MANGLENDE_GRUNNLAG:
          return 'Avslå periode';
        case Kode.IKKE_INNTEKTSTAP:
        default:
          return 'Avslå søknad';
      }
    },
  };
  const arbeidsgivereMedManglendeInntektsmelding = tilstand.status.filter(s => s.status === TilstandStatus.MANGLER);

  let arbeidsgivereString = '';
  const formatArbeidsgiver = arbeidsgiver =>
    `${arbeidsforhold[arbeidsgiver.arbeidsgiver]?.navn} (${arbeidsgiver.arbeidsforhold})`;
  arbeidsgivereMedManglendeInntektsmelding.forEach(({ arbeidsgiver }, index) => {
    if (index === 0) {
      arbeidsgivereString = formatArbeidsgiver(arbeidsgiver);
    } else if (index === arbeidsgivereMedManglendeInntektsmelding.length - 1) {
      arbeidsgivereString = `${arbeidsgivereString} og ${formatArbeidsgiver(arbeidsgiver)}`;
    } else {
      arbeidsgivereString = `${arbeidsgivereString}, ${formatArbeidsgiver(arbeidsgiver)}`;
    }
  });

  const submit = data => {
    const periode: Perioder = {
      begrunnelse: skalViseBegrunnelse ? data[begrunnelseFieldName] : null,
      periode: tilstand.periodeOpprinneligFormat,
      fortsett: data[beslutningFieldName] === Kode.FORTSETT,
      kode: aksjonspunktKode,
    };

    if (featureToggles.AKTIVER_AVSLAG_IKKE_INNTEKTSTAP) {
      periode.vurdering = data[beslutningFieldName];
    }

    return onSubmit({
      '@type': aksjonspunktKode,
      kode: aksjonspunktKode,
      begrunnelse: skalViseBegrunnelse ? data[begrunnelseFieldName] : null,
      perioder: [periode],
    });
  };

  const avbrytRedigering = () => {
    reset();
    setRedigeringsmodus(false);
  };

  const radios9071 = [
    {
      value: Kode.FORTSETT,
      label: `Ja, bruk A-inntekt for ${arbeidsgivereString}`,
      id: `${beslutningId}${Kode.FORTSETT}`,
    },
    {
      value: Kode.MANGLENDE_GRUNNLAG,
      label: featureToggles.AKTIVER_AVSLAG_IKKE_INNTEKTSTAP
        ? 'Nei, avslå på grunn av manglende opplysninger om inntekt.'
        : 'Nei, avslå periode på grunn av manglende inntektsopplysninger',
      id: `${beslutningId}${Kode.MANGLENDE_GRUNNLAG}`,
    },
  ];

  const radios = {
    '9069': [
      {
        value: Kode.FORTSETT,
        label: `Ja, bruk A-inntekt for ${arbeidsgivereString}`,
        id: `${beslutningId}${Kode.FORTSETT}`,
      },
      {
        value: Kode.MANGLENDE_GRUNNLAG,
        label: 'Nei, send purring med varsel om avslag',
        id: `${beslutningId}${Kode.MANGLENDE_GRUNNLAG}`,
      },
    ],
    '9071': featureToggles.AKTIVER_AVSLAG_IKKE_INNTEKTSTAP
      ? [
          ...radios9071,
          {
            value: Kode.IKKE_INNTEKTSTAP,
            label: 'Nei, avslå søknaden på grunn av at ansatt ikke har tapt arbeidsinntekt §9-3',
            id: `${beslutningId}${Kode.IKKE_INNTEKTSTAP}`,
          },
        ]
      : radios9071,
  };

  if (!vis) {
    return <></>;
  }

  return (
    <RhfForm formMethods={formMethods} onSubmit={submit}>
      <Box.New padding="4" className={styles.fortsettUtenInntektsmelding__panel}>
        <Heading level="3" size="xsmall">
          Kan du gå videre uten inntektsmelding?
        </Heading>
        <Alert className={styles.fortsettUtenInntektsmelding__radiogroupAlert} variant="info" size="medium">
          <ul>
            <li>
              A-inntekt benyttes <span className={styles.radiogroupAlert__emphasize}>kun</span> for de
              arbeidsgiverne/arbeidsforholdene vi mangler inntektsmelding fra.
            </li>
            <li>
              Refusjon i inntektsmeldinger vil alltid utbetales til arbeidsgiver. Evt. mellomlegg utbetales direkte til
              søker.
            </li>
          </ul>
        </Alert>
        <div className={styles.fortsettUtenInntektsmelding__radiogroup}>
          <RhfRadioGroup
            control={control}
            name={beslutningFieldName}
            label="Kan du gå videre uten inntektsmelding?"
            radios={radios[aksjonspunktKode]}
            disabled={readOnly && !redigeringsmodus}
            validate={[v => (!v ? 'Du må oppgi en verdi ' : null)]}
          />
        </div>
        <>
          {skalViseBegrunnelse && (
            <RhfTextarea
              control={control}
              name={begrunnelseFieldName ?? ''}
              label={
                <>
                  <label htmlFor={begrunnelseId}>Begrunnelse</label>
                  {beslutning === Kode.FORTSETT && (
                    <div className={styles['fortsettUtenInntektsmelding__begrunnelse-subtext']}>
                      Vi benytter opplysninger fra A-inntekt for alle arbeidsgivere vi ikke har mottatt inntektsmelding
                      fra. Gjør en vurdering av hvorfor du benytter A-inntekt for å fastsette grunnlaget etter § 8-28.
                    </div>
                  )}
                  {beslutning === Kode.MANGLENDE_GRUNNLAG && (
                    <div className={styles['fortsettUtenInntektsmelding__begrunnelse-subtext']}>
                      Skriv begrunnelse for hvorfor du ikke kan benytte opplysninger fra A-inntekt for å fastsette
                      grunnlaget, og avslå saken etter folketrygdloven §§ 21-3 og 8-28.
                    </div>
                  )}
                  {beslutning === Kode.IKKE_INNTEKTSTAP && (
                    <div className={styles['fortsettUtenInntektsmelding__begrunnelse-subtext']}>
                      Skriv begrunnelse for hvorfor søker ikke har inntektstap, og avslå saken etter folketrygdloven
                      §9-3.
                    </div>
                  )}
                </>
              }
              validate={[v => (!v ? 'Du må fylle inn en verdi' : null)]}
            />
          )}
          <Box.New marginBlock="6 0">
            <div className={styles.fortsettUtenInntektsmelding__knapper}>
              {!harFlereTilstanderTilVurdering && !!beslutning && (
                <Button variant="primary" size="small">
                  {fortsettKnappTekstFunc[aksjonspunktKode](beslutning)}
                </Button>
              )}
              {redigeringsmodus && (
                <Button variant="secondary" size="small" onClick={avbrytRedigering}>
                  Avbryt redigering
                </Button>
              )}
            </div>
          </Box.New>
        </>
      </Box.New>
    </RhfForm>
  );
};

export default FortsettUtenInntektsmeldingForm;
