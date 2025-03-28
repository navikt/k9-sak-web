import React from 'react';

import { Heading } from '@navikt/ds-react';
import classnames from 'classnames';

export interface DetailViewProps {
  title: string;
  children: React.ReactNode;
  contentAfterTitleRenderer?: () => React.ReactNode;
  className?: string;
}

export const DetailViewV2 = ({ title, children, contentAfterTitleRenderer, className }: DetailViewProps) => {
  const cls = classnames(
    'border border-solid border-[#c6c2bf] rounded p-6',
    className
      ? {
          [className]: !!className,
        }
      : {},
  );
  return (
    <div className={cls}>
      <div className="flex items-baseline justify-between">
        <Heading size="small" level="2">
          {title}
        </Heading>
        {contentAfterTitleRenderer && contentAfterTitleRenderer()}
      </div>
      {children}
    </div>
  );
};
