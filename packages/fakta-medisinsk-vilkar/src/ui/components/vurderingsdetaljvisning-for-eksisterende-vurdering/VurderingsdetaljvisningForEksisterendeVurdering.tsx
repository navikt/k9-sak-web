import React from 'react';
import Vurderingselement from '../../../types/Vurderingselement';
import VurderingsoppsummeringForKontinuerligTilsynOgPleie from
    '../vurderingsoppsummering-for-kontinuerlig-tilsyn-og-pleie/VurderingsoppsummeringForKontinuerligTilsynOgPleie';
import VurderingsdetaljerFetcher from '../vurderingsdetaljer-fetcher/VurderingsdetaljerFetcher';
import LinkRel from '../../../constants/LinkRel';
import { findHrefByRel, findLinkByRel } from '../../../util/linkUtils';
import ManuellVurdering from '../../../types/ManuellVurdering';
import buildInitialFormStateForEdit from '../vilkårsvurdering-av-tilsyn-og-pleie/initialFormStateUtil';
import VurderingAvTilsynsbehovForm from '../vurdering-av-tilsynsbehov-form/VurderingAvTilsynsbehovForm';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import EndreVurderingController from '../endre-vurdering-controller/EndreVurderingController';
import ContainerContext from '../../context/ContainerContext';
import VurderingContext from '../../context/VurderingContext';
import Vurderingstype from '../../../types/Vurderingstype';
import VurderingAvToOmsorgspersonerForm from '../vurdering-av-to-omsorgspersoner-form/VurderingAvToOmsorgspersonerForm';
import VurderingsoppsummeringForToOmsorgspersoner from
    '../vurderingsoppsummering-for-to-omsorgspersoner/VurderingsoppsummeringForToOmsorgspersoner';
import VurderingsoppsummeringForInnleggelsesperiode from
    '../vurderingsoppsummering-for-innleggelsesperiode/VurderingsoppsummeringForInnleggelsesperiode';
import InnleggelsesperiodeVurdering from '../../../types/InnleggelsesperiodeVurdering';

interface VurderingsdetaljvisningForEksisterendeProps {
    vurderingsoversikt: Vurderingsoversikt;
    vurderingselement: Vurderingselement;
    editMode: boolean;
    onEditClick: () => void;
    onAvbrytClick: () => void;
    onVurderingLagret: () => void;
}

const getFormComponent = (vurderingstype: Vurderingstype) => {
    if (vurderingstype === Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE) {
        return VurderingAvTilsynsbehovForm;
    }
    if (vurderingstype === Vurderingstype.TO_OMSORGSPERSONER) {
        return VurderingAvToOmsorgspersonerForm;
    }
    return null;
};

const getSummaryComponent = (vurderingstype: Vurderingstype) => {
    if (vurderingstype === Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE) {
        return VurderingsoppsummeringForKontinuerligTilsynOgPleie;
    }
    if (vurderingstype === Vurderingstype.TO_OMSORGSPERSONER) {
        return VurderingsoppsummeringForToOmsorgspersoner;
    }
    return null;
};

const erAutomatiskVurdertInnleggelsesperiode = (vurderingselement: Vurderingselement) =>
    !(vurderingselement as ManuellVurdering).resultat;

const VurderingsdetaljvisningForEksisterendeVurdering = ({
    vurderingsoversikt,
    vurderingselement,
    editMode,
    onEditClick,
    onAvbrytClick,
    onVurderingLagret,
}: VurderingsdetaljvisningForEksisterendeProps): JSX.Element => {
    const { endpoints } = React.useContext(ContainerContext);
    const { vurderingstype } = React.useContext(VurderingContext);

    if (erAutomatiskVurdertInnleggelsesperiode(vurderingselement)) {
        return (
            <VurderingsoppsummeringForInnleggelsesperiode
                vurdering={vurderingselement as InnleggelsesperiodeVurdering}
                vurderingstype={vurderingstype}
            />
        );
    }

    const manuellVurdering = vurderingselement as ManuellVurdering;
    const url = findHrefByRel(LinkRel.HENT_VURDERING, manuellVurdering.links);

    return (
        <VurderingsdetaljerFetcher
            url={url}
            contentRenderer={(vurdering) => {
                if (editMode) {
                    const endreLink = findLinkByRel(LinkRel.ENDRE_VURDERING, manuellVurdering.links);
                    const vurderingsversjon = vurdering.versjoner[0];

                    const FormComponent = getFormComponent(vurderingstype);
                    return (
                        <EndreVurderingController
                            endreVurderingLink={endreLink}
                            dataTilVurderingUrl={endpoints.dataTilVurdering}
                            formRenderer={(dokumenter, onSubmit, isSubmitting) => (
                                <FormComponent
                                    defaultValues={buildInitialFormStateForEdit(vurderingsversjon, vurderingstype)}
                                    resterendeVurderingsperioder={vurderingsoversikt.resterendeVurderingsperioder}
                                    perioderSomKanVurderes={vurderingsoversikt.perioderSomKanVurderes}
                                    dokumenter={dokumenter}
                                    onSubmit={onSubmit}
                                    onAvbryt={onAvbrytClick}
                                    isSubmitting={isSubmitting}
                                />
                            )}
                            vurderingsid={vurderingselement.id}
                            vurderingsversjonId={vurderingsversjon.versjon}
                            onVurderingLagret={onVurderingLagret}
                        />
                    );
                }

                const SummaryComponent = getSummaryComponent(vurderingstype);
                return <SummaryComponent vurdering={vurdering} redigerVurdering={onEditClick} />;
            }}
        />
    );
};

export default VurderingsdetaljvisningForEksisterendeVurdering;
