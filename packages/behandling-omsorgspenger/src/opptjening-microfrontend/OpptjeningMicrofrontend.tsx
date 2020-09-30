import * as React from 'react';
import { MicroFrontend } from '@fpsak-frontend/utils';

const initializeOpptjeningApp = (elementId, behandling, submitCallback) => {
  (window as any).renderOpptjeningApp(elementId, {
    services: {
      opptjening: {
        path: `/k9/sak/api/behandling/opptjening-v3?behandlingUuid=${behandling.uuid}`,
      },
    },
    onSubmit: submitCallback,
  });
};

const opptjeningAppID = 'opptjeningApp';
export default ({ behandling, submitCallback }) => {
  return (
    <MicroFrontend
      jsSrc="http://localhost:80/app.js"
      stylesheetSrc="http://localhost:80/app.css"
      id={opptjeningAppID}
      onReady={() => initializeOpptjeningApp(opptjeningAppID, behandling, submitCallback)}
      onError={() => {}}
    />
  );
};
