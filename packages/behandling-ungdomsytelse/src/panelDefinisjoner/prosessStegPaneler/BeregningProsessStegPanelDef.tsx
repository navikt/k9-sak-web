import { aksjonspunktCodes } from '@k9-sak-web/backend/ungsak/kodeverk/AksjonspunktCodes.js';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import UngBeregningIndex from '@k9-sak-web/gui/prosess/ung-beregning/UngBeregningIndex.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { PersonopplysningDto } from '@navikt/ung-sak-typescript-client';

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

  getAksjonspunktKoder = () => [aksjonspunktCodes.KONTROLLER_INNTEKT];
}

class BeregningProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.BEREGNING;

  getTekstKode = () => 'Behandlingspunkt.SatsOgBeregning';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default BeregningProsessStegPanelDef;
