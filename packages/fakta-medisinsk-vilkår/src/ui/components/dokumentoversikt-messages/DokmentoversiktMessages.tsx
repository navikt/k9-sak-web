import { Box, Margin } from '@navikt/ft-plattform-komponenter';
import { Alert, Button } from '@navikt/ds-react';
import React from 'react';
import FagsakYtelseType from '../../../constants/FagsakYtelseType';
import Dokumentoversikt from '../../../types/Dokumentoversikt';
import ContainerContext from '../../context/ContainerContext';
import FristForDokumentasjonUtløptPanel from '../frist-for-dokumentasjon-utløpt-panel/FristForDokumentasjonUtløptPanel';

interface DokumentoversiktMessagesProps {
  dokumentoversikt: Dokumentoversikt;
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
    return null;
  }
  const { ustrukturerteDokumenter } = dokumentoversikt;

  const visFristForDokumentasjonUtløptMelding =
    ustrukturerteDokumenter.length === 0 && !dokumentoversikt.harGyldigSignatur();

  const visHåndterNyeDokumenterMelding =
    !dokumentoversikt.harGyldigSignatur() && dokumentoversikt.harDokumenter() && !visFristForDokumentasjonUtløptMelding;

  const erPleiepengerSluttfaseFagsak = fagsakYtelseType === FagsakYtelseType.PLEIEPENGER_SLUTTFASE;

  return (
    <>
      {harRegistrertDiagnosekode === false && (
        <Box marginBottom={Margin.large}>
          <Alert size="small" variant="warning">
            Diagnosekode mangler. Du må legge til en diagnosekode for å vurdere tilsyn og pleie.
          </Alert>
        </Box>
      )}
      {visFristForDokumentasjonUtløptMelding && !readOnly && (
        <>
          <Box marginBottom={Margin.large}>
            <Alert size="small" variant="warning">
              {erPleiepengerSluttfaseFagsak ? (
                <>Dokumentasjon signert av lege eller helseinstitusjon mangler. </>
              ) : (
                <>Dokumentasjon signert av sykehuslege/spesialisthelsetjenesten mangler. </>
              )}
              Sett saken på vent mens du innhenter mer dokumentasjon.
            </Alert>
          </Box>
          <Box marginBottom={Margin.large}>
            <FristForDokumentasjonUtløptPanel
              onProceedClick={() => onFinished({ ikkeVentPåGodkjentLegeerklæring: true })}
            />
          </Box>
        </>
      )}
      {visHåndterNyeDokumenterMelding && fagsakYtelseType !== FagsakYtelseType.PLEIEPENGER_SLUTTFASE && (
        <Box marginBottom={Margin.large}>
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
        <Box marginBottom={Margin.large}>
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
