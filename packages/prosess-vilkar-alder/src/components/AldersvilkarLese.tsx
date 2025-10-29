import React from 'react';

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
            Behandlet aksjonspunkt:
          </b>{' '}
          Vurder om aldersvilkåret er oppfylt
        </p>
        {aksjonspunktLost && (
          <div className={styleLesemodus.redigerVurderingTekst}>
            <button type="button" onClick={e => handleKlikk(e)}>
              Rediger vurdering
            </button>
          </div>
        )}
      </div>

      <div className={styleLesemodus.opplysningerFraSoknad}>
        <div>
          Opplysninger fra søknaden:
        </div>
        <h4>
          Søkers barn:
        </h4>
        <p>{sokersBarn}</p>
      </div>

      <p className={styleLesemodus.label}>
        Vurdering
      </p>
      <p className={styleLesemodus.fritekst}>{begrunnelseTekst}</p>
      <p className={styleLesemodus.label}>
        Er aldersvilkåret oppfylt?
      </p>
      <p className={styleLesemodus.text}>
        {vilkarOppfylt
          ? "Ja"
          : "Nei"}
      </p>
    </div>
  );
};

export default injectIntl(AldersvilkarLese);
