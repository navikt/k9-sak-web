import AksjonspunktBox from '@k9-sak-web/gui/shared/aksjonspunktBox/AksjonspunktBox.js';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { k9_sak_kontrakt_kompletthet_Status as InntektsmeldingStatus } from '@navikt/k9-sak-typescript-client/types';
import { Alert, Box, Button, Heading, Radio } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import type { JSX } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import { useInntektsmeldingContext } from '../../context/InntektsmeldingContext';
import type { InntektsmeldingRequestPayload, KompletthetsPeriode, TilstandMedUiState } from '../../types';
import { InntektsmeldingVurderingRequestKode } from '../../types';

type AksjonspunktKode = '9069' | '9071';

const radioConfig: Record<AksjonspunktKode, Array<{ value: string; label: string }>> = {
  '9069': [
    { value: InntektsmeldingVurderingRequestKode.FORTSETT, label: 'Ja, bruk A-inntekt for {arbeidsgivere}' },
    { value: InntektsmeldingVurderingRequestKode.MANGLENDE_GRUNNLAG, label: 'Nei, send purring med varsel om avslag' },
  ],
  '9071': [
    { value: InntektsmeldingVurderingRequestKode.FORTSETT, label: 'Ja, bruk A-inntekt for {arbeidsgivere}' },
    {
      value: InntektsmeldingVurderingRequestKode.MANGLENDE_GRUNNLAG,
      label: 'Nei, avslå på grunn av manglende opplysninger om inntekt etter §21-3',
    },
    {
      value: InntektsmeldingVurderingRequestKode.IKKE_INNTEKTSTAP,
      label: 'Nei, avslå søknaden på grunn av at ansatt ikke har tapt arbeidsinntekt §9-3',
    },
  ],
};

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

const begrunnelseHjelpetekster: Record<string, string> = {
  [InntektsmeldingVurderingRequestKode.FORTSETT]:
    'Vi benytter opplysninger fra A-inntekt for alle arbeidsgivere vi ikke har mottatt inntektsmelding fra. Gjør en vurdering av hvorfor du benytter A-inntekt for å fastsette grunnlaget etter § 8-28.',
  [InntektsmeldingVurderingRequestKode.MANGLENDE_GRUNNLAG]:
    'Skriv begrunnelse for hvorfor du ikke kan benytte opplysninger fra A-inntekt for å fastsette grunnlaget, og avslå saken etter folketrygdloven §§ 21-3 og 8-28.',
  [InntektsmeldingVurderingRequestKode.IKKE_INNTEKTSTAP]:
    'Skriv begrunnelse for hvorfor søker ikke har inntektstap, og avslå saken etter folketrygdloven §9-3.',
};

const formatListeMedOg = (items: string[]) =>
  items.length <= 1 ? items.join('') : items.slice(0, -1).join(', ') + ' og ' + items.at(-1);

const HjelpetekstAlert = () => (
  <Alert className="mt-4" variant="info" size="medium">
    <ul className="m-0 list-disc pl-6">
      <li>
        A-inntekt benyttes <span className="font-bold underline">kun</span> for de arbeidsgiverne/arbeidsforholdene vi
        mangler inntektsmelding fra.
      </li>
      <li>
        Vi har utredningsplikt til å forsøke å la bruker dokumentere sin inntekt etter{' '}
        <Lovreferanse>§ 21-3</Lovreferanse>, hvis vi ikke får tilstrekkelige opplysninger hverken i A-inntekt eller fra
        inntektsmelding.
      </li>
      <li>
        Hvis du ser at arbeidsgiver utbetaler full lønn, og mangler refusjonskrav etter gjentatte forsøk på å innhente
        denne, kan du avslå etter <Lovreferanse>§ 9-3</Lovreferanse>.
      </li>
    </ul>
  </Alert>
);

interface InntektsmeldingFormProps {
  tilstand: TilstandMedUiState;
  aksjonspunkt: AksjonspunktDto;
  formMethods: UseFormReturn<FieldValues>;
  onSubmit: (payload: InntektsmeldingRequestPayload) => void;
  harFlereTilstanderTilVurdering: boolean;
}

const InntektsmeldingForm = ({
  tilstand,
  aksjonspunkt,
  formMethods,
  onSubmit,
  harFlereTilstanderTilVurdering,
}: InntektsmeldingFormProps): JSX.Element => {
  const { arbeidsforhold, readOnly } = useInntektsmeldingContext();
  const { watch, reset, control } = formMethods;

  const aksjonspunktKode = aksjonspunkt.definisjon as AksjonspunktKode;
  const { redigeringsmodus, setRedigeringsmodus, beslutningFieldName, begrunnelseFieldName } = tilstand;

  const beslutningValue = watch(beslutningFieldName);
  const beslutning = Array.isArray(beslutningValue) ? beslutningValue[0] : beslutningValue;

  const skalViseBegrunnelse =
    aksjonspunktKode !== '9069' || beslutning === InntektsmeldingVurderingRequestKode.FORTSETT;

  // Formater arbeidsgiverliste
  const arbeidsgivereMedMangler = tilstand.status.filter(s => s.status === InntektsmeldingStatus.MANGLER);
  const arbeidsgivereString = formatListeMedOg(
    arbeidsgivereMedMangler.map(
      ({ arbeidsgiver: ag }) =>
        `${arbeidsforhold[ag.arbeidsgiver]?.navn ?? ag.arbeidsgiver} (${ag.arbeidsforhold ?? 'ukjent'})`,
    ),
  );

  // Bygg radioknapper fra config
  const radioer = radioConfig[aksjonspunktKode].map(r => ({
    ...r,
    label: r.label.replace('{arbeidsgivere}', arbeidsgivereString),
  }));

  const handleSubmit = (data: FieldValues) => {
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

  return (
    <RhfForm formMethods={formMethods} onSubmit={handleSubmit}>
      <AksjonspunktBox erAksjonspunktApent>
        <Heading level="3" size="xsmall">
          Kan du gå videre uten inntektsmelding?
        </Heading>

        <HjelpetekstAlert />

        <div className="my-4 [&_legend]:sr-only">
          <RhfRadioGroup
            control={control}
            name={beslutningFieldName}
            legend="Kan du gå videre uten inntektsmelding?"
            disabled={readOnly && !redigeringsmodus}
            validate={[v => (!v ? 'Du må oppgi en verdi' : null)]}
          >
            {radioer.map(radio => (
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
            {!harFlereTilstanderTilVurdering && beslutning && (
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

export default InntektsmeldingForm;
