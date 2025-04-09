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
const cls = `border border-solid border-[#c6c2bf] rounded p-6 bg-[#cce1f342] ${className ?? ""}`
  return (
    <div className={cls}>
      <div className="flex items-center justify-between">
        <Heading size="small" level="2">
          {title}
        </Heading>
        {contentAfterTitleRenderer && contentAfterTitleRenderer()}
      </div>
      {children}
    </div>
  );
};

export default DetailViewV2;
