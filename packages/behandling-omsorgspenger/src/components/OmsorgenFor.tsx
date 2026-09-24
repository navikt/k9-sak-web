import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { findAksjonspunkt, findEndpointsFromRels } from '@fpsak-frontend/utils';
import { OmsorgenFor } from '@k9-sak-web/fakta-omsorgen-for';
import { useGlobalUnhandledErrors } from '@k9-sak-web/gui/app/errorhandling/GlobalUnhandledErrorCatcher.js';
import { OmsorgenFor as OmsorgenForV2 } from '@k9-sak-web/gui/fakta/omsorgen-for/src/OmsorgenFor.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { Aksjonspunkt, BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';
import { useContext } from 'react';

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
  }[]) => Promise<void>;
}

export default ({ behandling, fagsak, readOnly, aksjonspunkter, submitCallback }: OmsorgenForProps) => {
  const { links } = behandling;
  const sakstype = fagsak.sakstype;
  const { BRUK_OMSORGEN_FOR } = useContext(FeatureTogglesContext);

  const { legacyErrorNotifier } = useGlobalUnhandledErrors();

  const omsorgenForAksjonspunkt = findAksjonspunkt(aksjonspunkter, aksjonspunktCodes.AVKLAR_OMSORGEN_FOR);
  const omsorgenForAksjonspunktkode = omsorgenForAksjonspunkt?.definisjon.kode;
  const harAksjonspunkt = !!omsorgenForAksjonspunktkode;

  const løsAksjonspunkt = (omsorgsperioder, fosterbarnForOmsorgspenger) =>
    submitCallback([
      {
        kode: omsorgenForAksjonspunktkode ?? '',
        begrunnelse: 'Omsorgen for er behandlet',
        omsorgsperioder,
        fosterbarnForOmsorgspenger,
      },
    ]);

  if (BRUK_OMSORGEN_FOR) {
    return (
      <OmsorgenForV2
        readOnly={readOnly || !harAksjonspunkt}
        onFinished={løsAksjonspunkt}
        sakstype={sakstype}
        behandlingUuid={behandling.uuid}
      />
    );
  }

  return (
    <OmsorgenFor
      data={{
        omsorgenForAksjonspunkt,
        errorNotifier: legacyErrorNotifier,
        endpoints: findEndpointsFromRels(links, [
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
