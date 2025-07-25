import { Period } from '@navikt/ft-utils';

import {
  CheckmarkCircleFillIcon,
  ChevronRightIcon,
  ExclamationmarkTriangleFillIcon,
  XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';
import { Tooltip } from '@navikt/ds-react';
import styles from './periodeRad.module.css';
import type { ResultatType } from './VurderingsperiodeNavigasjon';
import { Resultat } from './VurderingsperiodeNavigasjon';
interface OwnProps {
  perioder: Period[];
  resultat?: ResultatType;
  active?: boolean;
  handleClick: () => void;
}

const renderStatusIcon = (resultat?: ResultatType) => {
  if (!resultat || resultat === Resultat.MÅ_VURDERES) {
    return (
      <ExclamationmarkTriangleFillIcon
        title="Perioden må vurderes"
        fontSize="1.5rem"
        style={{ color: 'var(--ac-alert-icon-warning-color,var(--a-icon-warning))' }}
      />
    );
  }

  if (
    resultat === Resultat.GODKJENT_MANUELT ||
    resultat === Resultat.OPPFYLT ||
    resultat === Resultat.GODKJENT ||
    resultat === Resultat.GODKJENT_AUTOMATISK
  ) {
    return (
      <Tooltip content="Vilkåret er oppfylt">
        <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--a-surface-success)' }} />
      </Tooltip>
    );
  }
  if (
    resultat === Resultat.IKKE_GODKJENT_MANUELT ||
    resultat === Resultat.IKKE_OPPFYLT ||
    resultat === Resultat.IKKE_GODKJENT
  ) {
    return (
      <XMarkOctagonFillIcon
        title="Vilkåret er ikke oppfylt"
        fontSize={24}
        style={{ color: 'var(--a-surface-danger)' }}
      />
    );
  }
  return null;
};

export const RadStatus = ({ resultat }: { resultat?: ResultatType }) => {
  return <div className="min-w-[50px]">{renderStatusIcon(resultat)}</div>;
};

export const RadDato = ({ perioder, active }: { perioder: Period[]; active: boolean }) => {
  return (
    <div className="flex ml-3 items-center">
      <div className={`min-w-[10.125rem] ${active ? '' : 'text-blue-500 underline'}`}>
        {perioder.map(v => (
          <div key={v.prettifyPeriod()}>
            {v.asListOfDays().length > 1 ? v.prettifyPeriod() : v.prettifyPeriod().split(' - ')[0]}
          </div>
        ))}
      </div>
    </div>
  );
};

export const RadChevron = ({ active }: { active: boolean }) => {
  return (
    <div className="mr-4 float-right">
      {active ? <ChevronRightIcon fontSize={24} /> : <ChevronRightIcon fontSize={24} className="opacity-50" />}
    </div>
  );
};

export const PeriodeRad = ({ perioder, resultat, active = false, handleClick }: OwnProps) => (
  <div
    className={`${styles.interactiveListElement} ${active ? styles.interactiveListElementActive : styles.interactiveListElementInactive}`}
  >
    <button
      className="flex bg-transparent border-none cursor-pointer outline-none text-left w-full p-4"
      onClick={handleClick}
    >
      <div className="flex justify-between w-full">
        <div className="flex items-center">
          <RadStatus resultat={resultat} />
          <RadDato perioder={perioder} active={active} />
        </div>
        <RadChevron active={active} />
      </div>
    </button>
  </div>
);
