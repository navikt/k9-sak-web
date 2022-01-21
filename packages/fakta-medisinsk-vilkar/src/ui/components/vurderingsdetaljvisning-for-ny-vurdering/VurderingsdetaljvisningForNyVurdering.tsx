import React from 'react';
import { Period } from '@navikt/k9-period-utils';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import { findLinkByRel } from '../../../util/linkUtils';
import LinkRel from '../../../constants/LinkRel';
import ContainerContext from '../../context/ContainerContext';
import Vurderingstype from '../../../types/Vurderingstype';
import VurderingAvTilsynsbehovForm, {
    FieldName as KTPFieldName,
    VurderingAvTilsynsbehovFormState,
} from '../vurdering-av-tilsynsbehov-form/VurderingAvTilsynsbehovForm';
import VurderingAvToOmsorgspersonerForm, {
    FieldName as TOFieldName,
    VurderingAvToOmsorgspersonerFormState,
} from '../vurdering-av-to-omsorgspersoner-form/VurderingAvToOmsorgspersonerForm';
import NyVurderingController from '../ny-vurdering-controller/NyVurderingController';
import VurderingContext from '../../context/VurderingContext';

interface VurderingsdetaljvisningForNyVurderingProps {
    vurderingsoversikt: Vurderingsoversikt;
    radForNyVurderingVises: boolean;
    onVurderingLagret: () => void;
    onAvbryt: () => void;
}

function makeDefaultValues(
    vurderingstype: Vurderingstype,
    perioder: Period[]
): VurderingAvToOmsorgspersonerFormState | VurderingAvTilsynsbehovFormState {
    if (vurderingstype === Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE) {
        return {
            [KTPFieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE]: '',
            [KTPFieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]: undefined,
            [KTPFieldName.PERIODER]: perioder,
            [KTPFieldName.DOKUMENTER]: [],
        };
    }
    if (vurderingstype === Vurderingstype.TO_OMSORGSPERSONER) {
        return {
            [TOFieldName.VURDERING_AV_TO_OMSORGSPERSONER]: '',
            [TOFieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]: undefined,
            [TOFieldName.PERIODER]: perioder,
            [TOFieldName.DOKUMENTER]: [],
        };
    }
    return null;
}

const VurderingsdetaljvisningForNyVurdering = ({
    vurderingsoversikt,
    onVurderingLagret,
    onAvbryt,
    radForNyVurderingVises,
}: VurderingsdetaljvisningForNyVurderingProps): JSX.Element => {
    const { readOnly } = React.useContext(ContainerContext);

    const opprettLink = findLinkByRel(LinkRel.OPPRETT_VURDERING, vurderingsoversikt.links);
    const resterendeVurderingsperioderDefaultValue = vurderingsoversikt.resterendeVurderingsperioder;

    const defaultPerioder = () => {
        if (resterendeVurderingsperioderDefaultValue?.length > 0) {
            return resterendeVurderingsperioderDefaultValue;
        }

        const skalViseValgfriePerioder =
            !readOnly && vurderingsoversikt?.resterendeValgfrieVurderingsperioder.length > 0;
        if (skalViseValgfriePerioder) {
            return vurderingsoversikt.resterendeValgfrieVurderingsperioder || [new Period('', '')];
        }

        return [new Period('', '')];
    };

    const { endpoints } = React.useContext(ContainerContext);
    const { vurderingstype } = React.useContext(VurderingContext);

    return (
        <NyVurderingController
            opprettVurderingLink={opprettLink}
            dataTilVurderingUrl={endpoints.dataTilVurdering}
            onVurderingLagret={onVurderingLagret}
            formRenderer={(dokumenter, onSubmit, isSubmitting) => {
                if (Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE === vurderingstype) {
                    return (
                        <VurderingAvTilsynsbehovForm
                            defaultValues={makeDefaultValues(vurderingstype, defaultPerioder())}
                            resterendeVurderingsperioder={resterendeVurderingsperioderDefaultValue}
                            perioderSomKanVurderes={vurderingsoversikt.perioderSomKanVurderes}
                            dokumenter={dokumenter}
                            onSubmit={onSubmit}
                            onAvbryt={radForNyVurderingVises ? () => onAvbryt() : undefined}
                            isSubmitting={isSubmitting}
                        />
                    );
                }
                if (Vurderingstype.TO_OMSORGSPERSONER === vurderingstype) {
                    return (
                        <VurderingAvToOmsorgspersonerForm
                            defaultValues={makeDefaultValues(vurderingstype, defaultPerioder())}
                            resterendeVurderingsperioder={resterendeVurderingsperioderDefaultValue}
                            perioderSomKanVurderes={vurderingsoversikt.perioderSomKanVurderes}
                            dokumenter={dokumenter}
                            onSubmit={onSubmit}
                            onAvbryt={radForNyVurderingVises ? () => onAvbryt() : undefined}
                            isSubmitting={isSubmitting}
                        />
                    );
                }
                return null;
            }}
        />
    );
};

export default VurderingsdetaljvisningForNyVurdering;
