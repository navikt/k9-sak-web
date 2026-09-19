import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { findAksjonspunkt } from '@fpsak-frontend/utils';
import OmsorgenFor from '@k9-sak-web/gui/fakta/omsorgen-for/src/OmsorgenFor.js';
import { Aksjonspunkt, BehandlingAppKontekst } from '@k9-sak-web/types';

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

export default ({ behandling: { sakstype, uuid }, readOnly, aksjonspunkter, submitCallback }: OmsorgenForProps) => {
  const omsorgenForAksjonspunkt = findAksjonspunkt(aksjonspunkter, aksjonspunktCodes.AVKLAR_OMSORGEN_FOR);
  const omsorgenForAksjonspunktkode = omsorgenForAksjonspunkt?.definisjon.kode;
  const harAksjonspunkt = !!omsorgenForAksjonspunktkode;

  const løsAksjonspunkt = omsorgsperioder =>
    submitCallback([
      { kode: omsorgenForAksjonspunktkode ?? '', begrunnelse: 'Omsorgen for er behandlet', omsorgsperioder },
    ]);

  return (
    <OmsorgenFor
      readOnly={readOnly || !harAksjonspunkt}
      onFinished={løsAksjonspunkt}
      sakstype={sakstype}
      behandlingUuid={uuid}
    />
  );
};
