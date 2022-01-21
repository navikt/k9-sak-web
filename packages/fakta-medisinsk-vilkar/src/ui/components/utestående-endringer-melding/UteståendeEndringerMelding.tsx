import { Box, Margin } from '@navikt/k9-react-components';
import Alertstripe from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import ContainerContext from '../../context/ContainerContext';

const UteståendeEndringerMelding = (): JSX.Element => {
    const { onFinished } = React.useContext(ContainerContext);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    return (
        <Box marginBottom={Margin.medium}>
            <Alertstripe type="advarsel">
                <Normaltekst>
                    OBS! Det er gjort endringer i sykdomssteget. For at endringene som er gjort skal bli tatt med i
                    behandlingen, trykk på Fortsett.
                </Normaltekst>
                <Box marginTop={Margin.small}>
                    <Hovedknapp
                        mini
                        htmlType="button"
                        disabled={isSubmitting}
                        spinner={isSubmitting}
                        onClick={() => {
                            setIsSubmitting(true);
                            setTimeout(() => setIsSubmitting(false), 1500);
                            onFinished();
                        }}
                    >
                        Fortsett
                    </Hovedknapp>
                </Box>
            </Alertstripe>
        </Box>
    );
};

export default UteståendeEndringerMelding;
