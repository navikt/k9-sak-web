import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { findAksjonspunkt, findEndpointsFromRels, httpErrorHandler } from '@fpsak-frontend/utils';
import { MedisinskVilkår } from '@k9-sak-web/fakta-medisinsk-vilkar';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';

export default ({
  behandling: { links, uuid },
  submitCallback,
  aksjonspunkter,
  readOnly,
  fagsakYtelseType,
  behandlingType,
  pleietrengendePart,
  featureToggles,
}) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  const httpErrorHandlerCaller = (status: number, locationHeader?: string) =>
    httpErrorHandler(status, addErrorMessage, locationHeader);

  const medisinskVilkårAksjonspunkt = findAksjonspunkt(aksjonspunkter, aksjonspunktCodes.MEDISINSK_VILKAAR);
  const medisinskVilkårAksjonspunktkode = medisinskVilkårAksjonspunkt?.definisjon.kode;
  const medisinskVilkårAksjonspunktstatus = medisinskVilkårAksjonspunkt?.status.kode;
  const visFortsettknapp = medisinskVilkårAksjonspunktstatus === aksjonspunktStatus.OPPRETTET;

  const løsAksjonspunkt = aksjonspunktArgs =>
    submitCallback([
      { kode: medisinskVilkårAksjonspunktkode, begrunnelse: 'Sykdom er behandlet', ...aksjonspunktArgs },
    ]);

  const harAksjonspunkt = !!medisinskVilkårAksjonspunktkode;

  return (
    <MedisinskVilkår
      data={{
        httpErrorHandler: httpErrorHandlerCaller,
        endpoints: findEndpointsFromRels(links, [
          { rel: 'sykdom-vurdering-oversikt-ktp', desiredName: 'vurderingsoversiktKontinuerligTilsynOgPleie' },
          { rel: 'sykdom-vurdering-oversikt-too', desiredName: 'vurderingsoversiktBehovForToOmsorgspersoner' },
          { rel: 'sykdom-vurdering-endring', desiredName: 'endreVurdering' },
          { rel: 'sykdom-dokument-oversikt', desiredName: 'dokumentoversikt' },
          { rel: 'sykdom-innleggelse', desiredName: 'innleggelsesperioder' },
          { rel: 'sykdom-diagnosekoder', desiredName: 'diagnosekoder' },
          { rel: 'sykdom-dokument-liste', desiredName: 'dataTilVurdering' },
          { rel: 'sykdom-aksjonspunkt', desiredName: 'status' },
          { rel: 'sykdom-dokument-eksisterendevurderinger', desiredName: 'nyeDokumenter' },
        ]),
        behandlingUuid: uuid,
        onFinished: løsAksjonspunkt,
        readOnly: readOnly || !harAksjonspunkt,
        visFortsettknapp,
        fagsakYtelseType,
        behandlingType,
        pleietrengendePart,
        featureToggles,
      }}
    />
  );
};
