import { BodyShort, Button } from '@navikt/ds-react';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import { RadStatus } from '../../../shared/vurderingsperiode-navigasjon/PeriodeRad';
import styles from '../../../shared/vurderingsperiode-navigasjon/periodeRad.module.css';
import type { Vurderingselement } from '../../../shared/vurderingsperiode-navigasjon/VurderingsperiodeNavigasjon';

export const NavigasjonsmenyRad = ({
  periode,
  active,
  kanBenyttes,
  datoOnClick,
}: {
  periode: Vurderingselement;
  active: boolean;
  kanBenyttes: boolean;
  datoOnClick: () => void;
}) => {
  return (
    <div
      className={`${styles.interactiveListElement} ${active ? styles.interactiveListElementActive : styles.interactiveListElementInactive}`}
    >
      <div className="flex justify-between w-full py-3.5 px-4">
        <div className="flex items-center">
          <RadStatus resultat={periode.resultat} />

          <div className="flex ml-1 items-center">
            <Button
              className={`${active ? 'text-text-default pointer-events-none' : 'text-blue-500 underline'}`}
              onClick={datoOnClick}
              size="small"
              variant="tertiary"
            >
              <BodyShort>{periode.perioder[0]?.prettifyPeriod().split(' - ')[0]}</BodyShort>
            </Button>
          </div>
        </div>
        {kanBenyttes ? null : (
          <div className="flex gap-1 ml-[-4px]">
            <CheckmarkIcon fontSize={24} className="text-green-500" />
            <BodyShort className="mt-[2px]">Valgt</BodyShort>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigasjonsmenyRad;
