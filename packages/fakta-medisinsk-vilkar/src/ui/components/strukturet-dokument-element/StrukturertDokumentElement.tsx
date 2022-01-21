import { prettifyDateString } from '@navikt/k9-date-utils';
import {
    ContentWithTooltip,
    DuplicateDocumentsIcon,
    GreenCheckIconFilled,
    OnePersonIconGray,
    OnePersonOutlineGray,
} from '@navikt/k9-react-components';
import React from 'react';
import Dokument, { dokumentLabel } from '../../../types/Dokument';
import styles from './strukturertDokumentElement.less';

interface StrukturertDokumentElementProps {
    dokument: Dokument;
}

const StrukturertDokumentElement = ({
    dokument: { navn, datert, type, annenPartErKilde, duplikater },
}: StrukturertDokumentElementProps): JSX.Element => {
    const harDuplikater = duplikater?.length > 0;

    const getDokumenttype = () => {
        if (dokumentLabel[type]) {
            return dokumentLabel[type];
        }
        return navn;
    };

    const parterLabel = () => {
        if (annenPartErKilde) {
            return (
                <ContentWithTooltip tooltipText="Annen part" inline>
                    <OnePersonOutlineGray />
                </ContentWithTooltip>
            );
        }
        return (
            <ContentWithTooltip tooltipText="Søker" inline>
                <OnePersonIconGray />
            </ContentWithTooltip>
        );
    };

    return (
        <div className={styles.strukturertDokumentElement}>
            <span className={styles.visuallyHidden}>Status</span>
            <ContentWithTooltip tooltipText="Dokumentet er ferdig håndtert">
                <GreenCheckIconFilled />
            </ContentWithTooltip>
            <div className={styles.strukturertDokumentElement__texts}>
                <p className={styles.strukturertDokumentElement__texts__type}>
                    <span className={styles.visuallyHidden}>Type</span>
                    {getDokumenttype()}
                </p>
                <span className={styles.strukturertDokumentElement__texts__date}>
                    <span className={styles.visuallyHidden}>Datert</span>
                    {prettifyDateString(datert)}
                </span>
                <span className={styles.strukturertDokumentElement__texts__part}>
                    <span className={styles.visuallyHidden}>Part</span>
                    {parterLabel()}
                </span>
                {harDuplikater && (
                    <span className={styles.strukturertDokumentElement__texts__document}>
                        <ContentWithTooltip tooltipText="Det finnes ett eller flere duplikater av dette dokumentet">
                            <DuplicateDocumentsIcon />
                        </ContentWithTooltip>
                    </span>
                )}
            </div>
        </div>
    );
};

export default StrukturertDokumentElement;
