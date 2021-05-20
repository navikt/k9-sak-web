import { MicroFrontend } from '@fpsak-frontend/utils';
import * as React from 'react';
import { ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';

const initializeUttak = (
  elementId,
  uttaksperioder,
  behandlingUuid: string,
  arbeidsforhold: ArbeidsgiverOpplysningerPerId,
) => {
  (window as any).renderUttakApp(elementId, {
    uttaksperioder,
    aktivBehandlingUuid: behandlingUuid,
    arbeidsforhold,
  });
};

interface UttakProps {
  uuid: string;
  uttaksperioder: any;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

const uttakAppID = 'uttakApp';
export default ({ uuid, uttaksperioder, arbeidsgiverOpplysningerPerId }: UttakProps) => (
  <MicroFrontend
    id={uttakAppID}
    jsSrc="/k9/microfrontend/psb-uttak/1.1.0/app.js"
    jsIntegrity="sha384-q6c7n8Gd5ikWbsl5LkbRG0TCnGlW8YuShQNa1xmg9p6GX0b6PdkmZ2Qnf88Nbch8"
    stylesheetSrc="/k9/microfrontend/psb-uttak/1.1.0/styles.css"
    stylesheetIntegrity="sha384-cyUfxkt/E0+BiyC8NgMi6aGoYYo8uAT8BL9rZGeFzJVXtekhtRdl6pQNC6rjdMH4"
    onReady={() => initializeUttak(uttakAppID, uttaksperioder, uuid, arbeidsgiverOpplysningerPerId)}
  />
);
