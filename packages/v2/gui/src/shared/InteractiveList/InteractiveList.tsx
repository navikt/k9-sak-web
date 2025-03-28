import React from 'react';

import { ChevronDownIcon } from '@navikt/aksel-icons';
import classnames from 'classnames';

import './interactiveList.css';

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
  const cls = classnames('interactive-list-element', {
    'interactive-list-element--active': active,
    'interactive-list-element--inactive': !active,
  });

  return (
    <li className={cls}>
      <button 
        className="interactive-list-button" 
        type="button" 
        onClick={onClick}
      >
        <span className="interactive-list-button-content">
          {content}
          <span className="interactive-list-chevron">
            <ChevronDownIcon 
              className={active ? "text-black" : "text-gray-500"} 
              height="1em" 
              width="1em" 
            />
          </span>
        </span>
      </button>
    </li>
  );
};

export const InteractiveList = ({ elements }: InteractiveListProps) => (
  <ul className="list-none m-0 p-0">
    {elements.map((elementProps, index) => {
      const { key, ...rest } = elementProps;
      return <InteractiveListElement key={key ?? index} {...rest} />;
    })}
  </ul>
);
