import React, { FunctionComponent } from 'react';
import Table from '@fpsak-frontend/shared-components/src/table/Table';
import checkSvg from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import Image from '@fpsak-frontend/shared-components/src/Image';
import TableRow from '@fpsak-frontend/shared-components/src/table/TableRow';
import TableColumn from '@fpsak-frontend/shared-components/src/table/TableColumn';
import { useIntl } from 'react-intl';
import styles from './sokerinfoTable.less';
import EksternLink from './EksternLink';

interface SokerinfoTableProps {
  header: string;
  forhold: {
    forholdstekst: string;
    erOppfylt: boolean;
    link: {
      to: string;
      text: string;
    };
  }[];
}

const SokerinfoTable: FunctionComponent<SokerinfoTableProps> = ({ header, forhold }) => {
  // const alleForholdOppfylt = !forhold.find(forholdet => !forholdet.erOppfylt);
  const intl = useIntl();
  return (
    <Table
      headerColumnContent={[
        <>
          <span className={styles.tableheader}>
            {/* TODO: Riktig src ihht skisse. src for ikke alle forhold oppfylt? */}
            <Image src={checkSvg} />
            <span>{intl.formatMessage({ id: header })}</span>
          </span>
        </>,
      ]}
      noHover
    >
      {forhold
        .filter(forholdet => typeof forholdet.erOppfylt === 'boolean')
        .map(forholdet => (
          <TableRow key={forholdet.forholdstekst}>
            <TableColumn className={styles['sokerinfo--firstcol']}>
              {intl.formatMessage({ id: forholdet.forholdstekst })}
            </TableColumn>
            <TableColumn className="bold">
              {forholdet.erOppfylt
                ? intl.formatMessage({ id: 'SokerinfoTable.Ja' })
                : intl.formatMessage({ id: 'SokerinfoTable.Nei' })}
            </TableColumn>
            {forholdet.link && (
              <TableColumn>
                {/* TODO: link css. lage generell ekstern link? */}
                <EksternLink to={forholdet.link.to} text={forholdet.link.text} />
              </TableColumn>
            )}
          </TableRow>
        ))}
    </Table>
  );
};

export default SokerinfoTable;
