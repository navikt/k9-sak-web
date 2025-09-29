import { CheckmarkIcon } from '@navikt/aksel-icons';
import { Box, HStack } from '@navikt/ds-react';
import styles from './fremhevingTag.module.css';

interface FremhevingTag {
  text: string;
}

export const FremhevingTag = ({ text }: FremhevingTag) => (
  <Box.New
    paddingBlock="space-2"
    paddingInline="space-4 space-8"
    width="fit-content"
    borderRadius="4"
    className={styles.fremhevingTag}
  >
    <HStack gap="space-2">
      <CheckmarkIcon />
      {text}
    </HStack>
  </Box.New>
);
