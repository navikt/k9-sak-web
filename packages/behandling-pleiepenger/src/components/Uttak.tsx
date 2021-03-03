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
    jsSrc="/k9/microfrontend/psb-uttak/1.0.9/app.js"
    jsIntegrity="sha384-h1K5E6zjfVetyJO9mEViqmGvld6FvhDEHke7BDCZcdR+vzzMAE/K641Bylv7o+jQ"
    stylesheetSrc="/k9/microfrontend/psb-uttak/1.0.9/styles.css"
    stylesheetIntegrity="sha384-XwcNDA26KHmidkAIWeaxDvZdYiQ/jchQaPPdwGDDYGM7UK/a8kxb+eNNuNkei7vs"
    onReady={() => initializeUttak(uttakAppID, uttaksperioder, uuid)}
  />
);
