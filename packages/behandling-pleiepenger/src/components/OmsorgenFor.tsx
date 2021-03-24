import { MicroFrontend } from '@fpsak-frontend/utils';
import * as React from 'react';

const initializeOmsorgenFor = (elementId, omsorgsperioder, behandlingUuid: string) => {
  (window as any).renderOmsorgenForApp(elementId, {
    omsorgsperioder,
    aktivBehandlingUuid: behandlingUuid,
  });
};

interface OmsorgenForProps {
  uuid: string;
  omsorgsperioder: any;
}

const omsorgenForAppID = 'omsorgenForApp';
const OmsorgenFor = ({ uuid, omsorgsperioder }: OmsorgenForProps) => (
  <MicroFrontend
    id={omsorgenForAppID}
    jsSrc="http://localhost:8081/main.js"
    // jsIntegrity="sha384-iNIBcJsYevOG/6mMde96Zy76+n0IarHJehHRWuBmVxn6fGK5sHlm4fRVIeLyXp3S"
    stylesheetSrc="http://localhost:8081/styles.css"
    // stylesheetIntegrity="sha384-Ns3um5ypN0Dx4jWK7OT/rD9piP7up1qj4/bP3AYwhQtLHhc2SOMBTStumAyR0IXu"
    onReady={() => initializeOmsorgenFor(omsorgenForAppID, omsorgsperioder, uuid)}
  />
);

export default OmsorgenFor;
