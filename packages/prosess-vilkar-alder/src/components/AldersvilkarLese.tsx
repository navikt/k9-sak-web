import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';

import styleLesemodus from './AldersvilkarLese.module.css';

type Props = {
  aktiverRedigering: (boolean) => void;
  angitteBarn: { personIdent: string }[];
  aksjonspunktLost: boolean;
  vilkarOppfylt: boolean;
  begrunnelseTekst: string;
};

const AldersvilkarLese = ({
  aktiverRedigering,
  angitteBarn,
  aksjonspunktLost,
  vilkarOppfylt,
  begrunnelseTekst,
  intl,
}: Props & WrappedComponentProps) => {
  const sokersBarn = angitteBarn ? angitteBarn.map(barn => barn.personIdent).join(', ') : '';

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

      <p className={styleLesemodus.label}>
        <FormattedMessage id="AlderVilkar.Lese.Etikett.Vurdering" />
      </p>
      <p className={styleLesemodus.fritekst}>{begrunnelseTekst}</p>
      <p className={styleLesemodus.label}>
        <FormattedMessage id="AlderVilkar.Lese.Etikett.KroniskSyk" />
      </p>
      <p className={styleLesemodus.text}>
        {vilkarOppfylt
          ? intl.formatMessage({ id: 'AlderVilkar.KroniskSyk.Ja' })
          : intl.formatMessage({ id: 'AlderVilkar.KroniskSyk.Nei' })}
      </p>
    </div>
  );
};

export default injectIntl(AldersvilkarLese);
