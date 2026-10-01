import type { JSX } from 'react';
import { Collapse } from 'react-collapse';
import {
  CheckmarkCircleFillIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PersonFillIcon,
  PersonGroupFillIcon,
  PersonPencilFillIcon,
  XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';
import { Årsak } from '@k9-sak-web/backend/k9sak/kodeverk/uttak/Årsak.js';
import { AnnenPart } from '@k9-sak-web/backend/k9sak/kodeverk/uttak/AnnenPart.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { BodyShort, Button, HelpText, Table, Tooltip } from '@navikt/ds-react';
import { harÅrsak } from '../utils/årsakUtils.js';
import Vilkårsliste from '../components/vilkårsliste/Vilkårsliste.js';
import Endringsstatus from '../components/icons/Endringsstatus.js';
import UttakDetaljer from '../uttak-detaljer/UttakDetaljer.js';
import { useUttakContext } from '../context/UttakContext.js';
import type { UttaksperiodeBeriket } from '../types/UttaksperiodeBeriket.js';
import { getFirstAndLastWeek, prettifyPeriod } from '../utils/periodUtils.js';
import styles from './uttak.module.css';
import { finnGraderingForUttak, finnUttakGradIndikatorCls } from './uttakGradIndikator.js';

interface UttakProps {
  uttak: UttaksperiodeBeriket;
  erValgt: boolean;
  velgPeriode: () => void;
  withBorderTop?: boolean;
}

const UttakRad = ({ uttak, erValgt, velgPeriode, withBorderTop = false }: UttakProps): JSX.Element => {
  const { erSakstype, inntektsgraderinger } = useUttakContext();
  const {
    periode,
    uttaksgrad,
    inngangsvilkår,
    pleiebehov,
    årsaker = [],
    endringsstatus,
    manueltOverstyrt = false,
  } = uttak;

  const harUtenomPleiebehovÅrsak = harÅrsak(årsaker, Årsak.UTENOM_PLEIEBEHOV);
  const harPleiebehov = !harUtenomPleiebehovÅrsak && pleiebehov && pleiebehov > 0;
  const visPleiebehovProsent = !erSakstype(fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE);

  const { erGradertMotInntekt, erGradertMotTilsyn } = finnGraderingForUttak(uttak, inntektsgraderinger);
  const uttakGradIndikatorCls = finnUttakGradIndikatorCls(uttaksgrad, erGradertMotInntekt, erGradertMotTilsyn);

  const harOppfyltAlleInngangsvilkår = !harÅrsak(årsaker, Årsak.INNGANGSVILKÅR_IKKE_OPPFYLT);
  return (
    <>
      <Table.Row className={`${erValgt ? styles.uttakExpandedRow : ''}`} onClick={velgPeriode}>
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''} `}>
          {getFirstAndLastWeek(periode.fom, periode.tom)}
        </Table.DataCell>
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''}`}>
          <BodyShort as="div">
            {prettifyPeriod(periode.fom, periode.tom)}
            {manueltOverstyrt && (
              <>
                <PersonPencilFillIcon
                  className="ml-1 align-middle text-2xl text-ax-warning-500"
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
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''} ${styles.uttakVilkarIconContainer}`}>
          {harOppfyltAlleInngangsvilkår ? (
            <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--ax-bg-success-strong)' }} />
          ) : (
            <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--ax-bg-danger-strong)' }} />
          )}
        </Table.DataCell>
        {erSakstype(fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE) && (
          <Table.DataCell>
            {uttaksgrad === 0 ? (
              <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--ax-bg-danger-strong)' }} />
            ) : (
              <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--ax-bg-success-strong)' }} />
            )}
          </Table.DataCell>
        )}
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''}`}>
          <div className={styles.uttakIconContainer}>
            {harPleiebehov ? (
              <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--ax-bg-success-strong)' }} />
            ) : (
              <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--ax-bg-danger-strong)' }} />
            )}
          </div>
          {harPleiebehov && visPleiebehovProsent ? `${pleiebehov}%` : null}
        </Table.DataCell>
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''}`}>
          {uttak.annenPart === AnnenPart.ALENE && <PersonFillIcon title="Søker" fontSize="1.5rem" />}
          {uttak.annenPart === AnnenPart.MED_ANDRE && (
            <Tooltip content="Søker/Annen part">
              <PersonGroupFillIcon fontSize="1.5rem" />
            </Tooltip>
          )}
        </Table.DataCell>

        <Table.DataCell className={`${styles.uttakUttaksgrad} ${withBorderTop ? styles.borderTop : ''}`}>
          <p className={styles.uttakUttaksgradTekst}>{`${uttaksgrad} %`}</p>
          <div className={uttakGradIndikatorCls} />
        </Table.DataCell>
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''} `}>
          <div className={styles.uttakLastColumn}>
            <div className={styles.uttakBehandlerIcon}>
              <Endringsstatus status={endringsstatus} />
            </div>
            <Button
              data-color="neutral"
              size="xsmall"
              variant="tertiary"
              onClick={velgPeriode}
              aria-label={erValgt ? 'Lukk' : 'Åpne'}
              aria-expanded={erValgt}
              icon={erValgt ? <ChevronUpIcon fontSize={32} /> : <ChevronDownIcon fontSize={32} />}
            />
          </div>
        </Table.DataCell>
      </Table.Row>
      <tr className={`${erValgt ? '' : styles.collapseRow} ${styles.expandedRow}`}>
        <td colSpan={erSakstype(fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE) ? 8 : 7}>
          <Collapse isOpened={erValgt}>
            <div className={styles.expanded}>
              {harOppfyltAlleInngangsvilkår ? (
                <UttakDetaljer uttak={uttak} manueltOverstyrt={manueltOverstyrt} />
              ) : (
                <Vilkårsliste vilkår={inngangsvilkår ?? {}} />
              )}
            </div>
          </Collapse>
        </td>
      </tr>
    </>
  );
};
export default UttakRad;
