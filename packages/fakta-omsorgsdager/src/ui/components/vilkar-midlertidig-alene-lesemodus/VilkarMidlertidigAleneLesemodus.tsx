import React from 'react';
import { formatereDatoTilLesemodus } from '../../../util/stringUtils';
import AksjonspunktLesemodus from '../aksjonspunkt-lesemodus/AksjonspunktLesemodus';
import OpplysningerFraVedtak from '../opplysninger-fra-vedtak/OpplysningerFraVedtak';
import OpplysningerFraSoknad from '../opplysninger-fra-soknad/OpplysningerFraSoknad';
import {
  VilkarMidlertidigInformasjonTilLesemodus,
  VilkarMidlertidigSoknadsopplysninger,
} from '../../../types/VilkarMidlertidigAleneProps';
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
        informasjonTilLesemodus.avslagsArsakErPeriodeErIkkeOverSeksMån
          ? tekst.arsakPeriodeIkkeOverSeksMån
          : tekst.arsakIkkeAleneOmsorg
      }
    />
  </>
);
export default VilkarMidlertidigAleneLesemodus;
