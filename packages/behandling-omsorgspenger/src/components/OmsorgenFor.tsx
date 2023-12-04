import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { findAksjonspunkt, findEndpointsForMicrofrontend, httpErrorHandler } from '@fpsak-frontend/utils';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { Aksjonspunkt, BehandlingAppKontekst, Fagsak, FeatureToggles } from '@k9-sak-web/types';
import React from 'react';
import { OmsorgenFor } from '@navikt/k9-fe-omsorgen-for';
import { OmsorgenFor as LokalOmsorgenFor } from '@k9-sak-web/fakta-omsorgen-for';

interface OmsorgenForProps {
  behandling: BehandlingAppKontekst;
  fagsak: Fagsak;
  readOnly: boolean;
  aksjonspunkter: Aksjonspunkt[];
  submitCallback: ([{ kode, begrunnelse, omsorgsperioder }]: {
    kode: string;
    begrunnelse: string;
    omsorgsperioder: any;
    fosterbarnForOmsorgspenger: any;
  }[]) => void;
  saksbehandlere: { [key: string]: string };
  featureToggles: FeatureToggles;
}

export default ({
  behandling,
  fagsak,
  readOnly,
  aksjonspunkter,
  submitCallback,
  saksbehandlere,
  featureToggles,
}: OmsorgenForProps) => {
  const { links } = behandling;
  const sakstype = fagsak.sakstype.kode;

  const { addErrorMessage } = useRestApiErrorDispatcher();
  const httpErrorHandlerCaller = (status: number, locationHeader?: string) =>
    httpErrorHandler(status, addErrorMessage, locationHeader);

  const omsorgenForAksjonspunkt = findAksjonspunkt(aksjonspunkter, aksjonspunktCodes.AVKLAR_OMSORGEN_FOR);
  const omsorgenForAksjonspunktkode = omsorgenForAksjonspunkt?.definisjon.kode;
  const harAksjonspunkt = !!omsorgenForAksjonspunktkode;

  const løsAksjonspunkt = (omsorgsperioder, fosterbarnForOmsorgspenger) =>
    submitCallback([
      {
        kode: omsorgenForAksjonspunktkode,
        begrunnelse: 'Omsorgen for er behandlet',
        omsorgsperioder,
        fosterbarnForOmsorgspenger,
      },
    ]);

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
          sakstype,
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
        sakstype,
      }}
    />
  );
};
