/* eslint-disable jsx-a11y/label-has-associated-control */
import AksjonspunktBox from '@k9-sak-web/gui/shared/aksjonspunktBox/AksjonspunktBox.js';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import { Alert, Box, Button, Heading, Radio } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import type { JSX } from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import useContainerContext from '../../../context/useContainerContext';
import Aksjonspunkt from '../../../types/Aksjonspunkt';
import AksjonspunktRequestPayload, { Perioder } from '../../../types/AksjonspunktRequestPayload';
import { Kode, TilstandBeriket } from '../../../types/KompletthetData';
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
  formMethods: UseFormReturn<FieldValues>;
  harFlereTilstanderTilVurdering: boolean;
}

interface RadioOption {
  value: Kode;
  label: string;
  id: string;
}

type AksjonspunktKode = '9069' | '9071';

const fortsettKnappTekstFunc: Record<AksjonspunktKode, (kode: Kode) => string> = {
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

const FortsettUtenInntektsmeldingForm = ({
  onSubmit,
  tilstand,
  redigeringsmodus,
  setRedigeringsmodus,
  aksjonspunkt,
  formMethods,
  harFlereTilstanderTilVurdering,
}: FortsettUtenInntektsmeldingFormProps): JSX.Element => {
  const { arbeidsforhold, readOnly } = useContainerContext();

  const { watch, reset, control } = formMethods;
  const { beslutningFieldName = 'beslutning', begrunnelseFieldName = 'begrunnelse' } = tilstand;
  const beslutningId = `beslutning-${tilstand.periodeOpprinneligFormat}`;
  const begrunnelseId = `begrunnelse-${tilstand.periodeOpprinneligFormat}`;
  const beslutningRaw = watch(beslutningFieldName);
  const beslutning = (Array.isArray(beslutningRaw) ? beslutningRaw[0] : beslutningRaw) as Kode | null;
  const aksjonspunktKode = aksjonspunkt?.definisjon?.kode as AksjonspunktKode | undefined;
  const vis = ((skalVurderes(tilstand) && !readOnly) || redigeringsmodus) && aksjonspunkt && tilstand.tilVurdering;
  const skalViseBegrunnelse = !(aksjonspunktKode === '9069' && beslutning !== Kode.FORTSETT);
  const arbeidsgivereMedManglendeInntektsmelding = tilstand.status.filter(s => s.status === TilstandStatus.MANGLER);

  const formatArbeidsgiver = (arbeidsgiver: { arbeidsgiver: string; arbeidsforhold: string | null }) =>
    `${arbeidsforhold[arbeidsgiver.arbeidsgiver]?.navn ?? arbeidsgiver.arbeidsgiver} (${arbeidsgiver.arbeidsforhold ?? 'ukjent'})`;

  const arbeidsgivereString = arbeidsgivereMedManglendeInntektsmelding
    .map(({ arbeidsgiver }, index) => {
      const formatted = formatArbeidsgiver(arbeidsgiver);
      if (index === 0) return formatted;
      if (index === arbeidsgivereMedManglendeInntektsmelding.length - 1) return ` og ${formatted}`;
      return `, ${formatted}`;
    })
    .join('');

  const submit = (data: FieldValues) => {
    const periode: Perioder = {
      begrunnelse: skalViseBegrunnelse ? (data[begrunnelseFieldName] as string) : undefined,
      periode: tilstand.periodeOpprinneligFormat,
      fortsett: data[beslutningFieldName] === Kode.FORTSETT,
      vurdering: data[beslutningFieldName] as Kode,
      kode: aksjonspunktKode ?? '',
    };

    return onSubmit({
      '@type': aksjonspunktKode ?? '',
      kode: aksjonspunktKode ?? '',
      begrunnelse: skalViseBegrunnelse ? (data[begrunnelseFieldName] as string) : undefined,
      perioder: [periode],
    });
  };

  const avbrytRedigering = () => {
    reset();
    setRedigeringsmodus(false);
  };

  const radios: Record<AksjonspunktKode, RadioOption[]> = {
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

  const radiosForAksjonspunkt: RadioOption[] = aksjonspunktKode ? radios[aksjonspunktKode] : [];

  return (
    <RhfForm formMethods={formMethods} onSubmit={submit}>
      <AksjonspunktBox erAksjonspunktApent>
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
              <Lovreferanse>§ 21-3</Lovreferanse>, hvis vi ikke får tilstrekkelige opplysninger hverken i A-inntekt eller
              fra inntektsmelding.
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
              name={begrunnelseFieldName}
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
              {!harFlereTilstanderTilVurdering && beslutning && aksjonspunktKode && (
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
