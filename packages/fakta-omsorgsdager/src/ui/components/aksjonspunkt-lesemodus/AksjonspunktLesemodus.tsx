import Lenke from 'nav-frontend-lenker';
import React from 'react';
import styleLesemodus from '../lesemodus/lesemodusboks.css';

interface OwnProps {
  harAksjonspunktBlivitLostTidligare: boolean;
  åpneForRedigereInformasjon: () => void;
  aksjonspunktTekst: string;
}

const AksjonspunktLesemodus = ({
  harAksjonspunktBlivitLostTidligare,
  åpneForRedigereInformasjon,
  aksjonspunktTekst,
}: OwnProps) => {
  const håndtereKlikk = e => {
    e.preventDefault();
    e.stopPropagation();
    åpneForRedigereInformasjon();
  };

  return (
    <div className={styleLesemodus.aksjonspunktOgRedigerVurderingContainer}>
      <p>
        <b>Behandlet aksjonspunkt:</b> {aksjonspunktTekst}
      </p>
      {harAksjonspunktBlivitLostTidligare && (
        <div className={styleLesemodus.redigerVurderingTekst}>
          <Lenke
            href="#"
            onClick={e => {
              håndtereKlikk(e);
            }}
          >
            Rediger vurdering
          </Lenke>
        </div>
      )}
    </div>
  );
};
export default AksjonspunktLesemodus;
