import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { findAksjonspunkt, findEndpointsFromRels } from '@fpsak-frontend/utils';
import { MedisinskVilkår } from '@k9-sak-web/fakta-medisinsk-vilkar';
import { useGlobalUnhandledErrors } from '@k9-sak-web/gui/app/errorhandling/GlobalUnhandledErrorCatcher.js';

export default ({
  behandling: { links, uuid },
  submitCallback,
  aksjonspunkter,
  readOnly,
  fagsakYtelseType,
  behandlingType,
}) => {
  const { legacyErrorNotifier } = useGlobalUnhandledErrors();

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
        errorNotifier: legacyErrorNotifier,
        endpoints: findEndpointsFromRels(links, [
          { rel: 'sykdom-vurdering-oversikt-ktp', desiredName: 'vurderingsoversiktKontinuerligTilsynOgPleie' },
          { rel: 'sykdom-vurdering-oversikt-too', desiredName: 'vurderingsoversiktBehovForToOmsorgspersoner' },
          { rel: 'sykdom-vurdering-oversikt-slu', desiredName: 'vurderingsoversiktLivetsSluttfase' },
          { rel: 'sykdom-vurdering-endring', desiredName: 'endreVurdering' },
          { rel: 'sykdom-dokument-oversikt', desiredName: 'dokumentoversikt' },
          { rel: 'sykdom-innleggelse', desiredName: 'innleggelsesperioder' },
          { rel: 'sykdom-diagnosekoder', desiredName: 'diagnosekoder' },
          { rel: 'sykdom-dokument-liste', desiredName: 'dataTilVurdering' },
          { rel: 'sykdom-aksjonspunkt', desiredName: 'status' },
          { rel: 'sykdom-dokument-eksisterendevurderinger', desiredName: 'nyeDokumenter' },
          { rel: 'behandling-perioder-årsak-med-vilkår', desiredName: 'perioderMedVilkar' },
        ]),
        behandlingUuid: uuid,
        onFinished: løsAksjonspunkt,
        readOnly: readOnly || !harAksjonspunkt,
        visFortsettknapp,
        medisinskVilkårAksjonspunkt,
        fagsakYtelseType,
        behandlingType,
      }}
    />
  );
};
