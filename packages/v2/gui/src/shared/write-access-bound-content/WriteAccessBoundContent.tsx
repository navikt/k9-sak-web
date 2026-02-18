import { type JSX } from 'react';

interface WriteAccessBoundContentProps {
  contentRenderer: () => JSX.Element;
  otherRequirementsAreMet?: boolean;
  readOnly: boolean;
}

const WriteAccessBoundContent = ({
  contentRenderer,
  otherRequirementsAreMet,
  readOnly,
}: WriteAccessBoundContentProps): JSX.Element => {
  if (readOnly === false && (otherRequirementsAreMet === true || otherRequirementsAreMet === undefined)) {
    return contentRenderer();
  }
  return <></>;
};

export default WriteAccessBoundContent;
