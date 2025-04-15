import { Label } from '@navikt/ds-react';
import { LabelledContent } from '../../../shared/labelled-content/LabelledContent';
import styleLesemodus from './AldersvilkarLese.module.css';

type Props = {
  aktiverRedigering: (aktiver: boolean) => void;
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
}: Props) => {
  const sokersBarn = angitteBarn ? angitteBarn.map(barn => barn.personIdent).join(', ') : '';

  const handleKlikk = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    aktiverRedigering(true);
  };

  return (
    <div className={`${styleLesemodus.lesemodusboks} ${styleLesemodus.alder}`}>
      <div className={styleLesemodus.aksjonspunktOgRedigerVurderingContainer}>
        <p>
          <b>Behandlet aksjonspunkt:</b> Vurder om aldersvilkåret er oppfylt
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
        <div>Opplysninger fra søknaden:</div>
        <h4>Søkers barn:</h4>
        <p>{sokersBarn}</p>
      </div>

      <LabelledContent label="Vurdering" content={begrunnelseTekst} indentContent />
      <div className="mt-8">
        <Label>Er aldersvilkåret oppfylt?</Label>
      </div>
      <p className={styleLesemodus.text}>{vilkarOppfylt ? 'Ja' : 'Nei'}</p>
    </div>
  );
};

export default AldersvilkarLese;
