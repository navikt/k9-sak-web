import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { findAksjonspunkt, findEndpointsFromRels } from '@fpsak-frontend/utils';
import { OmsorgenFor } from '@k9-sak-web/fakta-omsorgen-for';
import { useGlobalUnhandledErrors } from '@k9-sak-web/gui/app/errorhandling/GlobalUnhandledErrorCatcher.js';
import { OmsorgenFor as OmsorgenForV2 } from '@k9-sak-web/gui/fakta/omsorgen-for/src/OmsorgenFor.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { Aksjonspunkt, BehandlingAppKontekst } from '@k9-sak-web/types';
import { useContext } from 'react';

interface OmsorgenForProps {
  behandling: BehandlingAppKontekst;
  readOnly: boolean;
  aksjonspunkter: Aksjonspunkt[];
  submitCallback: ([{ kode, begrunnelse, omsorgsperioder }]: {
    kode: string;
    begrunnelse: string;
    omsorgsperioder: any;
  }[]) => Promise<void>;
}

export default ({
  behandling: { sakstype, uuid, links },
  readOnly,
  aksjonspunkter,
  submitCallback,
}: OmsorgenForProps) => {
  const { BRUK_OMSORGEN_FOR } = useContext(FeatureTogglesContext);
  const { legacyErrorNotifier } = useGlobalUnhandledErrors();
  const omsorgenForAksjonspunkt = findAksjonspunkt(aksjonspunkter, aksjonspunktCodes.AVKLAR_OMSORGEN_FOR);
  const omsorgenForAksjonspunktkode = omsorgenForAksjonspunkt?.definisjon.kode;
  const harAksjonspunkt = !!omsorgenForAksjonspunktkode;

  const løsAksjonspunkt = omsorgsperioder =>
    submitCallback([
      { kode: omsorgenForAksjonspunktkode ?? '', begrunnelse: 'Omsorgen for er behandlet', omsorgsperioder },
    ]);

  if (BRUK_OMSORGEN_FOR) {
    return (
      <OmsorgenForV2
        readOnly={readOnly || !harAksjonspunkt}
        onFinished={løsAksjonspunkt}
        sakstype={sakstype}
        behandlingUuid={uuid}
      />
    );
  }

  return (
    <OmsorgenFor
      data={{
        omsorgenForAksjonspunkt,
        errorNotifier: legacyErrorNotifier,
        endpoints: findEndpointsFromRels(links, [{ rel: 'omsorgen-for', desiredName: 'omsorgsperioder' }]),
        readOnly: readOnly || !harAksjonspunkt,
        onFinished: løsAksjonspunkt,
        sakstype,
      }}
    />
  );
};
