import React, { FunctionComponent } from 'react';
import checkSvg from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import avslåttSvg from '@fpsak-frontend/assets/images/avslaatt_hover.svg';
import svgKvinne from '@fpsak-frontend/assets/images/kvinne.svg';
import svgMann from '@fpsak-frontend/assets/images/mann.svg';
import Image from '@fpsak-frontend/shared-components/src/Image';
import Table from '@fpsak-frontend/shared-components/src/table/Table';
import TableRow from '@fpsak-frontend/shared-components/src/table/TableRow';
import TableColumn from '@fpsak-frontend/shared-components/src/table/TableColumn';
import { KjønnkodeEnum } from '@k9-sak-web/types/src/Kjønnkode';
import { UtfallEnum } from './dto/Utfall';
import styles from './uttakTabell.less';
import Uttaksperiode from './types/Uttaksperiode';
import Person from './types/Person';

interface UttakTabellProps {
  periode: Uttaksperiode;
  person: Person;
}

const UttakTabell: FunctionComponent<UttakTabellProps> = ({ periode, person }) => {
  const headerCodes = ['EMPTY', 'UttakTabell.Periode', 'UttakTabell.Utfall', 'UttakTabell.Grad', 'UttakTabell.Årsak'];
  const { navn, kjønn } = person;
  const { fom, tom, utfall, grad, årsaker } = periode;
  return (
    <Table noHover headerTextCodes={headerCodes}>
      <TableRow>
        <TableColumn className={styles.personColumn}>
          <span className={styles.personCell}>
            <span className={styles.navn}>{navn.fornavn}</span>
            <Image src={kjønn === KjønnkodeEnum.KVINNE ? svgKvinne : svgMann} className={styles.ikon} />
            <Image src={utfall === UtfallEnum.INNVILGET ? checkSvg : avslåttSvg} className={styles.ikon} />
          </span>
        </TableColumn>
        <TableColumn>{fom + tom}</TableColumn>
        <TableColumn>{utfall}</TableColumn>
        <TableColumn>{grad}</TableColumn>
        <TableColumn>
          {årsaker && årsaker.length
            ? // eslint-disable-next-line react/no-array-index-key
              årsaker.map(({ årsakstype }, index) => <div key={index}>{årsakstype}</div>)
            : '-'}
        </TableColumn>
      </TableRow>
    </Table>
  );
};

export default UttakTabell;
