import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import { HStack, Loader } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { useEndringsmeldingPsbTilgangApi } from './api/EndringsmeldingPsbTilgangApiContext.js';
import { endringsmeldingPsbTilgangQueryOptions } from './api/endringsmeldingPsbTilgangQueryOptions.js';

// Koder fra IngenTilgangÅrsak i k9-sak-innsyn-api. k9-sak sender dem videre som string.
const årsakTekster: Partial<Record<string, string>> = {
  harIngenSak: 'Nei, søkeren har ingen sak',
  søknadsperioderUtenforTillattEndringsperiode: 'Nei, søknadsperiodene er utenfor perioden som kan endres',
  harMerEnnEnSak: 'Nei, søkeren har mer enn én sak',
  harIngenPerioder: 'Nei, søkeren har ingen søknadsperioder',
  barnManglerIdentitetsnummer: 'Nei, barnet mangler identitetsnummer',
  harArbeidstidSomSelvstendigNæringsdrivende: 'Nei, søkeren har arbeidstid som selvstendig næringsdrivende',
  enArbeidsgiverToAnsettelserSammeUkeMedOpphold: 'Nei, to ansettelser hos samme arbeidsgiver i samme uke, med opphold',
  harFlereAnsettelsesforholdHosUkjentArbeidsgiver: 'Nei, flere ansettelsesforhold hos ukjent arbeidsgiver',
};

const ukjentÅrsakTekst = 'Nei, søkeren oppfyller ikke vilkårene';

const tekstForÅrsak = (kode: string | undefined): string => (kode && årsakTekster[kode]) || ukjentÅrsakTekst;

interface Props {
  saksnummer: string;
}

const EndringsmeldingPsbTilgang = ({ saksnummer }: Props) => {
  const api = useEndringsmeldingPsbTilgangApi();
  const { data, isPending, isError, error } = useQuery(endringsmeldingPsbTilgangQueryOptions(api, saksnummer));

  if (isPending) {
    return <Loader size="xsmall" title="Henter tilgang til endringsmelding" />;
  }
  // 403: innsyn-api nektet tilgang til søkeren eller pleietrengende. Årsaken vises ikke.
  if (isError && ExtendedApiError.findInError(error)?.isForbidden) {
    return <>Uvisst, du har ikke tilgang til å se svaret</>;
  }
  // Feil og tomt svar (204) skal aldri vises som ja eller nei
  if (isError || data === null) {
    return <>Uvisst, kunne ikke hente svar</>;
  }
  if (data.kanBruke) {
    return (
      <HStack gap="space-4" wrap={false} align="start">
        <span>
          <CheckmarkCircleFillIcon color="var(--ax-bg-success-strong)" fontSize="1.25rem" aria-hidden="true" />
        </span>
        Ja, har tilgang
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
