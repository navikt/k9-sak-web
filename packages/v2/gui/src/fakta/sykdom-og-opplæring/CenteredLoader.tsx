import { Loader } from '@navikt/ds-react';

export const CenteredLoader = () => (
  <div className="flex justify-center items-center min-h-[500px]">
    <Loader size="3xlarge" />
  </div>
);
