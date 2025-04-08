import React from 'react';

import { Label } from '@navikt/ds-react';
import classNames from 'classnames';

export interface LabelledContentProps {
  label: string | React.ReactNode;
  content?: React.ReactNode;
  labelTag?: React.ElementType;
  indentContent?: boolean;
  size?: 'medium' | 'small';
}

export const LabelledContent = ({ label, content, labelTag, indentContent, size = 'medium' }: LabelledContentProps) => {
  const cl = classNames('mt-2', {
    'border-solid border-t-0 border-r-0 border-b-0 border-l-4 border-[#c9c9c9] py-[3px] pl-[13px]': indentContent,
  });
  return (
    <div>
      <Label className="font-bold" as={labelTag || 'p'} size={size}>
        {label}
      </Label>
      <div className={cl}>{content}</div>
    </div>
  );
};
