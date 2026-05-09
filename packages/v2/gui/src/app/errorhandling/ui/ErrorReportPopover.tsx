import { useState, useId, type FC } from 'react';
import type { ErrorAndId } from '../AlertInfo.js';
import { Button, type ButtonProps, Popover } from '@navikt/ds-react';
import { makeErrorReportText } from './makeErrorReportText.js';

type ErrorReportPopoverProps = Readonly<{
  errorAndIds: ReadonlyArray<ErrorAndId>;
}> &
  ButtonProps;

export const ErrorReportPopover: FC<ErrorReportPopoverProps> = ({ errorAndIds, children, ...btnProps }) => {
  const [showReportBtn, setShowReportBtn] = useState<HTMLElement | null>(null);
  const [reportShowing, setReportShowing] = useState(false);
  const popoverId = useId();
  const reportTxt = makeErrorReportText(errorAndIds);
  return (
    <>
      <Popover
        strategy="fixed"
        anchorEl={showReportBtn}
        open={reportShowing}
        onClose={() => setReportShowing(false)}
        id={popoverId}
      >
        <Popover.Content>
          <small>
            <pre>{reportTxt}</pre>
          </small>
        </Popover.Content>
      </Popover>
      <Button
        {...btnProps}
        ref={setShowReportBtn}
        aria-expanded={reportShowing}
        aria-controls={reportShowing ? popoverId : undefined}
        onClick={() => setReportShowing(showing => !showing)}
      >
        {children}
      </Button>
    </>
  );
};
