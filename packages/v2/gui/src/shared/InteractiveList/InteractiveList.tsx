import React from 'react';
import classnames from 'classnames';

import { ChevronDownIcon, ChevronRightIcon } from '@navikt/aksel-icons';

import styles from './interactiveList.module.css';

export interface InteractiveListElement {
  content: React.ReactNode;
  onClick: () => void;
  active: boolean;
}

interface InteractiveListProps {
  elements: Array<InteractiveListElement & { key?: string }>;
}

const InteractiveListElement = (props: InteractiveListElement) => {
  const { content, active, onClick } = props;
  const cls = classnames(styles['interactiveListElement'], {
    [styles['interactiveListElement--active'] as string]: active,
    [styles['interactiveListElement--inactive'] as string]: !active,
  });

  return (
    <li className={cls}>
      <button className={styles['interactiveListElement__button']} type="button" onClick={onClick}>
        <span className={styles['interactiveListElement__button__contentContainer']}>
          {content}
          <div className="mr-4">{active ? <ChevronRightIcon fontSize={24} /> : <ChevronDownIcon fontSize={24} />}</div>
        </span>
      </button>
    </li>
  );  
};

export const InteractiveList = ({ elements }: InteractiveListProps) => (
  <ul className={styles['interactiveList']}>
    {elements.map((elementProps, index) => {
      const { key, ...rest } = elementProps;
      return <InteractiveListElement key={key ?? index} {...rest} />;
    })}
  </ul>
);
