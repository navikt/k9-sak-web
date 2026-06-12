import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { findAksjonspunkt, findEndpointsFromRels } from '@fpsak-frontend/utils';
import { OmsorgenFor } from '@k9-sak-web/fakta-omsorgen-for';
import { Aksjonspunkt, BehandlingAppKontekst } from '@k9-sak-web/types';
import { useGlobalUnhandledErrors } from '@k9-sak-web/gui/app/errorhandling/GlobalUnhandledErrorCatcher.js';

interface OmsorgenForProps {
  behandling: BehandlingAppKontekst;
  readOnly: boolean;
  aksjonspunkter: Aksjonspunkt[];
  submitCallback: ([{ kode, begrunnelse, omsorgsperioder }]: {
    kode: string;
    begrunnelse: string;
    omsorgsperioder: any;
  }[]) => void;
}

export default ({ behandling: { links, sakstype }, readOnly, aksjonspunkter, submitCallback }: OmsorgenForProps) => {
  const { legacyErrorNotifier } = useGlobalUnhandledErrors();

  const omsorgenForAksjonspunkt = findAksjonspunkt(aksjonspunkter, aksjonspunktCodes.AVKLAR_OMSORGEN_FOR);
  const omsorgenForAksjonspunktkode = omsorgenForAksjonspunkt?.definisjon.kode;
  const harAksjonspunkt = !!omsorgenForAksjonspunktkode;

  const løsAksjonspunkt = omsorgsperioder =>
    submitCallback([{ kode: omsorgenForAksjonspunktkode, begrunnelse: 'Omsorgen for er behandlet', omsorgsperioder }]);

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
