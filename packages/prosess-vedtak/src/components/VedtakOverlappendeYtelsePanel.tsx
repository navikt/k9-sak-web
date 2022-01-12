import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import Tidslinje from '@fpsak-frontend/tidslinje/src/components/pleiepenger/Tidslinje';
import TidslinjeRad from '@fpsak-frontend/tidslinje/src/components/pleiepenger/types/TidslinjeRad';
import Periode from '@fpsak-frontend/tidslinje/src/components/pleiepenger/types/Periode';
import { KodeverkMedNavn, OverlappendePeriode, OverlappendePeriodeTidslinje } from '@k9-sak-web/types';
import { BorderBox } from '@fpsak-frontend/shared-components';
import { EtikettInfo, EtikettFokus } from 'nav-frontend-etiketter';
import styles from './VedtakOverlappendeYtelsePanel.less';

interface Props {
    overlappendeYtelser: OverlappendePeriode[];
    alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

export const VedtakOverlappendeYtelsePanelImpl: React.FC<Props & WrappedComponentProps> = ({
    overlappendeYtelser,
    alleKodeverk,
    intl
}) => {
    const [valgtPeriode, setValgtPeriode] = React.useState<Periode<OverlappendePeriode> | null>(null);

    const utledYtelseType = (ytelseTypeKode: string) => {
        if (alleKodeverk.FagsakYtelseType && alleKodeverk.FagsakYtelseType.length > 0) {
            return alleKodeverk.FagsakYtelseType.find((ytelseType) => ytelseType.kode === ytelseTypeKode).navn;
        }
        return ytelseTypeKode;
    }

    const utledFagSystem = (fagSystemKode: string) => {
        if (alleKodeverk.Fagsystem && alleKodeverk.Fagsystem.length > 0) {
            return alleKodeverk.Fagsystem.find((system) => system.kode === fagSystemKode).navn;
        }
        return fagSystemKode;
    }

    const utledKeyFraRad = (rad: OverlappendePeriode, index: number) =>
        `${rad.kilde.kode}-${rad.kilde.kodeverk}-${rad.ytelseType.kode}-${rad.ytelseType.kodeverk}-${index}`;

    /**
     * Sett opp radene som brukes i Tidslinjen
     */
    const rader = overlappendeYtelser.map((rad, radIndex): TidslinjeRad<OverlappendePeriode> => ({
        id: `rad-${radIndex}`,
        perioder: rad.overlappendePerioder.map((periode, periodeIndex) => ({
            fom: periode.fom,
            tom: periode.tom,
            id: `rad-${radIndex}-periode-${periodeIndex}`,
            hoverText: `${intl.formatMessage({ id: 'VedtakForm.OverlappendeYtelserKilde' })} ${utledFagSystem(rad.kilde.kode)}`,
            periodeinfo: {
                kilde: rad.kilde,
                ytelseType: rad.ytelseType,
                overlappendePerioder: rad.overlappendePerioder,
            }
        })),
    }));

    /**
     * Sett opp korresponderende rader til sidekolonnen
     */
    const sideKolonneRader = overlappendeYtelser.map((rad, index) => {
        return (<span className={styles.sideKolonne} key={utledKeyFraRad(rad, index)}>
            {`${utledYtelseType(rad.ytelseType.kode)}`}
        </span>)
    });

    const velgPeriodeHandler = (eventProps: any) => {
        console.log("prop", eventProps);
        const raden: TidslinjeRad<OverlappendePeriode> = rader.find((rad) =>
            rad.perioder.find((periode) => periode.id === eventProps.items[0])
        );
        setValgtPeriode(raden.perioder.find((periode) => periode.id === eventProps.items[0]));
    };

    return <>
        <BorderBox>
            test
            {overlappendeYtelser && overlappendeYtelser.length > 0 && <Tidslinje
                rader={rader}
                velgPeriode={velgPeriodeHandler}
                valgtPeriode={valgtPeriode}
                sideContentRader={sideKolonneRader}
            />}

            {valgtPeriode && (
                <BorderBox>
                    <header>Detaljer om periode</header>
                    <div className={styles.periodeDetaljer}>
                        <EtikettFokus className={styles.periodeDetalj}>
                            <strong>{intl.formatMessage({ id: 'VedtakForm.OverlappendeYtelserKilde' })}</strong>
                            {utledFagSystem(valgtPeriode.periodeinfo.kilde.kode)}
                        </EtikettFokus>
                        <EtikettInfo className={styles.periodeDetalj}>
                            <strong>{intl.formatMessage({ id: 'VedtakForm.OverlappendeYtelserYtelse' })}</strong>
                            {utledYtelseType(valgtPeriode.periodeinfo.ytelseType.kode)}
                        </EtikettInfo>
                        <EtikettInfo className={styles.periodeDetalj}>
                            <strong>{intl.formatMessage({ id: 'VedtakForm.OverlappendeYtelserPeriode' })}</strong>
                            {valgtPeriode.fom} - {valgtPeriode.tom}
                        </EtikettInfo>
                    </div>
                </BorderBox>
            )}

        </BorderBox>
    </>;
}

export default injectIntl(VedtakOverlappendeYtelsePanelImpl);
