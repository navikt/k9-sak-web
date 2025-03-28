import React from 'react';

import { Label } from '@navikt/ds-react';
import classNames from 'classnames';

export interface LabelledContentProps {
  label: string | React.ReactNode;
  content: React.ReactNode;
  labelTag?: React.ElementType;
  indentContent?: boolean;
}

export const LabelledContent = ({ label, content, labelTag, indentContent }: LabelledContentProps) => {
  const cl = classNames('mt-2', {
    'border-l-4 border-[#c9c9c9] py-[3px] pl-[13px]': indentContent,
  });
  return (
    <div>
      <Label size="small" className="font-bold" as={labelTag || 'p'}>
        {label}
      </Label>
      <div className={cl}>
        <div>{content}</div>
      </div>
    </div>
  );
};
