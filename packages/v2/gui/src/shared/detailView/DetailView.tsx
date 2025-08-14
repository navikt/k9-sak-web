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
      {border && <div className="border-none bg-ax-border-neutral-subtle h-[2px] mt-4" />}
      {children}
    </div>
  );
};

export const Periodevisning = ({ perioder }: { perioder: Period[] }) => {
  if (perioder.length === 0) {
    return null;
  }

  return (
    <div data-testid="Periode" className="flex gap-2">
      <CalendarIcon fontSize="20" className="flex-shrink-0" />
      {perioder.length === 1 ? (
        <BodyShort size="small">{perioder[0]?.prettifyPeriod()}</BodyShort>
      ) : (
        <BodyShort size="small">{perioder.map(periode => periode.prettifyPeriod()).join(', ')}</BodyShort>
      )}
    </div>
  );
};

export default DetailView;
