import { Link } from '@navikt/ds-react';
import React from 'react';
import styleLesemodus from '../lesemodus/lesemodusboks.module.css';

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
          <Link
            href="#"
            onClick={e => {
              håndtereKlikk(e);
            }}
          >
            Rediger vurdering
          </Link>
        </div>
      )}
    </div>
  );
};
export default AksjonspunktLesemodus;
