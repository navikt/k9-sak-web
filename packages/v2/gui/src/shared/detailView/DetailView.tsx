import React from 'react';

import { Heading } from '@navikt/ds-react';

export interface DetailViewProps {
  title: string;
  children: React.ReactNode;
  contentAfterTitleRenderer?: () => React.ReactNode;
  belowTitleContent?: React.ReactNode;
  className?: string;
  border?: boolean;
}

export const DetailView = ({
  title,
  children,
  contentAfterTitleRenderer,
  belowTitleContent,
  className,
  // Vi vil egentlig ha en border alle stedene denne er brukt. Men mange steder er den allerede implementert i "children"
  border = false,
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
      {belowTitleContent && <div className="mt-1">{belowTitleContent}</div>}
      {border && <div className="border-none bg-ax-border-neutral-subtle h-[2px] mt-4" />}
      {children}
    </div>
  );
};

export default DetailView;
