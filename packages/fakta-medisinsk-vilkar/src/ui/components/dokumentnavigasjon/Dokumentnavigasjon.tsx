import { InteractiveList } from '@navikt/k9-react-components';
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { Dokument, Dokumenttype } from '../../../types/Dokument';
import Dokumentfilter from '../dokumentfilter/Dokumentfilter';
import StrukturertDokumentElement from '../strukturet-dokument-element/StrukturertDokumentElement';
import UstrukturertDokumentElement from '../ustrukturert-dokument-element/UstrukturertDokumentElement';
import styles from './dokumentnavigasjon.less';

interface DokumentnavigasjonProps {
    tittel: string;
    dokumenter: Dokument[];
    onDokumentValgt: (dokument: Dokument) => void;
    valgtDokument: Dokument;
    expandedByDefault?: boolean;
    displayFilterOption?: boolean;
}

const erIkkeDuplikat = (dokument: Dokument) => dokument.duplikatAvId === null;
const lagDokumentelement = (dokument: Dokument) => ({
    dokument,
    renderer: () =>
        dokument.type === Dokumenttype.UKLASSIFISERT ? (
            <UstrukturertDokumentElement dokument={dokument} />
        ) : (
            <StrukturertDokumentElement dokument={dokument} />
        ),
});

const Dokumentnavigasjon = ({
    tittel,
    dokumenter,
    onDokumentValgt,
    valgtDokument,
    expandedByDefault,
    displayFilterOption,
}: DokumentnavigasjonProps): JSX.Element => {
    const [dokumenttypeFilter, setDokumenttypeFilter] = React.useState([...Object.values(Dokumenttype)]);
    const updateDokumenttypeFilter = (type) =>
        dokumenttypeFilter.includes(type)
            ? setDokumenttypeFilter(dokumenttypeFilter.filter((v) => v !== type))
            : setDokumenttypeFilter(dokumenttypeFilter.concat([type]));

    const [listExpanded, setListExpanded] = React.useState(expandedByDefault || false);

    const filtrerteDokumenter = dokumenter.filter(
        (dokument) => dokumenttypeFilter.includes(dokument.type) && erIkkeDuplikat(dokument)
    );

    const dokumentElementer = filtrerteDokumenter.map(lagDokumentelement);

    return (
        <div className={styles.dokumentnavigasjon}>
            <EkspanderbartpanelBase tittel={tittel} apen={listExpanded} onClick={() => setListExpanded(!listExpanded)}>
                <div className={styles.dokumentnavigasjon__container}>
                    <div className={styles.dokumentnavigasjon__columnHeadings}>
                        <Element className={styles['dokumentnavigasjon__columnHeading--first']}>Status</Element>
                        {!displayFilterOption && (
                            <Element className={styles['dokumentnavigasjon__columnHeading--second']}>Type</Element>
                        )}
                        {displayFilterOption && (
                            <Dokumentfilter
                                className={styles['dokumentnavigasjon__columnHeading--second']}
                                text="Type"
                                filters={dokumenttypeFilter}
                                onFilterChange={updateDokumenttypeFilter}
                            />
                        )}
                        <Element className={styles['dokumentnavigasjon__columnHeading--third']}>Datert</Element>
                        <Element className={styles['dokumentnavigasjon__columnHeading--fourth']}>Part</Element>
                    </div>
                    {dokumentElementer.length === 0 && (
                        <div style={{ padding: '0.5rem 1rem 1rem 1rem' }}>
                            <Normaltekst>Ingen dokumenter å vise</Normaltekst>
                        </div>
                    )}
                    <InteractiveList
                        elements={dokumentElementer
                            .filter((element) => dokumenttypeFilter.includes(element?.dokument?.type))
                            .map((element, currentIndex) => ({
                                content: element.renderer(),
                                active: element.dokument === valgtDokument,
                                key: `${currentIndex}`,
                                onClick: () => onDokumentValgt(element.dokument),
                            }))}
                    />
                </div>
            </EkspanderbartpanelBase>
        </div>
    );
};

export default Dokumentnavigasjon;
