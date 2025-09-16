import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { findAksjonspunkt, httpErrorHandler } from '@fpsak-frontend/utils';
import OmsorgenForIndex from '@k9-sak-web/gui/fakta/omsorgen-for/OmsorgenForIndex.js';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
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
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const httpErrorHandlerCaller = (status: number, locationHeader?: string) =>
    httpErrorHandler(status, addErrorMessage, locationHeader);

  const omsorgenForAksjonspunkt = findAksjonspunkt(aksjonspunkter, aksjonspunktCodes.AVKLAR_OMSORGEN_FOR);
  const omsorgenForAksjonspunktkode = omsorgenForAksjonspunkt?.definisjon.kode;
  const harAksjonspunkt = !!omsorgenForAksjonspunktkode;

  const løsAksjonspunkt = omsorgsperioder =>
    submitCallback([
      { kode: omsorgenForAksjonspunktkode ?? '', begrunnelse: 'Omsorgen for er behandlet', omsorgsperioder },
    ]);

  return (
    <OmsorgenForIndex
      httpErrorHandler={httpErrorHandlerCaller}
      readOnly={readOnly || !harAksjonspunkt}
      onFinished={løsAksjonspunkt}
      sakstype={sakstype}
      behandlingUuid={uuid}
    />
  );
};
