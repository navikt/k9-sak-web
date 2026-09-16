import { fagsakStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { pathToFagsak } from '@k9-sak-web/gui/utils/paths.js';
import { TIDENES_ENDE } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
import { ChevronDownIcon, ChevronUpIcon, InformationSquareFillIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Box, Button, HelpText, HStack, InfoCard, Label, Link } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import type { K9StatusBackendApi } from '../K9StatusBackendApi';
import styles from './andreSakerPåSøkerStripe.module.css';

interface Props {
  saksnummer: string;
  api: K9StatusBackendApi;
}

// Kun disse ytelsestypene skal vises i linja. Omsorgsdager/omsorgspenger skal ikke vises.
const ytelseTyperSomVises: ReadonlyArray<string> = [
  fagsakYtelsesType.OPPLÆRINGSPENGER,
  fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE,
  fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
];

const AndreSakerPåSøkerStripe: React.FC<Props> = ({ saksnummer, api }) => {
  const [erUtvidet, setErUtvidet] = useState(false);
  const { kodeverkNavnFraKode } = useKodeverkContext();

  const {
    data: fagsaker,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ['andreFagsaker', { saksnummer }],
    queryFn: () => api.getAndreSakerPåSøker(saksnummer),
    initialData: [],
    throwOnError: false,
  });

  if (error) {
    return (
      <Alert size="small" variant="error">
        Får ikke hentet andre saker knyttet til søker
      </Alert>
    );
  }

  const andreFagsakerPåSøker = fagsaker.filter(
    fagsak => fagsak.saksnummer !== saksnummer && ytelseTyperSomVises.includes(fagsak.ytelseType),
  );

  if (!isSuccess || andreFagsakerPåSøker.length === 0) {
    return null;
  }

  const formaterPeriode = (fagsak: (typeof andreFagsakerPåSøker)[number]): string => {
    if (!fagsak.gyldigPeriode) {
      return '';
    }
    const { fom, tom } = fagsak.gyldigPeriode;
    return tom && tom !== TIDENES_ENDE ? `${formatDate(fom)} - ${formatDate(tom)}` : `${formatDate(fom)} - `;
  };

  const ytelsestyperSomVisesNavn = ytelseTyperSomVises.map(ytelseType =>
    kodeverkNavnFraKode(ytelseType, KodeverkType.FAGSAK_YTELSE),
  );

  const antallSakerPåSøker = andreFagsakerPåSøker.length;
  return (
    <InfoCard data-color="info" size="small">
      <InfoCard.Message icon={<InformationSquareFillIcon fontSize="1.5rem" className="mt-[3px]" />}>
        <HStack gap="space-16">
          <div className="flex items-center">
            <BodyShort size="small">
              {antallSakerPåSøker > 0 && `${antallSakerPåSøker}`}{' '}
              {antallSakerPåSøker === 1 ? 'annen sak' : 'andre saker'} knyttet til søker
            </BodyShort>
          </div>
          <Button
            variant="tertiary"
            size="small"
            icon={erUtvidet ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
            iconPosition="right"
            onClick={() => setErUtvidet(forrigeVerdi => !forrigeVerdi)}
          >
            {erUtvidet ? 'Skjul saker' : 'Se saker'}
          </Button>
        </HStack>
        {erUtvidet && (
          <Box marginBlock={'space-12 space-0'}>
            <HStack gap="space-4" className="mb-1">
              <Label className="mt-[2px]" size="small">
                Andre saker
              </Label>
              <HelpText>Viser kun {ytelsestyperSomVisesNavn.join(', ').toLocaleLowerCase()}. </HelpText>
            </HStack>
            <div className={styles.sakerGrid}>
              {andreFagsakerPåSøker.map(fagsak => {
                const erHistorisk = fagsak.status === fagsakStatus.AVSLUTTET;
                return (
                  <React.Fragment key={fagsak.saksnummer}>
                    {erHistorisk ? (
                      <BodyShort size="small">{fagsak.saksnummer}:</BodyShort>
                    ) : (
                      <Link href={`/k9/web${pathToFagsak(fagsak.saksnummer)}`} target="_blank">
                        {fagsak.saksnummer}:
                      </Link>
                    )}
                    <BodyShort size="small">
                      {kodeverkNavnFraKode(fagsak.ytelseType, KodeverkType.FAGSAK_YTELSE)}
                    </BodyShort>
                    {erHistorisk ? (
                      <BodyShort size="small" className={styles.historisk}>
                        Historisk
                      </BodyShort>
                    ) : (
                      <BodyShort size="small">{formaterPeriode(fagsak)}</BodyShort>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </Box>
        )}
      </InfoCard.Message>
    </InfoCard>
  );
};
export default AndreSakerPåSøkerStripe;
