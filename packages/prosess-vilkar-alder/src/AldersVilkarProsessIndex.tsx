import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { formatereLukketPeriode } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import type { Aksjonspunkt, Behandling, Vilkar } from '@k9-sak-web/types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import AldersVilkarAP from './components/AldersvilkarAP';
import AldersVilkarStatus from './components/AldersvilkarStatus';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface AldersVilkarProsessIndexProps {
  behandling: Behandling;
  submitCallback: () => void;
  aksjonspunkter: Aksjonspunkt[];
  isReadOnly: boolean;
  angitteBarn: { personIdent: string }[];
  isAksjonspunktOpen: boolean;
  vilkar: Vilkar[];
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
  const aldersVilkarBarn = vilkar.find(v => v.vilkarType.kode === vilkarType.ALDERSVILKAR_BARN);
  const periode = aldersVilkarBarn.perioder[0];
  const erVurdert = periode.vilkarStatus.kode !== vilkarUtfallType.IKKE_VURDERT;
  const vilkarOppfylt = erVurdert ? status === vilkarUtfallType.OPPFYLT : false;
  const relevantAksjonspunkt: Aksjonspunkt = aksjonspunkter.find(
    ap => ap.definisjon.kode === aksjonspunktCodes.ALDERSVILKÅR,
  );
  const skalVilkarsUtfallVises = behandling.status.kode === behandlingStatus.AVSLUTTET;
  const vilkaretErAutomatiskInnvilget =
    !relevantAksjonspunkt && aldersVilkarBarn && periode?.vilkarStatus.kode === vilkarUtfallType.OPPFYLT;
  let begrunnelseTekst = '';
  if (!vilkaretErAutomatiskInnvilget) begrunnelseTekst = relevantAksjonspunkt?.begrunnelse || '';

  const skalVilkårStatusVises = vilkaretErAutomatiskInnvilget || skalVilkarsUtfallVises;
  const skalAksjonspunktVises = !vilkaretErAutomatiskInnvilget && relevantAksjonspunkt;

  return (
    <RawIntlProvider value={intl}>
      {skalVilkårStatusVises && (
        <AldersVilkarStatus
          vilkarOppfylt={vilkarOppfylt}
          vilkarReferanse={aldersVilkarBarn.lovReferanse}
          periode={formatereLukketPeriode(`${periode.periode.fom}/${periode.periode.tom}`)}
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
          status={status}
          erVurdert={erVurdert}
          vilkarOppfylt={vilkarOppfylt}
          begrunnelseTekst={begrunnelseTekst}
        />
      )}
    </RawIntlProvider>
  );
};

export default AldersVilkarProsessIndex;
