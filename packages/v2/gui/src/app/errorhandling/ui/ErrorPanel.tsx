import type { FC } from "react";
import type { ErrorViewProps } from "./resolveErrorViewProps.tsx";
import type { ErrorFixAction } from "./ErrorFixAction.tsx";
import { Box, Heading, VStack } from "@navikt/ds-react";

export type ErrorPanelProps = Readonly<{
  errorInfo: ErrorViewProps['errorInfo'];
  fixAction: ErrorFixAction;
}>

export const ErrorPanel: FC<ErrorPanelProps> = ({errorInfo, fixAction}) => {
  return <VStack>
    <Box paddingBlock="space-0 space-16">
      {errorInfo}
    </Box>
    <Heading size="xsmall">Hva kan du gjøre?</Heading>
    {fixAction.info}
  </VStack>
}
