import { Box, Button, HStack } from '@navikt/ds-react';
import React from 'react';

export interface FormProps {
  children: React.ReactNode;
  buttonLabel?: string;
  onSubmit: (e?: any) => void;
  shouldShowSubmitButton?: boolean;
  onAvbryt?: () => void;
  submitButtonDisabled?: boolean;
  cancelButtonDisabled?: boolean;
  smallButtons?: boolean;
}

export const FormWithButtons = ({
  children,
  onSubmit,
  buttonLabel,
  shouldShowSubmitButton,
  onAvbryt,
  submitButtonDisabled,
  cancelButtonDisabled,
  smallButtons,
}: FormProps) => (
  <form onSubmit={onSubmit}>
    {children}
    {shouldShowSubmitButton !== false && (
      <Box marginBlock="16 0">
        <HStack gap="4">
          <Button
            id="submitButton"
            disabled={submitButtonDisabled === true}
            loading={submitButtonDisabled === true}
            size={smallButtons ? 'small' : 'medium'}
          >
            {buttonLabel}
          </Button>
          {onAvbryt && (
            <Button
              variant="secondary"
              onClick={onAvbryt}
              disabled={cancelButtonDisabled === true}
              size={smallButtons ? 'small' : 'medium'}
            >
              Avbryt
            </Button>
          )}
        </HStack>
      </Box>
    )}
  </form>
);
