import React from 'react';

import { Heading } from '@navikt/ds-react';
import classnames from 'classnames';

export interface DetailViewProps {
  title: string;
  children: React.ReactNode;
  contentAfterTitleRenderer?: () => React.ReactNode;
  className?: string;
}

export const DetailView = ({ title, children, contentAfterTitleRenderer, className }: DetailViewProps) => {
  const cls = classnames(
    'bg-[rgba(204,225,243,0.26)] border border-[#c6c2bf] rounded p-6',
    className
      ? {
          [className]: !!className,
        }
      : {},
  );
  return (
    <div className={cls}>
      <div className="flex items-baseline">
        <Heading size="small" level="2">
          {title}
        </Heading>
        {contentAfterTitleRenderer && (
          <div className="flex">{contentAfterTitleRenderer()}</div>
        )}
      </div>
      {children}
    </div>
  );
};
