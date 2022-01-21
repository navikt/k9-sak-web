import { ContentWithTooltip, OnePersonIconGray } from '@navikt/k9-react-components';
import { Period } from '@navikt/k9-period-utils';
import React from 'react';
import styles from './vurderingsperioder.less';

interface VurderingsperioderProps {
    perioder: Period[];
    visParterLabel?: boolean;
    indicatorContentRenderer?: () => React.ReactNode;
}

const Vurderingsperioder = ({
    perioder,
    visParterLabel,
    indicatorContentRenderer,
}: VurderingsperioderProps): JSX.Element => (
    <div className={styles.vurderingsperioder} id="vurderingsperioder">
        {indicatorContentRenderer && (
            <>
                <span className={styles.visuallyHidden}>Type</span>
                <div className={styles.vurderingsperioder__indicator}>{indicatorContentRenderer()}</div>
            </>
        )}

        <div className={styles.vurderingsperioder__texts}>
            <div>
                {perioder.map((periode, index) => (
                    <p key={`${periode.fom}_${periode.tom}`} className={styles.vurderingsperioder__texts__period}>
                        {index === 0 && <span className={styles.visuallyHidden}>Perioder</span>}
                        {periode.prettifyPeriod()}
                    </p>
                ))}
            </div>
            {visParterLabel && (
                <div className={styles.vurderingsperioder__texts__parterIcon}>
                    <span className={styles.visuallyHidden}>Parter</span>
                    <ContentWithTooltip tooltipText="Søker">
                        <OnePersonIconGray />
                    </ContentWithTooltip>
                </div>
            )}
        </div>
    </div>
);

export default Vurderingsperioder;
