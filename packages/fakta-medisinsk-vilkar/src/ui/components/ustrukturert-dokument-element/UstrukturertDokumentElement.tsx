import { prettifyDateString } from '@navikt/k9-date-utils';
import { ContentWithTooltip, OnePersonIconGray, OnePersonOutlineGray, WarningIcon } from '@navikt/k9-react-components';
import React from 'react';
import { Dokument, dokumentLabel } from '../../../types/Dokument';
import styles from './ustrukturertDokumentElement.less';

interface UstrukturertDokumentElementProps {
    dokument: Dokument;
}

const UstrukturertDokumentElement = ({
    dokument: { datert, mottattDato, annenPartErKilde },
}: UstrukturertDokumentElementProps): JSX.Element => {
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
        <div className={styles.ustrukturertDokumentElement}>
            <ContentWithTooltip tooltipText="Dokumentet må håndteres">
                <WarningIcon />
            </ContentWithTooltip>
            <div className={styles.ustrukturertDokumentElement__texts}>
                <p className={styles.ustrukturertDokumentElement__texts__type} id="ikkeKlassifisertText">
                    <span className={styles.visuallyHidden}>Type</span>
                    {dokumentLabel.UKLASSIFISERT}
                </p>
                <span className={styles.ustrukturertDokumentElement__texts__date}>
                    <span className={styles.visuallyHidden}>Datert</span>
                    <ContentWithTooltip inline tooltipText="Dato dokumentet ble mottatt">
                        {`${prettifyDateString(datert || mottattDato)}*`}
                    </ContentWithTooltip>
                </span>
                <span className={styles.ustrukturertDokumentElement__texts__part}>
                    <span className={styles.visuallyHidden}>Part</span>
                    {parterLabel()}
                </span>
            </div>
        </div>
    );
};

export default UstrukturertDokumentElement;
