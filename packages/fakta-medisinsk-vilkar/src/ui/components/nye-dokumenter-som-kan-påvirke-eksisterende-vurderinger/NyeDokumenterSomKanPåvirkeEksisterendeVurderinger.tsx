import React from 'react';
import { Box, DocumentIcon, Margin } from '@navikt/k9-react-components';
import { prettifyDateString } from '@navikt/k9-date-utils';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';
import Dokument, { Dokumenttype } from '../../../types/Dokument';
import { findLinkByRel } from '../../../util/linkUtils';
import LinkRel from '../../../constants/LinkRel';
import styles from './nyeDokumenterSomKanPåvirkeEksisterendeVurderinger.less';

interface NyeDokumenterListeProps {
    dokumenter: Dokument[];
}

const getDokumentLabel = (type: Dokumenttype) => {
    if (type === Dokumenttype.LEGEERKLÆRING) {
        return 'Legeerklæring';
    }
    if (type === Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER) {
        return 'Andre medisinske opplysninger';
    }
    return null;
};

const NyeDokumenterListe = ({ dokumenter }: NyeDokumenterListeProps) => (
    <>
        {dokumenter.map((dokument) => {
            const dokumentLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, dokument.links);
            return (
                <p key={dokument.id}>
                    Nytt dokument:
                    <a
                        href={dokumentLink.href}
                        className={styles.nyeDokumenterSomKanPåvirkeEksisterendeVurderinger__dokumentLink}
                    >
                        <span className={styles.nyeDokumenterSomKanPåvirkeEksisterendeVurderinger__ikonContainer}>
                            <DocumentIcon />
                        </span>
                        {`${getDokumentLabel(dokument.type)} (datert ${prettifyDateString(dokument.datert)})`}
                    </a>
                </p>
            );
        })}
    </>
);

interface NyeDokumenterSomKanPåvirkeEksisterendeVurderingerProps {
    dokumenter: Dokument[];
    onEndringerRegistrertClick: () => void;
    isSubmitting: boolean;
}

const NyeDokumenterSomKanPåvirkeEksisterendeVurderinger = ({
    dokumenter,
    onEndringerRegistrertClick,
    isSubmitting,
}: NyeDokumenterSomKanPåvirkeEksisterendeVurderingerProps): JSX.Element => (
    <div className={styles.nyeDokumenterSomKanPåvirkeEksisterendeVurderinger}>
        <Box marginTop={Margin.large}>
            <div className={styles.nyeDokumenterSomKanPåvirkeEksisterendeVurderinger__content}>
                <Element>Vurder om nytt dokument fører til endringer i eksisterende vurderinger.</Element>
                <NyeDokumenterListe dokumenter={dokumenter} />
                <Box marginTop={Margin.large}>
                    <Hovedknapp
                        mini
                        onClick={() => onEndringerRegistrertClick()}
                        disabled={isSubmitting}
                        spinner={isSubmitting}
                        id="bekreftNyeDokumenterVurdertKnapp"
                    >
                        Eventuelle endringer er registrert
                    </Hovedknapp>
                </Box>
            </div>
        </Box>
    </div>
);

export default NyeDokumenterSomKanPåvirkeEksisterendeVurderinger;
