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
    jsSrc="/k9/microfrontend/psb-uttak/1.1.2/app.js"
    jsIntegrity="sha384-JdkvU8cR1K9fC4YZywbUpw6eaAotTb2RyVOR6jaTQBcVdLfHtutQW8CxppPPGaDo"
    stylesheetSrc="/k9/microfrontend/psb-uttak/1.1.2/styles.css"
    stylesheetIntegrity="sha384-dQDCJKz34BfLEEnr5z+k2RD2PUe9nMyv3ZQfnPj3vP8kWJwHYdovIbbf14NR3AYV"
    onReady={() => initializeUttak(uttakAppID, uttaksperioder, uuid, arbeidsgiverOpplysningerPerId)}
  />
);
