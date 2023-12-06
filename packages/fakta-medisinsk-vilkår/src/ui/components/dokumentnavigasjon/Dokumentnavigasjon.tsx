import { Accordion, BodyShort } from '@navikt/ds-react';
import { InteractiveList } from '@navikt/ft-plattform-komponenter';
import React from 'react';
import { Dokument, Dokumenttype } from '../../../types/Dokument';
import Dokumentfilter from '../dokumentfilter/Dokumentfilter';
import StrukturertDokumentElement from '../strukturet-dokument-element/StrukturertDokumentElement';
import UstrukturertDokumentElement from '../ustrukturert-dokument-element/UstrukturertDokumentElement';
import styles from './dokumentnavigasjon.module.css';

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
  const updateDokumenttypeFilter = type =>
    dokumenttypeFilter.includes(type)
      ? setDokumenttypeFilter(dokumenttypeFilter.filter(v => v !== type))
      : setDokumenttypeFilter(dokumenttypeFilter.concat([type]));

  const filtrerteDokumenter = dokumenter.filter(
    dokument => dokumenttypeFilter.includes(dokument.type) && erIkkeDuplikat(dokument),
  );

  const dokumentElementer = filtrerteDokumenter.map(lagDokumentelement);

  return (
    <div className={styles.dokumentnavigasjon}>
      <Accordion>
        <Accordion.Item defaultOpen={expandedByDefault}>
          <Accordion.Header>{tittel}</Accordion.Header>
          <Accordion.Content>
            <div className={styles.dokumentnavigasjon__container}>
              <div className={styles.dokumentnavigasjon__columnHeadings}>
                <div className={styles['dokumentnavigasjon__columnHeading--first']}>
                  <BodyShort weight="semibold" size="small">
                    Status
                  </BodyShort>
                </div>
                {!displayFilterOption && (
                  <div className={styles['dokumentnavigasjon__columnHeading--second']}>
                    <BodyShort weight="semibold" size="small">
                      Type
                    </BodyShort>
                  </div>
                )}
                {displayFilterOption && (
                  <Dokumentfilter
                    className={styles['dokumentnavigasjon__columnHeading--second']}
                    text="Type"
                    filters={dokumenttypeFilter}
                    onFilterChange={updateDokumenttypeFilter}
                  />
                )}
                <div className={styles['dokumentnavigasjon__columnHeading--third']}>
                  <BodyShort weight="semibold" size="small">
                    Datert
                  </BodyShort>
                </div>
                <div className={styles['dokumentnavigasjon__columnHeading--fourth']}>
                  <BodyShort weight="semibold" size="small">
                    Part
                  </BodyShort>
                </div>
              </div>
              {dokumentElementer.length === 0 && (
                <div style={{ padding: '0.5rem 1rem 1rem 1rem' }}>
                  <BodyShort size="small">Ingen dokumenter å vise</BodyShort>
                </div>
              )}
              <InteractiveList
                elements={dokumentElementer
                  .filter(element => dokumenttypeFilter.includes(element?.dokument?.type))
                  .map((element, currentIndex) => ({
                    content: element.renderer(),
                    active: element.dokument === valgtDokument,
                    key: `${currentIndex}`,
                    onClick: () => onDokumentValgt(element.dokument),
                  }))}
              />
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default Dokumentnavigasjon;
