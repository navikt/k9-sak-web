import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { aksjonspunktCodes } from '@k9-sak-web/backend/ungsak/kodeverk/AksjonspunktCodes.js';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import UngBeregningIndex from '@k9-sak-web/gui/prosess/ung-beregning/UngBeregningIndex.js';
import { isAksjonspunktOpen } from '@k9-sak-web/gui/utils/aksjonspunktUtils.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { KontrollerInntektDto, PersonopplysningDto } from '@navikt/ung-sak-typescript-client';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <UngBeregningIndex {...props} />;
  getOverstyrVisningAvKomponent = () => true;

  getData = ({ personopplysninger }: { personopplysninger: PersonopplysningDto }) => ({
    barn:
      personopplysninger?.barn?.map(barn => ({
        navn: barn.navn,
        fødselsdato: barn.fodselsdato ? new Intl.DateTimeFormat('nb-NO').format(new Date(barn.fodselsdato)) : '',
        dødsdato: barn.dodsdato ? new Intl.DateTimeFormat('nb-NO').format(new Date(barn.dodsdato)) : '',
      })) || [],
  });

  getOverstyrtStatus = ({
    kontrollerInntekt,
    aksjonspunkter,
  }: {
    kontrollerInntekt: KontrollerInntektDto;
    aksjonspunkter: Aksjonspunkt[];
  }) => {
    const harInntektTilVurdering = kontrollerInntekt?.kontrollperioder?.some(p => p.erTilVurdering);
    const harÅpneAksjonspunkt = aksjonspunkter
      .filter(ap => ap.definisjon.kode === aksjonspunktCodes.KONTROLLER_INNTEKT)
      .some(ap => isAksjonspunktOpen(ap.status.kode));

    return harInntektTilVurdering && harÅpneAksjonspunkt ? vilkarUtfallType.IKKE_VURDERT : vilkarUtfallType.OPPFYLT;
  };

  getAksjonspunktKoder = () => [aksjonspunktCodes.KONTROLLER_INNTEKT];
}

class BeregningProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.BEREGNING;

  getTekstKode = () => 'Behandlingspunkt.SatsOgBeregning';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default BeregningProsessStegPanelDef;
