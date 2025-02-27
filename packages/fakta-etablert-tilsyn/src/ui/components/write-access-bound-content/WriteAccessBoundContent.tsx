import React, { type JSX } from 'react';
import ContainerContext from '../../context/ContainerContext';

interface WriteAccessBoundContentProps {
  contentRenderer: () => JSX.Element;
  otherRequirementsAreMet?: boolean;
}

const WriteAccessBoundContent = ({
  contentRenderer,
  otherRequirementsAreMet,
}: WriteAccessBoundContentProps): JSX.Element | null => {
  const { readOnly } = React.useContext(ContainerContext) || {};
  if (readOnly === false && (otherRequirementsAreMet === true || otherRequirementsAreMet === undefined)) {
    return contentRenderer();
  }
  return null;
};

export default WriteAccessBoundContent;
