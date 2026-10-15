import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { FagsakDto } from '@k9-sak-web/backend/k9sak/kontrakt/fagsak/FagsakDto.js';
import { aksjonspunktkodeDefinisjonType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktkodeDefinisjon.js';
import { fagsakStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { formatereLukketPeriode } from '@k9-sak-web/gui/utils/formatters.js';
import AldersVilkarAP from './components/AldersvilkarAP.js';
import AldersVilkarStatus from './components/AldersvilkarStatus.js';
import type { AldersVilkårBehandlingType } from './types/AldersVilkårBehandlingType.js';
import type { AlderVilkårType } from './types/AlderVilkårType.js';

interface AldersVilkarProsessIndexProps {
  behandling: AldersVilkårBehandlingType;
  submitCallback: (data: unknown) => Promise<void>;
  aksjonspunkter: AksjonspunktDto[];
  isReadOnly: boolean;
  angitteBarn: { personIdent: string }[];
  isAksjonspunktOpen: boolean;
  vilkar: AlderVilkårType[];
  status: string;
  fagsak: FagsakDto;
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
  fagsak,
}: AldersVilkarProsessIndexProps) => {
  const aldersVilkarBarn = vilkar.find(v => v.vilkarType === VilkårType.ALDERSVILKÅR_BARN);
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

  const skalVilkårStatusVises = vilkaretErAutomatiskInnvilget || skalVilkarsUtfallVises;
  const skalAksjonspunktVises = !vilkaretErAutomatiskInnvilget && relevantAksjonspunkt;

  return (
    <>
      {skalVilkårStatusVises && (
        <AldersVilkarStatus
          vilkarOppfylt={vilkarOppfylt}
          vilkarReferanse={aldersVilkarBarn?.lovReferanse}
          periode={periode ? formatereLukketPeriode(`${periode.periode.fom}/${periode.periode.tom}`) : ''}
          begrunnelse={skalAksjonspunktVises ? null : begrunnelseTekst}
        />
      )}
      {skalAksjonspunktVises && (
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
          fagsak={fagsak}
        />
      )}
    </>
  );
};

export default AldersVilkarProsessIndex;
