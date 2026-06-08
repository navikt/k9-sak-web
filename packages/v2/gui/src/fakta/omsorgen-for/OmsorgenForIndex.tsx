import { type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { type JSX } from 'react';
import OmsorgenForBackendClient from './OmsorgenForBackendClient';
import OmsorgenFor from './src/OmsorgenFor';
import type { VurderingSubmitValues } from './src/types/VurderingSubmitValues';

interface MainComponentProps {
  readOnly: boolean;
  onFinished: (vurdering: VurderingSubmitValues[], fosterbarnForOmsorgspenger?: string[]) => Promise<void>;
  httpErrorHandler: (statusCode: number, locationHeader?: string) => void;
  sakstype?: FagsakYtelsesType;
  behandlingUuid: string;
}

const OmsorgenForIndex = ({
  readOnly,
  onFinished,
  httpErrorHandler,
  behandlingUuid,
  sakstype,
}: MainComponentProps): JSX.Element => {
  const omsorgenForBackendClient = new OmsorgenForBackendClient();
  return (
    <OmsorgenFor
      api={omsorgenForBackendClient}
      readOnly={readOnly}
      onFinished={onFinished}
      httpErrorHandler={httpErrorHandler}
      behandlingUuid={behandlingUuid}
      sakstype={sakstype}
    />
  );
};

export default OmsorgenForIndex;
