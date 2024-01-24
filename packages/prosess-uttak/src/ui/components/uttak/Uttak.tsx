import {
  ChevronIconBlack,
  ContentWithTooltip,
  GreenCheckIconFilled,
  OnePersonIconGray,
  RedCrossIconFilled,
  TwoPersonsWithOneHighlightedIconGray,
} from '@navikt/ft-plattform-komponenter';
import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import classNames from 'classnames/bind';
import { Normaltekst } from 'nav-frontend-typografi';
import * as React from 'react';
import { Collapse } from 'react-collapse';
import AnnenPart from '../../../constants/AnnenPart';
import Årsaker from '../../../constants/Årsaker';
import { Uttaksperiode } from '../../../types/Uttaksperiode';
import { harÅrsak } from '../../../util/årsakUtils';
import Vilkårsliste from '../../../vilkårsliste/Vilkårsliste';
import Endringsstatus from '../icons/Endringsstatus';
import FullWidthRow from '../table/FullWidthRow';
import TableColumn from '../table/TableColumn';
import TableRow from '../table/TableRow';
import UttakDetaljer from '../uttak-detaljer/UttakDetaljer';
import styles from './uttak.css';
import ContainerContext from '../../context/ContainerContext';

const cx = classNames.bind(styles);

interface UttakProps {
  uttak: Uttaksperiode;
  erValgt: boolean;
  velgPeriode: () => void;
  withBorderTop?: boolean;
}

const Uttak = ({ uttak, erValgt, velgPeriode, withBorderTop = false }: UttakProps): JSX.Element => {
  const { periode, uttaksgrad, inngangsvilkår, pleiebehov, årsaker, endringsstatus, manueltOverstyrt } = uttak;
  const { erFagytelsetypeLivetsSluttfase } = React.useContext(ContainerContext);

  const harUtenomPleiebehovÅrsak = harÅrsak(årsaker, Årsaker.UTENOM_PLEIEBEHOV);
  const harPleiebehov = !harUtenomPleiebehovÅrsak && pleiebehov && pleiebehov > 0;

  const uttakGradIndikatorCls = cx('uttak__indikator', {
    uttak__indikator__avslått: uttaksgrad === 0,
    uttak__indikator__innvilget: uttaksgrad > 0,
    'uttak__indikator__innvilget--delvis': årsaker.some(årsak => årsak === Årsaker.GRADERT_MOT_TILSYN),
  });

  const harOppfyltAlleInngangsvilkår = !harÅrsak(årsaker, Årsaker.INNGANGSVILKÅR_IKKE_OPPFYLT);

  return (
    <>
      <TableRow className={`${erValgt ? styles.uttak__expandedRow : ''}`} onClick={velgPeriode}>
        <TableColumn className={`${withBorderTop ? styles.borderTop : ''}`}>
          <Normaltekst>{periode.prettifyPeriod()}</Normaltekst>
        </TableColumn>
        <TableColumn className={`${withBorderTop ? styles.borderTop : ''}`}>
          {harOppfyltAlleInngangsvilkår ? <GreenCheckIconFilled /> : <RedCrossIconFilled />}
        </TableColumn>
        {erFagytelsetypeLivetsSluttfase && (
          <TableColumn>{uttaksgrad === 0 ? <RedCrossIconFilled /> : <GreenCheckIconFilled />}</TableColumn>
        )}
        <TableColumn className={`${withBorderTop ? styles.borderTop : ''}`}>
          <div className={styles.uttak__iconContainer}>
            {harPleiebehov ? <GreenCheckIconFilled /> : <RedCrossIconFilled />}
          </div>
          {harPleiebehov && !erFagytelsetypeLivetsSluttfase ? `${pleiebehov}%` : null}
        </TableColumn>
        <TableColumn className={`${withBorderTop ? styles.borderTop : ''}`}>
          {uttak.annenPart === AnnenPart.ALENE && (
            <ContentWithTooltip tooltipText="Søker">
              <OnePersonIconGray />
            </ContentWithTooltip>
          )}
          {uttak.annenPart === AnnenPart.MED_ANDRE && (
            <ContentWithTooltip tooltipText="Søker/Annen part">
              <TwoPersonsWithOneHighlightedIconGray />
            </ContentWithTooltip>
          )}
        </TableColumn>

        <TableColumn className={`${styles.uttak__uttaksgrad} ${withBorderTop ? styles.borderTop : ''}`}>
          <p className={styles.uttak__uttaksgrad__tekst}>
            {`${uttaksgrad} %`} 
            {manueltOverstyrt && <PersonPencilFillIcon  className="ml-1 align-middle text-2xl text-border-warning" title="Manuelt overstyrt" />}
          </p>
          <div className={uttakGradIndikatorCls} />
        </TableColumn>
        <TableColumn className={`${withBorderTop ? styles.borderTop : ''}`}>
          <div className={styles.uttak__lastColumn}>
            <div className={styles.uttak__behandlerIcon}>
              <Endringsstatus status={endringsstatus} />
            </div>
            <button
              onClick={velgPeriode}
              type="button"
              className={`${styles.uttak__expandButton} ${erValgt && styles['uttak__expandButton--expanded']}`}
              aria-label={erValgt ? 'Lukk' : 'Åpne'}
              aria-expanded={erValgt}
            >
              <ChevronIconBlack />
            </button>
          </div>
        </TableColumn>
      </TableRow>
      <FullWidthRow colSpan={erFagytelsetypeLivetsSluttfase ? 7 : 6}>
        <Collapse isOpened={erValgt}>
          <div className={styles.expanded}>
            {harOppfyltAlleInngangsvilkår ? (
              <UttakDetaljer uttak={uttak} />
            ) : (
              <Vilkårsliste inngangsvilkår={inngangsvilkår} />
            )}
          </div>
        </Collapse>
      </FullWidthRow>
    </>
  );
};
export default Uttak;
