import { HStack, Loader } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { useEndringsmeldingPsbTilgangApi } from './api/EndringsmeldingPsbTilgangApiContext.js';
import { endringsmeldingPsbTilgangQueryOptions } from './api/endringsmeldingPsbTilgangQueryOptions.js';

// Koder fra IngenTilgangÅrsak i k9-sak-innsyn-api. k9-sak sender dem videre som string.
const årsakTekster: Partial<Record<string, string>> = {
  harIngenSak: 'Søkeren har ingen sak',
  søknadsperioderUtenforTillattEndringsperiode: 'Søknadsperiodene er utenfor perioden som kan endres',
  harMerEnnEnSak: 'Søkeren har mer enn én sak',
  harIngenPerioder: 'Søkeren har ingen søknadsperioder',
  barnManglerIdentitetsnummer: 'Barnet mangler identitetsnummer',
  harArbeidstidSomSelvstendigNæringsdrivende: 'Søkeren har arbeidstid som selvstendig næringsdrivende',
  enArbeidsgiverToAnsettelserSammeUkeMedOpphold: 'To ansettelser hos samme arbeidsgiver i samme uke, med opphold',
  harFlereAnsettelsesforholdHosUkjentArbeidsgiver: 'Flere ansettelsesforhold hos ukjent arbeidsgiver',
};

const ukjentÅrsakTekst = 'Søkeren oppfyller ikke vilkårene';

const tekstForÅrsak = (kode: string | undefined): string => (kode && årsakTekster[kode]) || ukjentÅrsakTekst;

interface Props {
  saksnummer: string;
}

const EndringsmeldingPsbTilgang = ({ saksnummer }: Props) => {
  const api = useEndringsmeldingPsbTilgangApi();
  const { data, isPending, isError } = useQuery(endringsmeldingPsbTilgangQueryOptions(api, saksnummer));

  if (isPending) {
    return <Loader size="xsmall" title="Henter tilgang til endringsmelding" />;
  }
  // Feil skal aldri vises som ja eller nei
  if (isError) {
    return <>Kunne ikke hente svar</>;
  }
  if (data.kanBruke) {
    return (
      <HStack gap="space-4" wrap={false} align="start">
        <span>
          <CheckmarkCircleFillIcon color="var(--ax-bg-success-strong)" fontSize="1.25rem" aria-hidden="true" />
        </span>
        Har tilgang
      </HStack>
    );
  }
  // Første årsak er hovedårsaken
  return (
    <HStack gap="space-4" wrap={false} align="start">
      <span>
        <XMarkOctagonFillIcon color="var(--ax-bg-danger-strong)" fontSize="1.25rem" aria-hidden="true" />
      </span>
      {tekstForÅrsak(data.årsaker[0])}
    </HStack>
  );
};

export default EndringsmeldingPsbTilgang;
