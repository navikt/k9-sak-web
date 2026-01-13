/* eslint-disable jsx-a11y/label-has-associated-control */
import AksjonspunktBox from '@k9-sak-web/gui/shared/aksjonspunktBox/AksjonspunktBox.js';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import { Alert, Box, Button, Heading, Radio } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import type { JSX } from 'react';
import type { UseFormReturn, FieldValues } from 'react-hook-form';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { k9_sak_kontrakt_kompletthet_Status as InntektsmeldingStatus } from '@navikt/k9-sak-typescript-client/types';
import { useInntektsmeldingContext } from '../../../context/InntektsmeldingContext';
import type { InntektsmeldingRequestPayload } from '../../../types/InntektsmeldingAPRequest';
import type { KompletthetsPeriode } from '../../../types/InntektsmeldingAPRequest';
import { InntektsmeldingKode } from '../../../types/KompletthetData';
import type { TilstandBeriket } from '../../../types/KompletthetData';
import { skalVurderes } from '../../../util/utils';

export interface FortsettUtenInntektsmeldingFormState {
  begrunnelse: string;
  beslutning: string;
}

interface FortsettUtenInntektsmeldingFormProps {
  tilstand: TilstandBeriket;
  onSubmit: (payload: InntektsmeldingRequestPayload) => void;
  redigeringsmodus: boolean;
  aksjonspunkt?: AksjonspunktDto;
  setRedigeringsmodus: (state: boolean) => void;
  formMethods: UseFormReturn<FieldValues>;
  harFlereTilstanderTilVurdering: boolean;
}

interface RadioOption {
  value: InntektsmeldingKode;
  label: string;
  id: string;
}

type AksjonspunktKode = '9069' | '9071';

const fortsettKnappTekstFunc: Record<AksjonspunktKode, (kode: InntektsmeldingKode) => string> = {
  '9069': (kode: InntektsmeldingKode) =>
    kode === InntektsmeldingKode.FORTSETT ? 'Fortsett uten inntektsmelding' : 'Send purring med varsel om avslag',
  '9071': (kode: InntektsmeldingKode) => {
    switch (kode) {
      case InntektsmeldingKode.FORTSETT:
        return 'Fortsett uten inntektsmelding';
      case InntektsmeldingKode.MANGLENDE_GRUNNLAG:
        return 'Avslå periode';
      case InntektsmeldingKode.IKKE_INNTEKTSTAP:
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
  const { arbeidsforhold, readOnly } = useInntektsmeldingContext();

  const { watch, reset, control } = formMethods;
  const { beslutningFieldName = 'beslutning', begrunnelseFieldName = 'begrunnelse' } = tilstand;
  const beslutningId = `beslutning-${tilstand.periodeOpprinneligFormat}`;
  const begrunnelseId = `begrunnelse-${tilstand.periodeOpprinneligFormat}`;
  const beslutningRaw = watch(beslutningFieldName);
  const beslutning = (Array.isArray(beslutningRaw) ? beslutningRaw[0] : beslutningRaw) as InntektsmeldingKode | null;
  const aksjonspunktKode = aksjonspunkt?.definisjon;
  const vis = ((skalVurderes(tilstand) && !readOnly) || redigeringsmodus) && aksjonspunkt && tilstand.tilVurdering;
  const skalViseBegrunnelse = !(aksjonspunktKode === '9069' && beslutning !== InntektsmeldingKode.FORTSETT);
  const arbeidsgivereMedManglendeInntektsmelding = tilstand.status.filter(
    s => s.status === InntektsmeldingStatus.MANGLER,
  );

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
    const periode: KompletthetsPeriode = {
      begrunnelse: skalViseBegrunnelse ? (data[begrunnelseFieldName] as string) : undefined,
      periode: tilstand.periodeOpprinneligFormat,
      fortsett: data[beslutningFieldName] === InntektsmeldingKode.FORTSETT,
      vurdering: data[beslutningFieldName],
    };

    return onSubmit({
      '@type': aksjonspunktKode ?? '',
      kode: aksjonspunktKode ?? '',
      begrunnelse: skalViseBegrunnelse ? data[begrunnelseFieldName] : undefined,
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
        value: InntektsmeldingKode.FORTSETT,
        label: `Ja, bruk A-inntekt for ${arbeidsgivereString}`,
        id: `${beslutningId}${InntektsmeldingKode.FORTSETT}`,
      },
      {
        value: InntektsmeldingKode.MANGLENDE_GRUNNLAG,
        label: 'Nei, send purring med varsel om avslag',
        id: `${beslutningId}${InntektsmeldingKode.MANGLENDE_GRUNNLAG}`,
      },
    ],
    '9071': [
      {
        value: InntektsmeldingKode.FORTSETT,
        label: `Ja, bruk A-inntekt for ${arbeidsgivereString}`,
        id: `${beslutningId}${InntektsmeldingKode.FORTSETT}`,
      },
      {
        value: InntektsmeldingKode.MANGLENDE_GRUNNLAG,
        label: 'Nei, avslå på grunn av manglende opplysninger om inntekt etter §21-3',
        id: `${beslutningId}${InntektsmeldingKode.MANGLENDE_GRUNNLAG}`,
      },
      {
        value: InntektsmeldingKode.IKKE_INNTEKTSTAP,
        label: 'Nei, avslå søknaden på grunn av at ansatt ikke har tapt arbeidsinntekt §9-3',
        id: `${beslutningId}${InntektsmeldingKode.IKKE_INNTEKTSTAP}`,
      },
    ],
  };

  if (!vis) {
    return <></>;
  }

  const radiosForAksjonspunkt: RadioOption[] = aksjonspunktKode ? radios[aksjonspunktKode as AksjonspunktKode] : [];

  return (
    <RhfForm formMethods={formMethods} onSubmit={submit}>
      <AksjonspunktBox erAksjonspunktApent>
        <Heading level="3" size="xsmall">
          Kan du gå videre uten inntektsmelding?
        </Heading>
        <Alert className="mt-4" variant="info" size="medium">
          <ul className="m-0 list-disc pl-6">
            <li>
              A-inntekt benyttes <span className="font-bold underline">kun</span> for de
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
        <div className="my-4 [&_legend]:sr-only">
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
                  {beslutning === InntektsmeldingKode.FORTSETT && (
                    <div className="font-normal">
                      Vi benytter opplysninger fra A-inntekt for alle arbeidsgivere vi ikke har mottatt inntektsmelding
                      fra. Gjør en vurdering av hvorfor du benytter A-inntekt for å fastsette grunnlaget etter § 8-28.
                    </div>
                  )}
                  {beslutning === InntektsmeldingKode.MANGLENDE_GRUNNLAG && (
                    <div className="font-normal">
                      Skriv begrunnelse for hvorfor du ikke kan benytte opplysninger fra A-inntekt for å fastsette
                      grunnlaget, og avslå saken etter folketrygdloven §§ 21-3 og 8-28.
                    </div>
                  )}
                  {beslutning === InntektsmeldingKode.IKKE_INNTEKTSTAP && (
                    <div className="font-normal">
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
            <div className="flex gap-4">
              {!harFlereTilstanderTilVurdering && beslutning && aksjonspunktKode && (
                <Button variant="primary" size="small">
                  {fortsettKnappTekstFunc[aksjonspunktKode as AksjonspunktKode](beslutning)}
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
