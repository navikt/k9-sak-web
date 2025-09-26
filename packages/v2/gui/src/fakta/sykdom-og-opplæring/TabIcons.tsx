import { useContext } from 'react';
import { CheckmarkIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { type AksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { harÅpentAksjonspunkt, aksjonspunktErUtført } from '../../utils/aksjonspunktUtils.js';
import AksjonspunktIkon from '../../shared/aksjonspunkt-ikon/AksjonspunktIkon.js';
import { DelvisOppfyltIkon } from '../../shared/DelvisOppfyltIkon.js';
import { SykdomOgOpplæringContext } from './FaktaSykdomOgOpplæringIndex.js';
import {
  useInstitusjonInfo,
  useVurdertReisetid,
  useVurdertOpplæring,
  useVurdertLangvarigSykdom,
} from './SykdomOgOpplæringQueries.js';
import {
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringResultat as OpplæringVurderingDtoResultat,
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonResultat as InstitusjonVurderingDtoResultat,
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_reisetid_ReisetidResultat as ReisetidVurderingDtoResultat,
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_sykdom_LangvarigSykdomResultat as LangvarigSykdomVurderingDtoResultat,
} from '@k9-sak-web/backend/k9sak/generated/types.js';

export const InstitusjonIcon = ({ aksjonspunktKode }: { aksjonspunktKode: AksjonspunktCodes }) => {
  const { behandlingUuid } = useContext(SykdomOgOpplæringContext);
  const { data: institusjonInfo } = useInstitusjonInfo(behandlingUuid);

  if (!institusjonInfo) {
    return null;
  }

  return (
    <Icon
      aksjonspunktKode={aksjonspunktKode}
      godkjent={institusjonInfo.vurderinger.map(
        v =>
          v.resultat === InstitusjonVurderingDtoResultat.GODKJENT_MANUELT ||
          v.resultat === InstitusjonVurderingDtoResultat.GODKJENT_AUTOMATISK,
      )}
    />
  );
};

export const SykdomIcon = ({ aksjonspunktKode }: { aksjonspunktKode: AksjonspunktCodes }) => {
  const { behandlingUuid } = useContext(SykdomOgOpplæringContext);
  const { data: sykdomInfo } = useVurdertLangvarigSykdom(behandlingUuid);

  if (!sykdomInfo) {
    return null;
  }

  return (
    <Icon
      aksjonspunktKode={aksjonspunktKode}
      godkjent={[sykdomInfo.resultat === LangvarigSykdomVurderingDtoResultat.GODKJENT]}
    />
  );
};

export const OpplæringIcon = ({ aksjonspunktKode }: { aksjonspunktKode: AksjonspunktCodes }) => {
  const { behandlingUuid } = useContext(SykdomOgOpplæringContext);
  const { data: opplæringInfo } = useVurdertOpplæring(behandlingUuid);

  if (!opplæringInfo) {
    return null;
  }

  return (
    <Icon
      aksjonspunktKode={aksjonspunktKode}
      godkjent={opplæringInfo.vurderinger.map(
        v =>
          v.resultat === OpplæringVurderingDtoResultat.GODKJENT ||
          v.resultat === OpplæringVurderingDtoResultat.VURDERES_SOM_REISETID,
      )}
    />
  );
};

export const ReisetidIcon = ({ aksjonspunktKode }: { aksjonspunktKode: AksjonspunktCodes }) => {
  const { behandlingUuid, aksjonspunkter } = useContext(SykdomOgOpplæringContext);
  const { data: reisetidInfo } = useVurdertReisetid(behandlingUuid);

  const aksjonspunktForNødvendigOpplæringErÅpent = harÅpentAksjonspunkt(
    aksjonspunkter,
    aksjonspunktCodes.VURDER_OPPLÆRING,
  );

  if (!reisetidInfo || aksjonspunktForNødvendigOpplæringErÅpent) {
    return null;
  }

  return (
    <Icon
      aksjonspunktKode={aksjonspunktKode}
      godkjent={reisetidInfo.vurderinger.map(v => v.reisetid.resultat === ReisetidVurderingDtoResultat.GODKJENT)}
    />
  );
};

const Icon = ({ aksjonspunktKode, godkjent }: { aksjonspunktKode: AksjonspunktCodes; godkjent: boolean[] }) => {
  const { aksjonspunkter } = useContext(SykdomOgOpplæringContext);
  const aksjonspunktErÅpent = harÅpentAksjonspunkt(aksjonspunkter, aksjonspunktKode);
  const aksjonspunktUtført = aksjonspunktErUtført(aksjonspunkter, aksjonspunktKode);

  if (aksjonspunktErÅpent) {
    return <AksjonspunktIkon />;
  }

  if (aksjonspunktUtført && godkjent.length === 0) {
    return null;
  }

  if (aksjonspunktUtført && godkjent.every(g => g)) {
    return <CheckmarkIcon className="text-ax-brand-blue-500" />;
  }

  if (aksjonspunktUtført && godkjent.some(g => g) && godkjent.some(g => !g)) {
    return <DelvisOppfyltIkon />;
  }

  if (aksjonspunktUtført && godkjent.every(g => !g)) {
    return <XMarkOctagonFillIcon className="text-ax-danger-600" />;
  }

  return null;
};
