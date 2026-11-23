import type { AksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { VergeType } from '@k9-sak-web/backend/combined/kodeverk/behandling/verge/VergeType.js';
import type { VergeDto } from '@k9-sak-web/backend/combined/kontrakt/verge/VergeDto.js';
import { AksjonspunktDefinisjon as K9TilbakeAksjonspunktDefinisjon } from '@k9-sak-web/backend/k9tilbake/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktDefinisjon as UngTilbakeAksjonspunktDefinisjon } from '@k9-sak-web/backend/ungtilbake/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { BodyLong, BodyShort, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { decodeHtmlEntity } from '@navikt/ft-utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { K9KodeverkoppslagContext } from '../../kodeverk/oppslag/K9KodeverkoppslagContext.js';
import { UngKodeverkoppslagContext } from '../../kodeverk/oppslag/UngKodeverkoppslagContext.js';
import AksjonspunktHelpText from '../../shared/aksjonspunktHelpText/AksjonspunktHelpText.js';
import { LabelledContent } from '../../shared/labelled-content/LabelledContent.js';
import { backendNavn } from '../../utils/BackendTilhørighet.js';
import { formatDateStringToDDMMYYYY } from '../../utils/dateutils.js';
import { useVergeApi } from './api/VergeApiContext.js';
import { vergeQueryOptions } from './api/vergeQueryOptions.js';
import { RegistrerVergeForm, type VergeRegistrering, type VergeTypeValg } from './RegistrerVergeForm.js';

export type RegistrerVergeAksjonspunkt =
  | ({ kode: typeof K9TilbakeAksjonspunktDefinisjon.AVKLAR_VERGE } & VergeRegistrering)
  | ({ kode: typeof UngTilbakeAksjonspunktDefinisjon.AVKLAR_VERGE } & VergeRegistrering);

interface RegistrerVergeFaktaIndexProps {
  behandlingUuid: string;
  behandlingVersjon: number;
  aksjonspunktStatus: AksjonspunktStatus | undefined;
  readOnly: boolean;
  submittable: boolean;
  submitCallback: (aksjonspunkter: [RegistrerVergeAksjonspunkt]) => Promise<void>;
}

const ikkeRegistrert = 'Ikke registrert';

const VergeOppsummering = ({ verge, vergeTyper }: { verge: VergeDto | null; vergeTyper: VergeTypeValg[] }) => {
  if (verge === null) {
    return <BodyShort size="small">Ingen verge er registrert.</BodyShort>;
  }
  const vergeTypeNavn = vergeTyper.find(({ kode }) => kode === verge.vergeType)?.navn;
  const erAdvokat = verge.vergeType === VergeType.ADVOKAT;
  const begrunnelse = decodeHtmlEntity(verge.begrunnelse);
  return (
    <VStack gap="space-8">
      <LabelledContent label="Type verge" content={vergeTypeNavn ?? ikkeRegistrert} />
      <LabelledContent label="Navn" content={verge.navn || ikkeRegistrert} />
      {erAdvokat ? (
        <LabelledContent label="Organisasjonsnummer" content={verge.organisasjonsnummer || ikkeRegistrert} />
      ) : (
        <LabelledContent label="Fødselsnummer" content={verge.fnr || ikkeRegistrert} />
      )}
      <LabelledContent
        label="Gyldig fra"
        content={verge.gyldigFom ? formatDateStringToDDMMYYYY(verge.gyldigFom) : ikkeRegistrert}
      />
      <LabelledContent
        label="Gyldig til"
        content={verge.gyldigTom ? formatDateStringToDDMMYYYY(verge.gyldigTom) : ikkeRegistrert}
      />
      {begrunnelse && (
        <LabelledContent
          label="Begrunnelse"
          content={
            <BodyLong size="small" className="whitespace-pre-wrap">
              {begrunnelse}
            </BodyLong>
          }
        />
      )}
    </VStack>
  );
};

interface RegistrerVergeProps extends Omit<RegistrerVergeFaktaIndexProps, 'behandlingUuid' | 'behandlingVersjon'> {
  backend: typeof backendNavn.k9tilbake | typeof backendNavn.ungtilbake;
  verge: VergeDto | null;
  vergeTyper: VergeTypeValg[];
}

const RegistrerVerge = ({
  backend,
  verge,
  vergeTyper,
  aksjonspunktStatus: status,
  readOnly,
  submittable,
  submitCallback,
}: RegistrerVergeProps) => {
  const [redigerer, setRedigerer] = useState(false);
  const erÅpent = status === aksjonspunktStatus.OPPRETTET;
  const erUtført = status === aksjonspunktStatus.UTFØRT;
  const kanLøse = !readOnly && submittable;
  const visSkjema = kanLøse && (erÅpent || (erUtført && redigerer));

  const lagre = async (registrering: VergeRegistrering) => {
    await submitCallback([
      backend === backendNavn.k9tilbake
        ? { kode: K9TilbakeAksjonspunktDefinisjon.AVKLAR_VERGE, ...registrering }
        : { kode: UngTilbakeAksjonspunktDefinisjon.AVKLAR_VERGE, ...registrering },
    ]);
    setRedigerer(false);
  };

  return (
    <VStack gap="space-16">
      <HStack gap="space-8" align="center">
        <Heading size="small" level="2">
          Verge/fullmektig
        </Heading>
        {erUtført && kanLøse && !redigerer && (
          <Button variant="tertiary" size="xsmall" onClick={() => setRedigerer(true)}>
            Rediger vurdering
          </Button>
        )}
      </HStack>
      {erÅpent && (
        <AksjonspunktHelpText isAksjonspunktOpen>
          {['Registrer opplysninger om verge eller fullmektig.']}
        </AksjonspunktHelpText>
      )}
      {visSkjema && (
        <RegistrerVergeForm
          backend={backend}
          verge={verge}
          vergeTyper={vergeTyper}
          kanAvbryte={erUtført}
          onSubmit={lagre}
          onAvbryt={() => setRedigerer(false)}
        />
      )}
      {!visSkjema && !erÅpent && <VergeOppsummering verge={verge} vergeTyper={vergeTyper} />}
    </VStack>
  );
};

/**
 * Registrering av verge eller fullmektig (aksjonspunkt 5030) i k9-tilbake og ung-tilbake.
 * Bare åpent (OPPRETTET) og løst (UTFØRT) aksjonspunkt kan behandles. Andre statuser vises bare.
 */
const RegistrerVergeFaktaIndex = ({ behandlingUuid, behandlingVersjon, ...props }: RegistrerVergeFaktaIndexProps) => {
  const api = useVergeApi();
  const { data: verge } = useSuspenseQuery(vergeQueryOptions(api, behandlingUuid, behandlingVersjon));
  const k9Kodeverkoppslag = useContext(K9KodeverkoppslagContext);
  const ungKodeverkoppslag = useContext(UngKodeverkoppslagContext);
  const vergeTyper: VergeTypeValg[] = (
    api.backend === backendNavn.k9tilbake
      ? k9Kodeverkoppslag.k9tilbake.alleKodeverdierForKodeverk('vergeTyper')
      : ungKodeverkoppslag.ungTilbake.alleKodeverdierForKodeverk('vergeTyper')
  )
    .filter(({ kilde }) => kilde !== VergeType.UDEFINERT)
    .map(({ kilde, navn }) => ({ kode: kilde, navn }));

  // Ny nøkkel ved ny behandling, versjon eller backend, slik at skjemaet aldri viser verdier fra en annen behandling.
  return (
    <RegistrerVerge
      key={`${api.backend}-${behandlingUuid}-${behandlingVersjon}`}
      backend={api.backend}
      verge={verge}
      vergeTyper={vergeTyper}
      {...props}
    />
  );
};

export default RegistrerVergeFaktaIndex;
