import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { findAksjonspunkt, findEndpointsFromRels } from '@fpsak-frontend/utils';
import { OmsorgenFor } from '@k9-sak-web/fakta-omsorgen-for';
import { Aksjonspunkt, BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';
import { useGlobalUnhandledErrors } from '@k9-sak-web/gui/app/errorhandling/GlobalUnhandledErrorCatcher.js';

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
  const sakstype = fagsak.sakstype;

  const { legacyErrorNotifier } = useGlobalUnhandledErrors();

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
