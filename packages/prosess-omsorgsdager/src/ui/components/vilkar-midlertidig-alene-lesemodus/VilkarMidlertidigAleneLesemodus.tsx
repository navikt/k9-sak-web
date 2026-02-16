import type React from 'react';
import type {
  VilkarMidlertidigInformasjonTilLesemodus,
  VilkarMidlertidigSoknadsopplysninger,
} from '../../../types/VilkarMidlertidigAleneProps';
import { formatereDatoTilLesemodus } from '../../../util/stringUtils';
import AksjonspunktLesemodus from '../aksjonspunkt-lesemodus/AksjonspunktLesemodus';
import OpplysningerFraSoknad from '../opplysninger-fra-soknad/OpplysningerFraSoknad';
import OpplysningerFraVedtak from '../opplysninger-fra-vedtak/OpplysningerFraVedtak';
import { AvslagskoderMidlertidigAlene } from '../vilkar-midlertidig-alene/VilkarMidlertidigAlene';
import tekst from '../vilkar-midlertidig-alene/vilkar-midlertidig-alene-tekst';

interface OwnProps {
  soknadsopplysninger: VilkarMidlertidigSoknadsopplysninger;
  informasjonTilLesemodus: VilkarMidlertidigInformasjonTilLesemodus;
  harAksjonspunktBlivitLostTidligare: boolean;
  åpneForRedigereInformasjon: () => void;
}

const VilkarMidlertidigAleneLesemodus: React.FunctionComponent<OwnProps> = ({
  soknadsopplysninger,
  informasjonTilLesemodus,
  harAksjonspunktBlivitLostTidligare,
  åpneForRedigereInformasjon,
}) => (
  <>
    <AksjonspunktLesemodus
      aksjonspunktTekst={tekst.aksjonspunkt}
      harAksjonspunktBlivitLostTidligare={harAksjonspunktBlivitLostTidligare}
      åpneForRedigereInformasjon={åpneForRedigereInformasjon}
    />

    <OpplysningerFraSoknad periodeTekst="Oppgitt periode" {...soknadsopplysninger} />

    <OpplysningerFraVedtak
      tekstBegrunnelseLesemodus={tekst.begrunnelseLesemodus}
      begrunnelse={informasjonTilLesemodus.begrunnelse}
      tekstVilkarOppfylt={tekst.sporsmålVilkarOppfylt}
      erVilkarOppfylt={informasjonTilLesemodus.vilkarOppfylt}
      textVilkarOppfylt="I hvilken periode er vedtaket gyldig?"
      informasjonVilkarOppfylt={`${formatereDatoTilLesemodus(
        informasjonTilLesemodus.dato.fra,
      )} - ${formatereDatoTilLesemodus(informasjonTilLesemodus.dato.til)}`}
      textVilkarIkkeOppfylt={tekst.arsak}
      årsakVilkarIkkeOppfylt={
        informasjonTilLesemodus.avslagsårsakKode === AvslagskoderMidlertidigAlene.VARIGHET_UNDER_SEKS_MÅN
          ? tekst.arsakPeriodeIkkeOverSeksMån
          : informasjonTilLesemodus.avslagsårsakKode === AvslagskoderMidlertidigAlene.REGNES_IKKE_SOM_Å_HA_ALENEOMSORG
            ? tekst.arsakIkkeAleneOmsorg
            : tekst.arsakIkkeAleneOmsorgAnnet
      }
    />
  </>
);
export default VilkarMidlertidigAleneLesemodus;
