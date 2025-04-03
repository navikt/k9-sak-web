import { Label } from '@navikt/ds-react';
import classNames from 'classnames';
import React from 'react';
import styles from './labelledContent.module.css';

export interface LabelledContentProps {
  label: string | React.ReactNode;
  content: React.ReactNode;
  labelTag?: React.ElementType;
  indentContent?: boolean;
}

export const LabelledContent = ({ label, content, labelTag, indentContent }: LabelledContentProps) => {
  const cl = classNames(styles.content, {
    [styles.indentation]: indentContent,
  });
  return (
    <div>
      <Label size="small" as={labelTag || 'p'}>
        {label}
      </Label>
      <div className={cl}>
        <div>{content}</div>
      </div>
    </div>
  );
};
