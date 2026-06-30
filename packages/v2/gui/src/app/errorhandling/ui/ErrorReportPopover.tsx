import { useState, useId, type FC } from 'react';
import { Button, Popover, Tooltip } from '@navikt/ds-react';
import { makeErrorReportText } from './makeErrorReportText.js';
import css from './errorReportPopover.module.css';
import { InformationSquareIcon } from '@navikt/aksel-icons';

type ErrorReportPopoverProps = Readonly<{
  errors: ReadonlyArray<Error>;
}>;

// NB: Sidan makeErrorReportText leser global sentryReportedIdList array, bør ikkje denne komponent rendrast før ein
// veit at alle feil har blitt rapportert gjennom sentry.
export const ErrorReportPopover: FC<ErrorReportPopoverProps> = ({ errors }) => {
  const [showReportBtn, setShowReportBtn] = useState<HTMLElement | null>(null);
  const [reportShowing, setReportShowing] = useState(false);
  const popoverId = useId();
  const reportTxt = makeErrorReportText(errors);
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
          <p className={css.reportText}>{reportTxt}</p>
        </Popover.Content>
      </Popover>
      <Tooltip content="Vis teknisk info om feil">
        <Button
          variant="tertiary"
          size="small"
          data-color="neutral"
          ref={setShowReportBtn}
          aria-label="Vis teknisk info om feil"
          aria-expanded={reportShowing}
          aria-controls={reportShowing ? popoverId : undefined}
          onClick={() => setReportShowing(showing => !showing)}
          icon={<InformationSquareIcon />}
        />
      </Tooltip>
    </>
  );
};
