import { prettifyDateString } from '@navikt/k9-date-utils';
import { Box, DetailView, LabelledContent, LinkButton, Margin } from '@navikt/k9-react-components';
import Alertstripe from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import React from 'react';
import LinkRel from '../../../constants/LinkRel';
import Dokument, { Dokumenttype } from '../../../types/Dokument';
import { renderDokumenttypeText } from '../../../util/dokumentUtils';
import { findLinkByRel } from '../../../util/linkUtils';
import DokumentKnapp from '../dokument-knapp/DokumentKnapp';
import Duplikatliste from '../duplikatliste/Duplikatliste';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import styles from './strukturertDokumentDetaljer.less';

interface StrukturertDokumentDetaljerProps {
    dokument: Dokument;
    onEditDokumentClick: () => void;
    strukturerteDokumenter: Dokument[];
    onRemoveDuplikat: () => void;
}

const renderDokumenttypeContent = (dokumenttype: Dokumenttype) => {
    if (dokumenttype === Dokumenttype.LEGEERKLÆRING) {
        return <span>Ja, legeerklæring fra sykehus/spesialisthelsetjenesten</span>;
    }
    if (dokumenttype === Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER) {
        return (
            <span>Ja, andre medisinske opplysninger (f.eks. legeerklæring fra fastlege, uttalelse fra psykolog)</span>
        );
    }
    if (dokumenttype === Dokumenttype.MANGLER_MEDISINSKE_OPPLYSNINGER) {
        return <span>Dokumentet inneholder ikke medisinske opplysninger</span>;
    }
    return null;
};

const StrukturertDokumentDetaljer = ({
    dokument,
    onEditDokumentClick,
    strukturerteDokumenter,
    onRemoveDuplikat,
}: StrukturertDokumentDetaljerProps): JSX.Element => {
    const { type, datert, links, duplikater, duplikatAvId } = dokument;
    const harDuplikater = duplikater?.length > 0;
    const dokumentinnholdLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, links);
    const getDokumentDuplikater = () =>
        strukturerteDokumenter.filter((strukturertDokument) => strukturertDokument.duplikatAvId === dokument.id);

    const getOriginaltDokument = () => {
        const originaltDokument = strukturerteDokumenter.find(
            (strukturertDokument) => strukturertDokument.id === duplikatAvId
        );
        const dokumentLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, originaltDokument.links);

        return (
            <Lenke href={dokumentLink.href} target="_blank">
                {`${renderDokumenttypeText(originaltDokument.type)} - ${prettifyDateString(originaltDokument.datert)}`}
            </Lenke>
        );
    };

    return (
        <DetailView
            title="Om dokumentet"
            contentAfterTitleRenderer={() => (
                <WriteAccessBoundContent
                    contentRenderer={() => (
                        <LinkButton className={styles.endreLink} onClick={onEditDokumentClick}>
                            Endre dokument
                        </LinkButton>
                    )}
                />
            )}
        >
            {harDuplikater && (
                <Box marginTop={Margin.large}>
                    <Alertstripe type="info">Det finnes ett eller flere duplikater av dette dokumentet.</Alertstripe>
                </Box>
            )}
            {duplikatAvId && (
                <Box marginTop={Margin.large}>
                    <Alertstripe type="info">Dokumentet er et duplikat.</Alertstripe>
                </Box>
            )}
            <Box marginTop={Margin.xLarge}>
                <DokumentKnapp href={dokumentinnholdLink.href} />
            </Box>
            <Box marginTop={Margin.xLarge}>
                <LabelledContent
                    label="Inneholder dokumentet medisinske opplysninger?"
                    content={renderDokumenttypeContent(type)}
                />
            </Box>
            <Box marginTop={Margin.xLarge}>
                <LabelledContent label="Når er dokumentet datert?" content={prettifyDateString(datert)} />
            </Box>
            {harDuplikater && (
                <Box marginTop={Margin.xLarge}>
                    <LabelledContent
                        label="Duplikater av dette dokumentet:"
                        content={
                            <Duplikatliste dokumenter={getDokumentDuplikater()} onRemoveDuplikat={onRemoveDuplikat} />
                        }
                    />
                </Box>
            )}
            {duplikatAvId && (
                <Box marginTop={Margin.xLarge}>
                    <LabelledContent
                        label="Dokumentet er et duplikat av følgende dokument:"
                        content={getOriginaltDokument()}
                    />
                </Box>
            )}
        </DetailView>
    );
};

export default StrukturertDokumentDetaljer;
