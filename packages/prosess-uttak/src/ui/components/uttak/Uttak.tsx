import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort, HelpText, Table } from '@navikt/ds-react';
import {
  ChevronIconBlack,
  ContentWithTooltip,
  GreenCheckIconFilled,
  OnePersonIconGray,
  RedCrossIconFilled,
  TwoPersonsWithOneHighlightedIconGray,
} from '@navikt/ft-plattform-komponenter';
import classNames from 'classnames/bind';
import * as React from 'react';
import { Collapse } from 'react-collapse';
import { useFeatureToggles } from '@fpsak-frontend/shared-components';
import AnnenPart from '../../../constants/AnnenPart';
import Årsaker from '../../../constants/Årsaker';
import { harÅrsak } from '../../../util/årsakUtils';
import Vilkårsliste from '../../../vilkårsliste/Vilkårsliste';
import ContainerContext from '../../context/ContainerContext';
import Endringsstatus from '../icons/Endringsstatus';
import NyUttakDetaljer from '../uttak-detaljer/NyUttakDetaljer';
import GammelUttakDetaljer from '../uttak-detaljer/GammelUttakDetaljer';
import { UttaksperiodeMedInntektsgradering } from '../../../types';

import styles from './uttak.module.css';

const cx = classNames.bind(styles);

interface UttakProps {
  uttak: UttaksperiodeMedInntektsgradering;
  erValgt: boolean;
  velgPeriode: () => void;
  withBorderTop?: boolean;
}

const Uttak = ({ uttak, erValgt, velgPeriode, withBorderTop = false }: UttakProps): JSX.Element => {
  const [featureToggles] = useFeatureToggles();
  const { periode, uttaksgrad, inngangsvilkår, pleiebehov, årsaker, endringsstatus, manueltOverstyrt } = uttak;
  const { erFagytelsetypeLivetsSluttfase } = React.useContext(ContainerContext);

  const harUtenomPleiebehovÅrsak = harÅrsak(årsaker, Årsaker.UTENOM_PLEIEBEHOV);
  const harPleiebehov = !harUtenomPleiebehovÅrsak && pleiebehov && pleiebehov > 0;
  const erGradertMotInntekt = uttak.inntektsgradering !== undefined;

  const uttakGradIndikatorCls = cx('uttak__indikator', {
    uttak__indikator__avslått: uttaksgrad === 0,
    uttak__indikator__innvilget: uttaksgrad > 0,
    'uttak__indikator__innvilget--delvis--inntekt': erGradertMotInntekt,
    'uttak__indikator__innvilget--delvis':
      !erGradertMotInntekt && årsaker.some(årsak => årsak === Årsaker.GRADERT_MOT_TILSYN),
  });

  const harOppfyltAlleInngangsvilkår = !harÅrsak(årsaker, Årsaker.INNGANGSVILKÅR_IKKE_OPPFYLT);

  return (
    <>
      <Table.Row className={`${erValgt ? styles.uttak__expandedRow : ''} ${styles.uttak__row}`} onClick={velgPeriode}>
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''} `}>
          {periode.getFirstAndLastWeek()}
        </Table.DataCell>
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''}`}>
          <BodyShort>
            {periode.prettifyPeriod()}
            {manueltOverstyrt && (
              <>
                <PersonPencilFillIcon
                  className="ml-1 align-middle text-2xl text-border-warning"
                  title="Manuelt overstyrt"
                />
                <HelpText
                  wrapperClassName="inline-flex align-middle ml-2"
                  onClick={e => {
                    e.stopPropagation();
                  }}
                >
                  Uttaksgrad og/eller utbetalingsgrad er manuelt overstyrt av saksbehandler.
                </HelpText>
              </>
            )}
          </BodyShort>
        </Table.DataCell>
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''} ${styles.uttak__vilkarIconContainer}`}>
          {harOppfyltAlleInngangsvilkår ? <GreenCheckIconFilled /> : <RedCrossIconFilled />}
        </Table.DataCell>
        {erFagytelsetypeLivetsSluttfase && (
          <Table.DataCell>{uttaksgrad === 0 ? <RedCrossIconFilled /> : <GreenCheckIconFilled />}</Table.DataCell>
        )}
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''}`}>
          <div className={styles.uttak__iconContainer}>
            {harPleiebehov ? <GreenCheckIconFilled /> : <RedCrossIconFilled />}
          </div>
          {harPleiebehov && !erFagytelsetypeLivetsSluttfase ? `${pleiebehov}%` : null}
        </Table.DataCell>
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''}`}>
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
        </Table.DataCell>

        <Table.DataCell className={`${styles.uttak__uttaksgrad} ${withBorderTop ? styles.borderTop : ''}`}>
          <p className={styles.uttak__uttaksgrad__tekst}>{`${uttaksgrad} %`}</p>
          <div className={uttakGradIndikatorCls} />
        </Table.DataCell>
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''} `}>
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
        </Table.DataCell>
      </Table.Row>
      <tr className={`${erValgt ? '' : styles.collapseRow} ${styles.expandedRow}`}>
        <td colSpan={erFagytelsetypeLivetsSluttfase ? 8 : 7}>
          <Collapse isOpened={erValgt}>
            <div className={styles.expanded}>
              {harOppfyltAlleInngangsvilkår ? (
                <>
                  {featureToggles.BRUK_INNTEKTSGRADERING_I_UTTAK ? (
                    <NyUttakDetaljer uttak={uttak} manueltOverstyrt={manueltOverstyrt} />
                  ) : (
                    <GammelUttakDetaljer uttak={uttak} />
                  )}
                </>
              ) : (
                <Vilkårsliste inngangsvilkår={inngangsvilkår} />
              )}
            </div>
          </Collapse>
        </td>
      </tr>
    </>
  );
};
export default Uttak;
