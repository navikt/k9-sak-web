import { OmsorgenFor } from '@k9-sak-web/fakta-omsorgen-for';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { Aksjonspunkt, BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';
import { findAksjonspunkt, findEndpointsForMicrofrontend, httpErrorHandler } from '@k9-sak-web/utils';
import React from 'react';

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
}

export default ({ behandling, fagsak, readOnly, aksjonspunkter, submitCallback }: OmsorgenForProps) => {
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
        sakstype,
      }}
    />
  );
};
