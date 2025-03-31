import React from 'react';

import { Label } from '@navikt/ds-react';
import classNames from 'classnames';

export interface LabelledContentProps {
  label: string | React.ReactNode;
  children: React.ReactNode;
  labelTag?: React.ElementType;
  indentContent?: boolean;
}

export const LabelledContent = ({ label, children, labelTag, indentContent }: LabelledContentProps) => {
  const cl = classNames('mt-2', {
    'border-solid border-t-0 border-r-0 border-b-0 border-l-4 border-[#c9c9c9] py-[3px] pl-[13px]': indentContent,
  });
  return (
    <div>
      <Label className="font-bold" as={labelTag || 'p'}>
        {label}
      </Label>
      <div className={cl}>
        <div>{children}</div>
      </div>
    </div>
  );
};
