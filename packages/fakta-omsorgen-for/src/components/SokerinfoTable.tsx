import React from 'react';
import PropTypes from 'prop-types';
import Table from '@fpsak-frontend/shared-components/src/table/Table';
import Image from '@fpsak-frontend/shared-components/src/Image';
import checkSvg from '@fpsak-frontend/assets/images/check.svg';
import TableRow from '@fpsak-frontend/shared-components/src/table/TableRow';
import TableColumn from '@fpsak-frontend/shared-components/src/table/TableColumn';
import { useIntl } from 'react-intl';
import styles from './sokerinfoTable.less';
import EksternLink from './EksternLink';

// TODO: Samme lengde på tables
const SokerinfoTable = ({ header, forhold }) => {
  // const alleForholdOppfylt = !forhold.find(forholdet => !forholdet.erOppfylt);
  const intl = useIntl();
  return (
    <Table
      headerTextCodes={[
        <>
          <span className={styles.tableheader}>
            {/* TODO: Riktig src ihht skisse. src for ikke alle forhold oppfylt? */}
            <Image src={checkSvg} />
            <span>{header}</span>
          </span>
        </>,
      ]}
      allowFormattedHeader
    >
      {forhold.map(forholdet => (
        <TableRow key={forholdet.forholdskode}>
          <TableColumn className={styles['sokerinfo--firstcol']}>{forholdet.forholdstekst}</TableColumn>
          <TableColumn className="bold">
            {forholdet.erOppfylt
              ? intl.formatMessage({ id: 'SokerinfoTable.Ja' })
              : intl.formatMessage({ id: 'SokerinfoTable.Nei' })}
          </TableColumn>
          <TableColumn>
            {/* TODO: link css. lage generell ekstern link? */}
            <EksternLink to={forholdet.link.to} text={forholdet.link.text} />
          </TableColumn>
        </TableRow>
      ))}
    </Table>
  );
};

SokerinfoTable.propTypes = {
  header: PropTypes.string.isRequired,
  forhold: PropTypes.arrayOf(
    PropTypes.shape({
      forholdstekst: PropTypes.string,
      forholdskode: PropTypes.string,
      erOppfylt: PropTypes.bool,
      link: PropTypes.shape({
        to: PropTypes.string,
        text: PropTypes.string,
      }),
    }),
  ).isRequired,
};

export default SokerinfoTable;
