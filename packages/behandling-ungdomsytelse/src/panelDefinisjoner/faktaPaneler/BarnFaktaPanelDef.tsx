import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import UngBarnFakta from '@k9-sak-web/gui/fakta/ung-barn/UngBarnFakta.js';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { PersonopplysningDto } from '@navikt/ung-sak-typescript-client';

class BarnFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.BARN;

  getTekstKode = () => 'FaktaBarn.Title';

  getKomponent = props => <UngBarnFakta {...props} />;

  getOverstyrVisningAvKomponent = () => true;

  getData = ({ personopplysninger }: { personopplysninger: PersonopplysningDto }) => ({
    barn:
      personopplysninger?.barn?.map(barn => ({
        navn: barn.navn,
        fødselsdato: new Intl.DateTimeFormat('nb-NO').format(new Date(barn.fodselsdato)),
        dødsdato: barn.dodsdato ? new Intl.DateTimeFormat('nb-NO').format(new Date(barn.dodsdato)) : '',
      })) || [],
  });
}

export default BarnFaktaPanelDef;
