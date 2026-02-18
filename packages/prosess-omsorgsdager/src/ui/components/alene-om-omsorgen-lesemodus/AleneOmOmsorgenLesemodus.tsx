import React from 'react';
import { AleneOmOmsorgenAksjonspunktObjekt } from '../../../types/AleneOmOmsorgenProps';
import { formatereDatoTilLesemodus } from '../../../util/stringUtils';
import AksjonspunktLesemodus from '../aksjonspunkt-lesemodus/AksjonspunktLesemodus';
import OpplysningerFraVedtak from '../opplysninger-fra-vedtak/OpplysningerFraVedtak';
import OpplysningerFraSoknad from '../opplysninger-fra-soknad/OpplysningerFraSoknad';
import tekst from '../alene-om-omsorgen/alene-om-omsorgen-tekst';

interface OwnProps {
  fraDatoFraSoknad: string;
  informasjonTilLesemodus: AleneOmOmsorgenAksjonspunktObjekt;
  harAksjonspunktBlivitLostTidligare: boolean;
  åpneForRedigereInformasjon: () => void;
  erBehandlingstypeRevurdering: boolean;
}

const AleneOmOmsorgenLesemodus: React.FunctionComponent<OwnProps> = ({
  fraDatoFraSoknad,
  informasjonTilLesemodus,
  harAksjonspunktBlivitLostTidligare,
  åpneForRedigereInformasjon,
  erBehandlingstypeRevurdering,
}) => (
  <>
    <AksjonspunktLesemodus
      aksjonspunktTekst={tekst.aksjonspunkt}
      harAksjonspunktBlivitLostTidligare={harAksjonspunktBlivitLostTidligare}
      åpneForRedigereInformasjon={åpneForRedigereInformasjon}
    />

    <OpplysningerFraSoknad periodeTekst="Fra dato oppgitt" periode={formatereDatoTilLesemodus(fraDatoFraSoknad)} />

    <OpplysningerFraVedtak
      tekstBegrunnelseLesemodus={tekst.begrunnelseLesemodus}
      begrunnelse={informasjonTilLesemodus.begrunnelse}
      tekstVilkarOppfylt={tekst.sporsmålVilkarOppfylt}
      erVilkarOppfylt={informasjonTilLesemodus.vilkarOppfylt}
      textVilkarOppfylt={
        erBehandlingstypeRevurdering ? 'I hvilken periode er vedtaket gyldig?' : 'Fra hvilken dato er vedtaket gyldig?'
      }
      informasjonVilkarOppfylt={
        erBehandlingstypeRevurdering
          ? `${formatereDatoTilLesemodus(informasjonTilLesemodus.fraDato)} - ${formatereDatoTilLesemodus(
              informasjonTilLesemodus.tilDato,
            )}`
          : `${formatereDatoTilLesemodus(informasjonTilLesemodus.fraDato)}`
      }
    />
  </>
);
export default AleneOmOmsorgenLesemodus;
