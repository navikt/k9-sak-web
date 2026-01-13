import AksjonspunktBox from '@k9-sak-web/gui/shared/aksjonspunktBox/AksjonspunktBox.js';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { k9_sak_kontrakt_kompletthet_Status as InntektsmeldingStatus } from '@navikt/k9-sak-typescript-client/types';
import { Alert, Box, Button, Heading, Radio } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import type { JSX } from 'react';
import type { UseFormReturn, FieldValues } from 'react-hook-form';
import { useInntektsmeldingContext } from '../../context/InntektsmeldingContext';
import type { InntektsmeldingRequestPayload, KompletthetsPeriode } from '../../types/InntektsmeldingAPRequest';
import { InntektsmeldingVurderingRequestKode } from '../../types/KompletthetData';
import type { TilstandMedUiState } from '../../types/KompletthetData';
import { skalVurderes } from '../../util/utils';

type AksjonspunktKode = '9069' | '9071';

// Knappetekst basert på aksjonspunkt og valgt beslutning
const knappetekster: Record<AksjonspunktKode, Record<string, string>> = {
  '9069': {
    [InntektsmeldingVurderingRequestKode.FORTSETT]: 'Fortsett uten inntektsmelding',
    [InntektsmeldingVurderingRequestKode.MANGLENDE_GRUNNLAG]: 'Send purring med varsel om avslag',
  },
  '9071': {
    [InntektsmeldingVurderingRequestKode.FORTSETT]: 'Fortsett uten inntektsmelding',
    [InntektsmeldingVurderingRequestKode.MANGLENDE_GRUNNLAG]: 'Avslå periode',
    [InntektsmeldingVurderingRequestKode.IKKE_INNTEKTSTAP]: 'Avslå søknad',
  },
};

// Hjelpetekster for begrunnelsesfelt basert på valgt beslutning
const begrunnelseHjelpetekster: Record<string, string> = {
  [InntektsmeldingVurderingRequestKode.FORTSETT]:
    'Vi benytter opplysninger fra A-inntekt for alle arbeidsgivere vi ikke har mottatt inntektsmelding fra. Gjør en vurdering av hvorfor du benytter A-inntekt for å fastsette grunnlaget etter § 8-28.',
  [InntektsmeldingVurderingRequestKode.MANGLENDE_GRUNNLAG]:
    'Skriv begrunnelse for hvorfor du ikke kan benytte opplysninger fra A-inntekt for å fastsette grunnlaget, og avslå saken etter folketrygdloven §§ 21-3 og 8-28.',
  [InntektsmeldingVurderingRequestKode.IKKE_INNTEKTSTAP]:
    'Skriv begrunnelse for hvorfor søker ikke har inntektstap, og avslå saken etter folketrygdloven §9-3.',
};

interface FortsettUtenInntektsmeldingFormProps {
  tilstand: TilstandMedUiState;
  onSubmit: (payload: InntektsmeldingRequestPayload) => void;
  redigeringsmodus: boolean;
  aksjonspunkt?: AksjonspunktDto;
  setRedigeringsmodus: (state: boolean) => void;
  formMethods: UseFormReturn<FieldValues>;
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
}: FortsettUtenInntektsmeldingFormProps): JSX.Element | null => {
  const { arbeidsforhold, readOnly } = useInntektsmeldingContext();
  const { watch, reset, control } = formMethods;

  const aksjonspunktKode = aksjonspunkt?.definisjon as AksjonspunktKode | undefined;
  const { beslutningFieldName, begrunnelseFieldName } = tilstand;

  const beslutningValue = watch(beslutningFieldName);
  const beslutning = Array.isArray(beslutningValue) ? beslutningValue[0] : beslutningValue;

  // Bestem om skjemaet skal vises
  const skalViseForm =
    ((skalVurderes(tilstand) && !readOnly) || redigeringsmodus) && aksjonspunkt && tilstand.tilVurdering;

  if (!skalViseForm) return null;

  // For 9069 vises begrunnelse kun ved "fortsett"-valg
  const skalViseBegrunnelse = aksjonspunktKode !== '9069' || beslutning === InntektsmeldingVurderingRequestKode.FORTSETT;

  // Finn arbeidsgivere som mangler inntektsmelding
  const arbeidsgivereMedMangler = tilstand.status.filter(s => s.status === InntektsmeldingStatus.MANGLER);

  const formaterArbeidsgiver = (ag: { arbeidsgiver: string; arbeidsforhold: string | null }) =>
    `${arbeidsforhold[ag.arbeidsgiver]?.navn ?? ag.arbeidsgiver} (${ag.arbeidsforhold ?? 'ukjent'})`;

  const arbeidsgivereString = arbeidsgivereMedMangler
    .map(({ arbeidsgiver }, i) => {
      const navn = formaterArbeidsgiver(arbeidsgiver);
      if (i === 0) return navn;
      if (i === arbeidsgivereMedMangler.length - 1) return ` og ${navn}`;
      return `, ${navn}`;
    })
    .join('');

  // Bygg radioknapper basert på aksjonspunkt
  const byggRadioer = () => {
    const baseRadios = [
      {
        value: InntektsmeldingVurderingRequestKode.FORTSETT,
        label: `Ja, bruk A-inntekt for ${arbeidsgivereString}`,
      },
    ];

    if (aksjonspunktKode === '9069') {
      return [
        ...baseRadios,
        {
          value: InntektsmeldingVurderingRequestKode.MANGLENDE_GRUNNLAG,
          label: 'Nei, send purring med varsel om avslag',
        },
      ];
    }

    return [
      ...baseRadios,
      {
        value: InntektsmeldingVurderingRequestKode.MANGLENDE_GRUNNLAG,
        label: 'Nei, avslå på grunn av manglende opplysninger om inntekt etter §21-3',
      },
      {
        value: InntektsmeldingVurderingRequestKode.IKKE_INNTEKTSTAP,
        label: 'Nei, avslå søknaden på grunn av at ansatt ikke har tapt arbeidsinntekt §9-3',
      },
    ];
  };

  const handleSubmit = (data: FieldValues) => {
    if (!aksjonspunktKode) {
      throw new Error('AksjonspunktKode er ikke satt');
    }

    const periode: KompletthetsPeriode = {
      periode: tilstand.periodeOpprinneligFormat,
      fortsett: data[beslutningFieldName] === InntektsmeldingVurderingRequestKode.FORTSETT,
      vurdering: data[beslutningFieldName],
      begrunnelse: skalViseBegrunnelse ? data[begrunnelseFieldName] : undefined,
    };

    onSubmit({
      '@type': aksjonspunktKode,
      kode: aksjonspunktKode,
      begrunnelse: skalViseBegrunnelse ? data[begrunnelseFieldName] : undefined,
      perioder: [periode],
    });
  };

  const avbrytRedigering = () => {
    reset();
    setRedigeringsmodus(false);
  };

  const visEnkeltperiodeKnapp = !harFlereTilstanderTilVurdering && beslutning && aksjonspunktKode;

  return (
    <RhfForm formMethods={formMethods} onSubmit={handleSubmit}>
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
            validate={[v => (!v ? 'Du må oppgi en verdi' : null)]}
          >
            {byggRadioer().map(radio => (
              <Radio key={radio.value} value={radio.value}>
                {radio.label}
              </Radio>
            ))}
          </RhfRadioGroup>
        </div>

        {skalViseBegrunnelse && (
          <RhfTextarea
            control={control}
            name={begrunnelseFieldName}
            label={
              <>
                <span>Begrunnelse</span>
                {beslutning && begrunnelseHjelpetekster[beslutning] && (
                  <div className="font-normal">{begrunnelseHjelpetekster[beslutning]}</div>
                )}
              </>
            }
            validate={[v => (!v ? 'Du må fylle inn en verdi' : null)]}
          />
        )}

        <Box.New marginBlock="6 0">
          <div className="flex gap-4">
            {visEnkeltperiodeKnapp && (
              <Button variant="primary" size="small">
                {knappetekster[aksjonspunktKode][beslutning] ?? 'Send inn'}
              </Button>
            )}
            {redigeringsmodus && (
              <Button variant="secondary" size="small" onClick={avbrytRedigering}>
                Avbryt redigering
              </Button>
            )}
          </div>
        </Box.New>
      </AksjonspunktBox>
    </RhfForm>
  );
};

export default FortsettUtenInntektsmeldingForm;
