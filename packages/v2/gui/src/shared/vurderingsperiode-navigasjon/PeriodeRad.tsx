import {
  ContentWithTooltip,
  GreenCheckIconFilled,
  InstitutionIcon,
  RedCrossIconFilled,
  WarningIcon,
} from '@navikt/ft-plattform-komponenter';
import { Period } from '@navikt/ft-utils';

import { OverlayedIcons } from '../indicatorWithOverlay/IndicatorWithOverlay';
import type { ResultatType } from './VurderingsperiodeNavigasjon';
import { Resultat } from './VurderingsperiodeNavigasjon';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import styles from './periodeRad.module.css';
interface OwnProps {
  perioder: Period[];
  resultat?: ResultatType;
  active: boolean;
  handleClick: () => void;
}

const renderStatusIcon = (resultat?: ResultatType) => {
  if (!resultat || resultat === Resultat.MÅ_VURDERES) {
    return (
      <ContentWithTooltip tooltipText="Perioden må vurderes">
        <WarningIcon />
      </ContentWithTooltip>
    );
  }

  if (resultat === Resultat.GODKJENT_AUTOMATISK) {
    return (
      <ContentWithTooltip tooltipText="Vilkåret er automatisk oppfylt">
        <OverlayedIcons
          indicatorRenderer={() => <GreenCheckIconFilled />}
          overlayRenderer={() => <InstitutionIcon />}
        />
      </ContentWithTooltip>
    );
  }

  if (resultat === Resultat.IKKE_GODKJENT_AUTOMATISK) {
    return (
      <ContentWithTooltip tooltipText="Vilkåret er automatisk ikke oppfylt">
        <OverlayedIcons indicatorRenderer={() => <RedCrossIconFilled />} overlayRenderer={() => <InstitutionIcon />} />
      </ContentWithTooltip>
    );
  }
  if (resultat === Resultat.GODKJENT_MANUELT || resultat === Resultat.OPPFYLT || resultat === Resultat.GODKJENT) {
    return (
      <ContentWithTooltip tooltipText="Vilkåret er oppfylt">
        <GreenCheckIconFilled />
      </ContentWithTooltip>
    );
  }
  if (
    resultat === Resultat.IKKE_GODKJENT_MANUELT ||
    resultat === Resultat.IKKE_OPPFYLT ||
    resultat === Resultat.IKKE_GODKJENT
  ) {
    return (
      <ContentWithTooltip tooltipText="Vilkåret er ikke oppfylt">
        <RedCrossIconFilled />
      </ContentWithTooltip>
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
      {active ? <ChevronRightIcon fontSize={24} /> : <ChevronDownIcon fontSize={24} />}
    </div>
  );
};

export const PeriodeRad = ({ perioder, resultat, active, handleClick }: OwnProps) => (
  <div
    className={`${styles.interactiveListElement} ${active ? styles.interactiveListElementActive : styles.interactiveListElementInactive}`}
  >
    <button
      className="flex bg-transparent border-none cursor-pointer outline-none p-4 text-left w-full"
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
