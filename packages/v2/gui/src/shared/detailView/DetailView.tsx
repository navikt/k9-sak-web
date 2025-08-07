import React from 'react';

import { BodyShort, Heading } from '@navikt/ds-react';
import { CalendarIcon } from '@navikt/aksel-icons';
import type { Period } from '@navikt/ft-utils';

export interface DetailViewProps {
  title: string;
  children: React.ReactNode;
  contentAfterTitleRenderer?: () => React.ReactNode;
  belowTitleContent?: React.ReactNode;
  className?: string;
  border?: boolean;
  perioder?: Period[];
}

export const DetailView = ({
  title,
  children,
  contentAfterTitleRenderer,
  belowTitleContent,
  className,
  // Vi vil egentlig ha en border alle stedene denne er brukt. Men mange steder er den allerede implementert i "children"
  border = false,
  perioder,
}: DetailViewProps) => {
  const cls = `border border-solid border-[#c6c2bf] rounded p-6 bg-[#cce1f342] ${className ?? ''}`;
  return (
    <div className={cls}>
      <div className="flex items-center justify-between">
        <Heading size="small" level="2">
          {title}
        </Heading>

        {contentAfterTitleRenderer && contentAfterTitleRenderer()}
      </div>
      {perioder && <div className="mt-1">{<Periodevisning perioder={perioder} />}</div>}
      {belowTitleContent && <div className="mt-1">{belowTitleContent}</div>}
      {border && <div className="border-none bg-border-subtle h-[2px] mt-4" />}
      {children}
    </div>
  );
};

export const Periodevisning = ({ perioder }: { perioder: Period[] }) => {
  return (
    <div data-testid="Periode" className="flex gap-2">
      <CalendarIcon fontSize="20" />
      {perioder.map(periode => {
        const enkeltdag = periode.asListOfDays().length === 1;
        return (
          <div key={periode.fom + periode.tom}>
            <BodyShort size="small">
              {enkeltdag ? periode.prettifyPeriod().split(' - ')[0] : periode.prettifyPeriod()}
            </BodyShort>
          </div>
        );
      })}
    </div>
  );
};

export default DetailView;
