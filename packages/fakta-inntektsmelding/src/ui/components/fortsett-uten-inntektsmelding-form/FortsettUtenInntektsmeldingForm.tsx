/* eslint-disable jsx-a11y/label-has-associated-control */
import AksjonspunktBox from '@k9-sak-web/gui/shared/aksjonspunktBox/AksjonspunktBox.js';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import { Alert, Box, Button, Heading, Radio } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import React, { type JSX } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import ContainerContext from '../../../context/ContainerContext';
import type Aksjonspunkt from '../../../types/Aksjonspunkt';
import type AksjonspunktRequestPayload from '../../../types/AksjonspunktRequestPayload';
import type { Perioder } from '../../../types/AksjonspunktRequestPayload';
import { Kode, type TilstandBeriket } from '../../../types/KompletthetData';
import TilstandStatus from '../../../types/TilstandStatus';
import { skalVurderes } from '../../../util/utils';
import styles from './fortsettUtenInntektsMeldingForm.module.css';

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
      vurdering: data[beslutningFieldName],
      kode: aksjonspunktKode,
    };

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
    '9071': [
      {
        value: Kode.FORTSETT,
        label: `Ja, bruk A-inntekt for ${arbeidsgivereString}`,
        id: `${beslutningId}${Kode.FORTSETT}`,
      },
      {
        value: Kode.MANGLENDE_GRUNNLAG,
        label: 'Nei, avslå på grunn av manglende opplysninger om inntekt etter §21-3',
        id: `${beslutningId}${Kode.MANGLENDE_GRUNNLAG}`,
      },
      {
        value: Kode.IKKE_INNTEKTSTAP,
        label: 'Nei, avslå søknaden på grunn av at ansatt ikke har tapt arbeidsinntekt §9-3',
        id: `${beslutningId}${Kode.IKKE_INNTEKTSTAP}`,
      },
    ],
  };

  if (!vis) {
    return <></>;
  }

  const radiosForAksjonspunkt: {
    value: Kode;
    label: string;
    id: string;
  }[] = radios[aksjonspunktKode];

  return (
    <RhfForm formMethods={formMethods} onSubmit={submit}>
      <AksjonspunktBox erAksjonspunktApent={true}>
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
              Vi har utredningsplikt til å forsøke å la bruker dokumentere sin inntekt etter{' '}
              <Lovreferanse>§ 21-3</Lovreferanse>, hvis vi ikke får tilstrekkelige opplysninger hverken i A-inntekt
              eller fra inntektsmelding.
            </li>
            <li>
              Hvis du ser at arbeidsgiver utbetaler full lønn, og mangler refusjonskrav etter gjentatte forsøk på å
              innhente denne, kan du avslå etter <Lovreferanse>§ 9-3</Lovreferanse>.
            </li>
          </ul>
        </Alert>
        <div className={styles.fortsettUtenInntektsmelding__radiogroup}>
          <RhfRadioGroup
            control={control}
            name={beslutningFieldName}
            legend="Kan du gå videre uten inntektsmelding?"
            disabled={readOnly && !redigeringsmodus}
            validate={[v => (!v ? 'Du må oppgi en verdi ' : null)]}
          >
            {radiosForAksjonspunkt.map(radio => (
              <Radio key={radio.id} value={radio.value}>
                {radio.label}
              </Radio>
            ))}
          </RhfRadioGroup>
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
      </AksjonspunktBox>
    </RhfForm>
  );
};

export default FortsettUtenInntektsmeldingForm;
