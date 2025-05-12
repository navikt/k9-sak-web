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
import * as React from 'react';
import { Collapse } from 'react-collapse';
import AnnenPart from '../../../constants/AnnenPart';
import Årsaker from '../../../constants/Årsaker';
import { UttaksperiodeMedInntektsgradering } from '../../../types';
import { harÅrsak } from '../../../util/årsakUtils';
import Vilkårsliste from '../../../vilkårsliste/Vilkårsliste';
import ContainerContext from '../../context/ContainerContext';
import Endringsstatus from '../icons/Endringsstatus';
import UttakDetaljerV2Wrapper from '../uttak-detaljer/UttakDetaljerV2Wrapper';

import styles from './uttak.module.css';

import type { JSX } from 'react';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';

const cx = classNames.bind(styles);

interface UttakProps {
  uttak: UttaksperiodeMedInntektsgradering;
  erValgt: boolean;
  velgPeriode: () => void;
  withBorderTop?: boolean;
}

const UttakRad = ({ uttak, erValgt, velgPeriode, withBorderTop = false }: UttakProps): JSX.Element => {
  const { periode, uttaksgrad, inngangsvilkår, pleiebehov, årsaker, endringsstatus, manueltOverstyrt } = uttak;
  const containerContext = React.useContext(ContainerContext);
  const erFagytelsetypeLivetsSluttfase = fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE === containerContext?.ytelsetype;
  const erOpplæringspenger = fagsakYtelsesType.OPPLÆRINGSPENGER === containerContext?.ytelsetype;

  const arbeidsforhold = containerContext?.arbeidsforhold ?? {};

  const harUtenomPleiebehovÅrsak = harÅrsak(årsaker, Årsaker.UTENOM_PLEIEBEHOV);
  const harPleiebehov = !harUtenomPleiebehovÅrsak && pleiebehov && pleiebehov > 0;
  const visPleiebehovProsent = !erOpplæringspenger && !erFagytelsetypeLivetsSluttfase;
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
          <BodyShort as="div">
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
          {harOppfyltAlleInngangsvilkår ? (
            <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--a-surface-success)' }} />
          ) : (
            <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--a-surface-danger)' }} />
          )}
        </Table.DataCell>
        {erFagytelsetypeLivetsSluttfase && (
          <Table.DataCell>
            {uttaksgrad === 0 ? (
              <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--a-surface-danger)' }} />
            ) : (
              <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--a-surface-success)' }} />
            )}
          </Table.DataCell>
        )}
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''}`}>
          <div className={styles.uttak__iconContainer}>
            {harPleiebehov ? (
              <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--a-surface-success)' }} />
            ) : (
              <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--a-surface-danger)' }} />
            )}
          </div>
          {harPleiebehov && visPleiebehovProsent ? `${pleiebehov}%` : null}
        </Table.DataCell>
        {!erOpplæringspenger && (
          <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''}`}>
            {uttak.annenPart === AnnenPart.ALENE && <PersonFillIcon title="Søker" fontSize="1.5rem" />}
            {uttak.annenPart === AnnenPart.MED_ANDRE && (
              <Tooltip content="Søker/Annen part">
                <PersonGroupFillIcon fontSize="1.5rem" />
              </Tooltip>
            )}
          </Table.DataCell>
        )}

        <Table.DataCell className={`${styles.uttak__uttaksgrad} ${withBorderTop ? styles.borderTop : ''}`}>
          <p className={styles.uttak__uttaksgrad__tekst}>{`${uttaksgrad} %`}</p>
          <div className={uttakGradIndikatorCls} />
        </Table.DataCell>
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''} `}>
          <div className={styles.uttak__lastColumn}>
            <div className={styles.uttak__behandlerIcon}>
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
      <tr className={`${erValgt ? '' : styles.collapseRow} ${styles.expandedRow}`}>
        <td colSpan={erFagytelsetypeLivetsSluttfase ? 8 : 7}>
          <Collapse isOpened={erValgt}>
            <div className={styles.expanded}>
              {harOppfyltAlleInngangsvilkår ? (
                <UttakDetaljerV2Wrapper
                  uttak={uttak}
                  manueltOverstyrt={manueltOverstyrt}
                  erFagytelsetypeLivetsSluttfase={erFagytelsetypeLivetsSluttfase}
                  arbeidsforhold={arbeidsforhold}
                />
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
