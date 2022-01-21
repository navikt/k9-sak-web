import Lenke from 'nav-frontend-lenker';
import * as React from 'react';
import { DocumentIcon } from '@navikt/k9-react-components';
import styles from './dokumentKnapp.less';

interface DokumentKnappProps {
    href: string;
}

const DokumentKnapp = ({ href }: DokumentKnappProps): JSX.Element => (
    <Lenke href={href} target="_blank" className={styles.dokumentKnapp}>
        <DocumentIcon />
        Åpne dokument
    </Lenke>
);

export default DokumentKnapp;
