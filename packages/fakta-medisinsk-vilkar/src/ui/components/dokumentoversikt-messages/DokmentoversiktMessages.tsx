import { Box, Margin } from '@navikt/k9-react-components';
import Alertstripe from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import React from 'react';
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
    const { onFinished, readOnly } = React.useContext(ContainerContext);
    if (!dokumentoversikt) {
        return null;
    }
    const { ustrukturerteDokumenter } = dokumentoversikt;

    const visFristForDokumentasjonUtløptMelding =
        ustrukturerteDokumenter.length === 0 && !dokumentoversikt.harGyldigSignatur();

    const visHåndterNyeDokumenterMelding =
        !dokumentoversikt.harGyldigSignatur() &&
        dokumentoversikt.harDokumenter() &&
        !visFristForDokumentasjonUtløptMelding;

    return (
        <>
            {harRegistrertDiagnosekode === false && (
                <Box marginBottom={Margin.large}>
                    <Alertstripe type="advarsel">
                        Diagnosekode mangler. Du må legge til en diagnosekode for å vurdere tilsyn og pleie.
                    </Alertstripe>
                </Box>
            )}
            {visFristForDokumentasjonUtløptMelding && !readOnly && (
                <>
                    <Box marginBottom={Margin.large}>
                        <Alertstripe type="advarsel">
                            Dokumentasjon signert av sykehuslege/spesialisthelsetjenesten mangler. Sett saken på vent
                            mens du innhenter mer dokumentasjon.
                        </Alertstripe>
                    </Box>
                    <Box marginBottom={Margin.large}>
                        <FristForDokumentasjonUtløptPanel
                            onProceedClick={() => onFinished({ ikkeVentPåGodkjentLegeerklæring: true })}
                        />
                    </Box>
                </>
            )}
            {visHåndterNyeDokumenterMelding && (
                <>
                    <Box marginBottom={Margin.large}>
                        <Alertstripe type="advarsel">
                            Dokumentasjon signert av sykehuslege/spesialisthelsetjenesten mangler. Håndter eventuelle
                            nye dokumenter, eller sett saken på vent mens du innhenter mer dokumentasjon.
                        </Alertstripe>
                    </Box>
                </>
            )}
            {dokumentoversikt.harDokumenter() === false && (
                <Alertstripe type="info">Ingen dokumenter å vise</Alertstripe>
            )}
            {kanNavigereVidere && !readOnly && (
                <Box marginBottom={Margin.large}>
                    <Alertstripe type="info">
                        Dokumentasjon av sykdom er ferdig vurdert og du kan gå videre i vurderingen.
                        <Knapp
                            type="hoved"
                            htmlType="button"
                            style={{ marginLeft: '2rem', marginBottom: '-0.25rem' }}
                            onClick={navigerTilNesteSteg}
                            mini
                            id="gåVidereFraDokumentasjonKnapp"
                        >
                            Fortsett
                        </Knapp>
                    </Alertstripe>
                </Box>
            )}
        </>
    );
};

export default DokumentoversiktMessages;
