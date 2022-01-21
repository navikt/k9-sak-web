import React from 'react';
import LinkRel from '../../../constants/LinkRel';
import Dokument, { Dokumenttype } from '../../../types/Dokument';
import { findLinkByRel } from '../../../util/linkUtils';
import StrukturerDokumentController from '../strukturer-dokument-controller/StrukturerDokumentController';
import StrukturertDokumentDetaljer from '../strukturert-dokument-detaljer/StrukturertDokumentDetaljer';

interface DokumentdetaljerProps {
    dokument: Dokument;
    onChange: () => void;
    editMode: boolean;
    onEditClick: () => void;
    strukturerteDokumenter: Dokument[];
}

const Dokumentdetaljer = ({
    dokument,
    onChange,
    editMode,
    onEditClick,
    strukturerteDokumenter,
}: DokumentdetaljerProps): JSX.Element => {
    const { type, links } = dokument;
    if (type === Dokumenttype.UKLASSIFISERT || editMode) {
        const strukturerDokumentLink = findLinkByRel(LinkRel.ENDRE_DOKUMENT, links);
        return (
            <StrukturerDokumentController
                dokument={dokument}
                strukturerDokumentLink={strukturerDokumentLink}
                onDokumentStrukturert={onChange}
                editMode={editMode}
                strukturerteDokumenter={strukturerteDokumenter}
            />
        );
    }
    return (
        <StrukturertDokumentDetaljer
            dokument={dokument}
            onEditDokumentClick={onEditClick}
            strukturerteDokumenter={strukturerteDokumenter}
            onRemoveDuplikat={onChange}
        />
    );
};

export default Dokumentdetaljer;
