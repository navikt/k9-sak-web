import { FormattedMessage, useIntl } from 'react-intl';

import styleLesemodus from './AldersvilkarLese.module.css';
import { AssessedBy, LabelledContent } from '@navikt/ft-plattform-komponenter';
import { Vilkarperiode } from '@k9-sak-web/types';
import { Label } from '@navikt/ds-react';

type Props = {
  aktiverRedigering: (boolean) => void;
  angitteBarn: { personIdent: string }[];
  aksjonspunktLost: boolean;
  vilkarOppfylt: boolean;
  begrunnelseTekst: string;
  vilkarperiode: Vilkarperiode;
};

const AldersvilkarLese = ({
  aktiverRedigering,
  angitteBarn,
  aksjonspunktLost,
  vilkarOppfylt,
  begrunnelseTekst,
  vilkarperiode,
}: Props) => {
  const sokersBarn = angitteBarn ? angitteBarn.map(barn => barn.personIdent).join(', ') : '';
  const intl = useIntl();

  const handleKlikk = e => {
    e.preventDefault();
    e.stopPropagation();
    aktiverRedigering(true);
  };

  return (
    <div className={`${styleLesemodus.lesemodusboks} ${styleLesemodus.alder}`}>
      <div className={styleLesemodus.aksjonspunktOgRedigerVurderingContainer}>
        <p>
          <b>
            <FormattedMessage id="AlderVilkar.Lese.Etikett.Aksjonspunkt" />
          </b>{' '}
          <FormattedMessage id="AlderVilkar.Lese.KroniskSyk" />
        </p>
        {aksjonspunktLost && (
          <div className={styleLesemodus.redigerVurderingTekst}>
            <button type="button" onClick={e => handleKlikk(e)}>
              <FormattedMessage id="AlderVilkar.Lese.Rediger" />
            </button>
          </div>
        )}
      </div>

      <div className={styleLesemodus.opplysningerFraSoknad}>
        <div>
          <FormattedMessage id="AlderVilkar.Lese.Etikett.Opplysninger" />
        </div>
        <h4>
          <FormattedMessage id="AlderVilkar.Lese.Etikett.Barn" />
        </h4>
        <p>{sokersBarn}</p>
      </div>

      <LabelledContent
        label={<FormattedMessage id="AlderVilkar.Lese.Etikett.Vurdering" />}
        content={begrunnelseTekst}
        indentContent
      />
      <AssessedBy ident={vilkarperiode?.vurdertAv} date={vilkarperiode.vurdertTidspunkt} />
      <div className="mt-8">
        <Label>
          <FormattedMessage id="AlderVilkar.Lese.Etikett.KroniskSyk" />
        </Label>
      </div>
      <p className={styleLesemodus.text}>
        {vilkarOppfylt
          ? intl.formatMessage({ id: 'AlderVilkar.KroniskSyk.Ja' })
          : intl.formatMessage({ id: 'AlderVilkar.KroniskSyk.Nei' })}
      </p>
    </div>
  );
};

export default AldersvilkarLese;
