import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { findAksjonspunkt, findEndpointsFromRels } from '@fpsak-frontend/utils';
import { OmBarnet } from '@k9-sak-web/fakta-om-barnet';
import { Aksjonspunkt, BehandlingAppKontekst } from '@k9-sak-web/types';
import { useGlobalUnhandledErrors } from '@k9-sak-web/gui/app/errorhandling/GlobalUnhandledErrorCatcher.js';

interface OmBarnetProps {
  behandling: BehandlingAppKontekst;
  readOnly: boolean;
  aksjonspunkter: Aksjonspunkt[];
  submitCallback: ([{ kode, begrunnelse }]: {
    kode: string;
    begrunnelse: string;
  }[]) => void;
}

export default ({ behandling: { links }, readOnly, aksjonspunkter, submitCallback }: OmBarnetProps) => {
  const { legacyErrorNotifier } = useGlobalUnhandledErrors();

  const omBarnetAksjonspunkt = findAksjonspunkt(
    aksjonspunkter,
    aksjonspunktCodes.VURDER_RETT_ETTER_PLEIETRENGENDES_DØD,
  );
  const omBarnetAksjonspunktkode = omBarnetAksjonspunkt?.definisjon.kode;
  const harAksjonspunkt = !!omBarnetAksjonspunktkode;

  const løsAksjonspunkt = data =>
    submitCallback([
      { kode: omBarnetAksjonspunktkode, begrunnelse: 'Rett etter pleietrengendes død er behandlet', ...data },
    ]);

  return (
    <OmBarnet
      data={{
        errorNotifier: legacyErrorNotifier,
        endpoints: findEndpointsFromRels(links, [
          {
            rel: 'rett-ved-dod',
            desiredName: 'rettVedDod',
          },
          { rel: 'om-pleietrengende', desiredName: 'omPleietrengende' },
        ]),
        readOnly: readOnly || !harAksjonspunkt,
        onFinished: løsAksjonspunkt,
      }}
    />
  );
};
