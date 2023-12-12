import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { findAksjonspunkt, findEndpointsForMicrofrontend, httpErrorHandler } from '@fpsak-frontend/utils';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { Aksjonspunkt, BehandlingAppKontekst, FeatureToggles } from '@k9-sak-web/types';
import React from 'react';
import { OmsorgenFor } from '@navikt/k9-fe-omsorgen-for';
import { OmsorgenFor as LokalOmsorgenFor } from '@k9-sak-web/fakta-omsorgen-for';

interface OmsorgenForProps {
  behandling: BehandlingAppKontekst;
  readOnly: boolean;
  aksjonspunkter: Aksjonspunkt[];
  submitCallback: ([{ kode, begrunnelse, omsorgsperioder }]: {
    kode: string;
    begrunnelse: string;
    omsorgsperioder: any;
  }[]) => void;
  saksbehandlere: { [key: string]: string };
  featureToggles: FeatureToggles;
}

export default ({
  behandling: { links },
  readOnly,
  aksjonspunkter,
  submitCallback,
  saksbehandlere,
  featureToggles,
}: OmsorgenForProps) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const httpErrorHandlerCaller = (status: number, locationHeader?: string) =>
    httpErrorHandler(status, addErrorMessage, locationHeader);

  const omsorgenForAksjonspunkt = findAksjonspunkt(aksjonspunkter, aksjonspunktCodes.AVKLAR_OMSORGEN_FOR);
  const omsorgenForAksjonspunktkode = omsorgenForAksjonspunkt?.definisjon.kode;
  const harAksjonspunkt = !!omsorgenForAksjonspunktkode;

  const løsAksjonspunkt = omsorgsperioder =>
    submitCallback([{ kode: omsorgenForAksjonspunktkode, begrunnelse: 'Omsorgen for er behandlet', omsorgsperioder }]);

  if (featureToggles?.LOKALE_PAKKER) {
    return (
      <LokalOmsorgenFor
        data={{
          httpErrorHandler: httpErrorHandlerCaller,
          endpoints: findEndpointsForMicrofrontend(links, [
            {
              rel: 'omsorgen-for',
              desiredName: 'omsorgsperioder',
            },
          ]),
          readOnly: readOnly || !harAksjonspunkt,
          onFinished: løsAksjonspunkt,
          saksbehandlere: saksbehandlere || {},
        }}
      />
    );
  }

  return (
    <OmsorgenFor
      data={{
        httpErrorHandler: httpErrorHandlerCaller,
        endpoints: findEndpointsForMicrofrontend(links, [
          {
            rel: 'omsorgen-for',
            desiredName: 'omsorgsperioder',
          },
        ]),
        readOnly: readOnly || !harAksjonspunkt,
        onFinished: løsAksjonspunkt,
        saksbehandlere: saksbehandlere || {},
      }}
    />
  );
};
