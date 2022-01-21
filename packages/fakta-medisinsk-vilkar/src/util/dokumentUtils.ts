import { initializeDate } from '@navikt/k9-date-utils';
import { Dokument, Dokumenttype } from '../types/Dokument';
import {
    StrukturerDokumentFormFieldName as FieldName,
    StrukturerDokumentFormState,
} from '../types/StrukturerDokumentFormState';
import { ikkeDuplikatValue } from '../ui/components/strukturer-dokument-form/StrukturerDokumentForm';

export const finnBenyttedeDokumenter = (benyttedeDokumentIder: string[], alleDokumenter: Dokument[]): Dokument[] =>
    alleDokumenter.filter((dokument) => benyttedeDokumentIder.includes(dokument.id));

export const lagStrukturertDokument = (formState: StrukturerDokumentFormState, dokument: Dokument): Dokument => ({
    ...dokument,
    type: formState[FieldName.INNEHOLDER_MEDISINSKE_OPPLYSNINGER],
    datert: formState[FieldName.DATERT],
    duplikatAvId:
        formState[FieldName.DUPLIKAT_AV_ID] === ikkeDuplikatValue ? null : formState[FieldName.DUPLIKAT_AV_ID],
});

export const renderDokumenttypeText = (dokumenttype: Dokumenttype): string => {
    if (dokumenttype === Dokumenttype.LEGEERKLÆRING) {
        return 'Sykehus/spesialist.';
    }
    if (dokumenttype === Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER) {
        return 'Andre med. oppl.';
    }
    if (dokumenttype === Dokumenttype.MANGLER_MEDISINSKE_OPPLYSNINGER) {
        return 'Mangler med. oppl.';
    }
    return null;
};

export const dokumentSorter = (dok1: Dokument, dok2: Dokument): number => {
    const dok1Date = initializeDate(dok1.datert || dok1.mottattTidspunkt);
    const dok2Date = initializeDate(dok2.datert || dok2.mottattTidspunkt);
    if (dok1Date.isBefore(dok2Date)) {
        return 1;
    }
    if (dok2Date.isBefore(dok1Date)) {
        return -1;
    }

    if (dok1Date.isSame(dok2Date)) {
        if (dok1.id > dok2.id) {
            return 1;
        }

        if (dok2.id > dok1.id) {
            return -1;
        }
    }
    return 0;
};
