import { HStack, Tag } from '@navikt/ds-react';
import { LabelledContent } from '../../../../shared/labelled-content/LabelledContent';

const Institusjonsnavn = ({ institusjon }: { institusjon: string }) => {
  return (
    <LabelledContent
      label="På hvilken helseinstitusjon eller kompetansesenter foregår opplæringen?"
      content={
        <HStack align="center" gap="space-8">
          {institusjon}
          <Tag variant="info" size="small">
            Fra søknad
          </Tag>
        </HStack>
      }
    />
  );
};

export default Institusjonsnavn;
