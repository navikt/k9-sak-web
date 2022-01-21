import { Box, Margin, TitleWithUnderline, GreenCheckIcon, WarningIcon } from '@navikt/k9-react-components';
import React from 'react';
import IconWithText from '../icon-with-text/IconWithText';

interface SignertSeksjonProps {
    harGyldigSignatur: boolean;
}

const SignertSeksjon = ({ harGyldigSignatur }: SignertSeksjonProps): JSX.Element => (
    <div>
        <TitleWithUnderline>Godkjent signatur</TitleWithUnderline>
        <Box marginTop={Margin.medium}>
            {harGyldigSignatur && (
                <IconWithText
                    iconRenderer={() => <GreenCheckIcon />}
                    text="Det finnes dokumentasjon som er signert av sykehuslege eller lege fra spesialisthelsetjenesten."
                />
            )}
            {!harGyldigSignatur && (
                <IconWithText
                    iconRenderer={() => <WarningIcon />}
                    text="Ingen legeerklæring fra sykehuslege/spesialisthelsetjenesten registrert."
                />
            )}
        </Box>
    </div>
);

export default SignertSeksjon;
