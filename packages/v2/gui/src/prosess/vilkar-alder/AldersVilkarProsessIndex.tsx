import type { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { aksjonspunktkodeDefinisjonType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktkodeDefinisjon.js';
import { fagsakStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { vilkarType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { formatDate } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import AldersVilkarAP from './components/AldersvilkarAP';
import AldersVilkarStatus from './components/AldersvilkarStatus';
import type { AldersVilkårBehandlingType } from './types/AldersVilkårBehandlingType';
import type { AlderVilkårType } from './types/AlderVilkårType';

const formatereLukketPeriode = (periode: string): string => {
  const [fom, tom] = periode.split('/');
  return fom && tom ? `${formatDate(fom)} - ${formatDate(tom)}` : periode;
};

interface AldersVilkarProsessIndexProps {
  behandling: AldersVilkårBehandlingType;
  submitCallback: () => void;
  aksjonspunkter: AksjonspunktDto[];
  isReadOnly: boolean;
  angitteBarn: { personIdent: string }[];
  isAksjonspunktOpen: boolean;
  vilkar: AlderVilkårType[];
  status: string;
}

const AldersVilkarProsessIndex = ({
  behandling,
  submitCallback,
  aksjonspunkter,
  isReadOnly,
  angitteBarn,
  isAksjonspunktOpen,
  vilkar,
  status,
}: AldersVilkarProsessIndexProps) => {
  const aldersVilkarBarn = vilkar.find(v => v.vilkarType === vilkarType.ALDERSVILKÅR_BARN);
  const periode = aldersVilkarBarn?.perioder?.[0];
  const erVurdert = periode?.vilkarStatus !== vilkårStatus.IKKE_VURDERT;
  const vilkarOppfylt = erVurdert ? status === vilkårStatus.OPPFYLT : false;
  const relevantAksjonspunkt = aksjonspunkter.find(ap => ap.definisjon === aksjonspunktkodeDefinisjonType.ALDERSVILKÅR);
  const skalVilkarsUtfallVises = behandling.status === fagsakStatus.AVSLUTTET;
  const vilkaretErAutomatiskInnvilget =
    !relevantAksjonspunkt && aldersVilkarBarn && periode?.vilkarStatus === vilkårStatus.OPPFYLT;
  let begrunnelseTekst = '';
  if (!vilkaretErAutomatiskInnvilget) {
    begrunnelseTekst = relevantAksjonspunkt?.begrunnelse || '';
  }

  return (
    <>
      {(vilkaretErAutomatiskInnvilget || skalVilkarsUtfallVises) && (
        <AldersVilkarStatus
          vilkarOppfylt={vilkarOppfylt}
          vilkarReferanse={aldersVilkarBarn?.lovReferanse}
          periode={periode ? formatereLukketPeriode(`${periode.periode.fom}/${periode.periode.tom}`) : ''}
          begrunnelse={begrunnelseTekst}
        />
      )}
      {!vilkaretErAutomatiskInnvilget && relevantAksjonspunkt && (
        <AldersVilkarAP
          behandling={behandling}
          submitCallback={submitCallback}
          relevantAksjonspunkt={relevantAksjonspunkt}
          isReadOnly={isReadOnly}
          angitteBarn={angitteBarn}
          isAksjonspunktOpen={isAksjonspunktOpen}
          erVurdert={erVurdert}
          vilkarOppfylt={vilkarOppfylt}
          begrunnelseTekst={begrunnelseTekst}
        />
      )}
    </>
  );
};

export default AldersVilkarProsessIndex;
