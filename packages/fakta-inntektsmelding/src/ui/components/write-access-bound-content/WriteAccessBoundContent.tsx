import React from 'react';
import ContainerContext from '../../../context/ContainerContext';

interface WriteAccessBoundContentProps {
  contentRenderer: () => JSX.Element;
}

const WriteAccessBoundContent = ({ contentRenderer }: WriteAccessBoundContentProps): JSX.Element => {
  const { readOnly } = React.useContext(ContainerContext);
  if (readOnly === false) {
    return contentRenderer();
  }
  return null;
};

export default WriteAccessBoundContent;
