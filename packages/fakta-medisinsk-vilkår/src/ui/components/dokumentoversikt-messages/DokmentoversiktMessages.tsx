import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Alert, Box, Button } from '@navikt/ds-react';
import React, { JSX } from 'react';
import Dokumentoversikt from '../../../types/Dokumentoversikt';
import ContainerContext from '../../context/ContainerContext';
import FristForDokumentasjonUtløptPanel from '../frist-for-dokumentasjon-utløpt-panel/FristForDokumentasjonUtløptPanel';

interface DokumentoversiktMessagesProps {
  dokumentoversikt: Dokumentoversikt | null;
  harRegistrertDiagnosekode: boolean;
  kanNavigereVidere: boolean;
  navigerTilNesteSteg: () => void;
}

const DokumentoversiktMessages = ({
  dokumentoversikt,
  harRegistrertDiagnosekode,
  kanNavigereVidere,
  navigerTilNesteSteg,
}: DokumentoversiktMessagesProps): JSX.Element => {
  const { onFinished, readOnly, fagsakYtelseType } = React.useContext(ContainerContext);
  if (!dokumentoversikt) {
    return <></>;
  }
  const { ustrukturerteDokumenter } = dokumentoversikt;

  const visFristForDokumentasjonUtløptMelding =
    ustrukturerteDokumenter.length === 0 && !dokumentoversikt.harGyldigSignatur();

  const visHåndterNyeDokumenterMelding =
    !dokumentoversikt.harGyldigSignatur() && dokumentoversikt.harDokumenter() && !visFristForDokumentasjonUtløptMelding;

  const erPleiepengerSluttfaseFagsak = fagsakYtelseType === fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE;

  return (
    <>
      {harRegistrertDiagnosekode === false && (
        <Box marginBlock="0 6">
          <Alert size="small" variant="warning">
            Diagnosekode mangler. Du må legge til en diagnosekode for å vurdere tilsyn og pleie.
          </Alert>
        </Box>
      )}
      {visFristForDokumentasjonUtløptMelding && !readOnly && (
        <>
          <Box marginBlock="0 6">
            <Alert size="small" variant="warning">
              {erPleiepengerSluttfaseFagsak ? (
                <>Dokumentasjon signert av lege eller helseinstitusjon mangler. </>
              ) : (
                <>Dokumentasjon signert av sykehuslege/spesialisthelsetjenesten mangler. </>
              )}
              Sett saken på vent mens du innhenter mer dokumentasjon.
            </Alert>
          </Box>
          <Box marginBlock="0 6">
            <FristForDokumentasjonUtløptPanel
              onProceedClick={() => onFinished({ ikkeVentPåGodkjentLegeerklæring: true })}
            />
          </Box>
        </>
      )}
      {visHåndterNyeDokumenterMelding && fagsakYtelseType !== fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE && (
        <Box marginBlock="0 6">
          <Alert size="small" variant="warning">
            Dokumentasjon signert av sykehuslege/spesialisthelsetjenesten mangler. Håndter eventuelle nye dokumenter,
            eller sett saken på vent mens du innhenter mer dokumentasjon.
          </Alert>
        </Box>
      )}
      {dokumentoversikt.harDokumenter() === false && (
        <Alert size="small" variant="info">
          Ingen dokumenter å vise
        </Alert>
      )}
      {kanNavigereVidere && !readOnly && (
        <Box marginBlock="0 6">
          <Alert
            size="small"
            data-testid="dokumentasjon-ferdig"
            variant={erPleiepengerSluttfaseFagsak ? 'success' : 'info'}
          >
            <div style={{ display: 'flex' }}>
              {erPleiepengerSluttfaseFagsak ? (
                <>Dokumentasjon av livets sluttfase er ferdig vurdert og du kan gå videre i vurderingen.</>
              ) : (
                <>Dokumentasjon av sykdom er ferdig vurdert og du kan gå videre i vurderingen.</>
              )}
              <Button
                style={{ marginLeft: '2rem' }}
                onClick={navigerTilNesteSteg}
                size="small"
                id="gåVidereFraDokumentasjonKnapp"
              >
                Fortsett
              </Button>
            </div>
          </Alert>
        </Box>
      )}
    </>
  );
};

export default DokumentoversiktMessages;
