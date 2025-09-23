import {
  CheckmarkCircleFillIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PersonFillIcon,
  PersonGroupFillIcon,
  PersonPencilFillIcon,
  XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';
import { BodyShort, Button, HelpText, Table, Tooltip } from '@navikt/ds-react';
import classNames from 'classnames/bind';
import { Collapse } from 'react-collapse';
import type { JSX } from 'react';
import {
  BehandlingDtoSakstype,
  UttaksperiodeInfoAnnenPart,
  UttaksperiodeInfoÅrsaker,
} from '@k9-sak-web/backend/k9sak/generated';
import { harÅrsak } from '../utils/årsakUtils';
import Vilkårsliste from '../components/vilkårsliste/Vilkårsliste';
import Endringsstatus from '../components/icons/Endringsstatus';
import UttakDetaljer from '../uttak-detaljer/UttakDetaljer';
import { useUttakContext } from '../context/UttakContext';
import type { UttaksperiodeBeriket } from '../Uttak';
import { getFirstAndLastWeek, prettifyPeriod } from '../utils/periodUtils';
import styles from './uttak.module.css';

const cx = classNames.bind(styles);

interface UttakProps {
  uttak: UttaksperiodeBeriket;
  erValgt: boolean;
  velgPeriode: () => void;
  withBorderTop?: boolean;
}

const UttakRad = ({ uttak, erValgt, velgPeriode, withBorderTop = false }: UttakProps): JSX.Element => {
  const { erSakstype } = useUttakContext();
  const {
    periode,
    uttaksgrad,
    inngangsvilkår,
    pleiebehov,
    årsaker = [],
    endringsstatus,
    manueltOverstyrt = false,
    inntektgradering,
  } = uttak;
  const harUtenomPleiebehovÅrsak = harÅrsak(årsaker, UttaksperiodeInfoÅrsaker.UTENOM_PLEIEBEHOV);
  const harPleiebehov = !harUtenomPleiebehovÅrsak && pleiebehov && pleiebehov > 0;
  const visPleiebehovProsent = !erSakstype(BehandlingDtoSakstype.PLEIEPENGER_NÆRSTÅENDE);
  const erGradertMotInntekt = inntektgradering !== undefined;

  const uttakGradIndikatorCls = cx('uttak__indikator', {
    uttak__indikator__avslått: uttaksgrad === 0,
    uttak__indikator__innvilget: (uttaksgrad ?? 0) > 0,
    'uttak__indikator__innvilget--delvis--inntekt': erGradertMotInntekt,
    'uttak__indikator__innvilget--delvis':
      !erGradertMotInntekt && årsaker.some(årsak => årsak === UttaksperiodeInfoÅrsaker.GRADERT_MOT_TILSYN),
  });

  const harOppfyltAlleInngangsvilkår = !harÅrsak(årsaker, UttaksperiodeInfoÅrsaker.INNGANGSVILKÅR_IKKE_OPPFYLT);
  return (
    <>
      <Table.Row
        className={`${erValgt ? styles['uttak__expandedRow'] : ''} ${styles['uttak__row']}`}
        onClick={velgPeriode}
      >
        <Table.DataCell className={`${withBorderTop ? styles['borderTop'] : ''} `}>
          {getFirstAndLastWeek(periode.fom, periode.tom)}
        </Table.DataCell>
        <Table.DataCell className={`${withBorderTop ? styles['borderTop'] : ''}`}>
          <BodyShort as="div">
            {prettifyPeriod(periode.fom, periode.tom)}
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
        <Table.DataCell
          className={`${withBorderTop ? styles['borderTop'] : ''} ${styles['uttak__vilkarIconContainer']}`}
        >
          {harOppfyltAlleInngangsvilkår ? (
            <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--a-surface-success)' }} />
          ) : (
            <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--a-surface-danger)' }} />
          )}
        </Table.DataCell>
        {erSakstype(BehandlingDtoSakstype.PLEIEPENGER_NÆRSTÅENDE) && (
          <Table.DataCell>
            {uttaksgrad === 0 ? (
              <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--a-surface-danger)' }} />
            ) : (
              <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--a-surface-success)' }} />
            )}
          </Table.DataCell>
        )}
        <Table.DataCell className={`${withBorderTop ? styles['borderTop'] : ''}`}>
          <div className={styles['uttak__iconContainer']}>
            {harPleiebehov ? (
              <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--a-surface-success)' }} />
            ) : (
              <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--a-surface-danger)' }} />
            )}
          </div>
          {harPleiebehov && visPleiebehovProsent ? `${pleiebehov}%` : null}
        </Table.DataCell>
        <Table.DataCell className={`${withBorderTop ? styles['borderTop'] : ''}`}>
          {uttak.annenPart === UttaksperiodeInfoAnnenPart.ALENE && <PersonFillIcon title="Søker" fontSize="1.5rem" />}
          {uttak.annenPart === UttaksperiodeInfoAnnenPart.MED_ANDRE && (
            <Tooltip content="Søker/Annen part">
              <PersonGroupFillIcon fontSize="1.5rem" />
            </Tooltip>
          )}
        </Table.DataCell>

        <Table.DataCell className={`${styles['uttak__uttaksgrad']} ${withBorderTop ? styles['borderTop'] : ''}`}>
          <p className={styles['uttak__uttaksgrad__tekst']}>{`${uttaksgrad} %`}</p>
          <div className={uttakGradIndikatorCls} />
        </Table.DataCell>
        <Table.DataCell className={`${withBorderTop ? styles['borderTop'] : ''} `}>
          <div className={styles['uttak__lastColumn']}>
            <div className={styles['uttak__behandlerIcon']}>
              <Endringsstatus status={endringsstatus} />
            </div>
            <Button
              size="xsmall"
              variant="tertiary-neutral"
              onClick={velgPeriode}
              aria-label={erValgt ? 'Lukk' : 'Åpne'}
              aria-expanded={erValgt}
              icon={erValgt ? <ChevronUpIcon fontSize={32} /> : <ChevronDownIcon fontSize={32} />}
            />
          </div>
        </Table.DataCell>
      </Table.Row>
      <tr className={`${erValgt ? '' : styles['collapseRow']} ${styles['expandedRow']}`}>
        <td colSpan={erSakstype(BehandlingDtoSakstype.PLEIEPENGER_NÆRSTÅENDE) ? 8 : 7}>
          <Collapse isOpened={erValgt}>
            <div className={styles['expanded']}>
              {harOppfyltAlleInngangsvilkår ? (
                <UttakDetaljer uttak={uttak} manueltOverstyrt={manueltOverstyrt} />
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
export default UttakRad;
