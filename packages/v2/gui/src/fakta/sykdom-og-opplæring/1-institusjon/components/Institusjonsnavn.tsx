import { Tag } from '@navikt/ds-react';
import { LabelledContent } from '../../../../shared/LabelledContent/LabelledContent';

const Institusjonsnavn = ({ institusjon }: { institusjon: string }) => {
  return (
    <LabelledContent label="På hvilken helseinstitusjon eller kompetansesenter foregår opplæringen?">
      <div className="flex items-center gap-2">
        {institusjon}
        <Tag variant="info" size="small">
          Fra søknad
        </Tag>
      </div>
    </LabelledContent>
  );
};

export default Institusjonsnavn;
