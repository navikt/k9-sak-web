import { MicroFrontend } from '@fpsak-frontend/utils';
import * as React from 'react';

const initializeUttak = (elementId, uttaksperioder, behandlingUuid: string) => {
  (window as any).renderUttakApp(elementId, {
    uttaksperioder,
    aktivBehandlingUuid: behandlingUuid,
  });
};

interface UttakProps {
  uuid: string;
  uttaksperioder: any;
}

const uttakAppID = 'uttakApp';
export default ({ uuid, uttaksperioder }: UttakProps) => (
  <MicroFrontend
    id={uttakAppID}
    jsSrc="/k9/microfrontend/psb-uttak/1.0.11/app.js"
    jsIntegrity="sha384-PfoUfXbcMiWmXOXNithJ2zqZrBj2eex5lx6/8xEzOnFruMgTuhRETxvSEIa8Tvsf"
    stylesheetSrc="/k9/microfrontend/psb-uttak/1.0.11/styles.css"
    stylesheetIntegrity="sha384-JkWo8BMWb5BScL6kIGhS5IVAf3El6Y1GtroAIkm/j5sjUxRp0+o3r88/6cfm0Azt"
    onReady={() => initializeUttak(uttakAppID, uttaksperioder, uuid)}
  />
);
