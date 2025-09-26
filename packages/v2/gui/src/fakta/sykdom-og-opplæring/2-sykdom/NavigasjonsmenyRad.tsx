import { BodyShort } from '@navikt/ds-react';
import { CheckmarkIcon, PersonGroupFillIcon } from '@navikt/aksel-icons';
import { RadStatus } from '../../../shared/vurderingsperiode-navigasjon/PeriodeRad';
import styles from '../../../shared/vurderingsperiode-navigasjon/periodeRad.module.css';
import type { Vurderingselement } from '../../../shared/vurderingsperiode-navigasjon/VurderingsperiodeNavigasjon';

export const NavigasjonsmenyRad = ({
  periode,
  active,
  erBruktIAksjonspunkt,
  onClick,
  erFraAnnenPart,
}: {
  periode: Vurderingselement;
  active: boolean;
  erBruktIAksjonspunkt: boolean;
  onClick: () => void;
  erFraAnnenPart?: boolean;
}) => {
  return (
    <div
      className={`${styles.interactiveListElement} ${active ? styles.interactiveListElementActive : styles.interactiveListElementInactive}`}
    >
      <button
        className="flex bg-transparent border-none cursor-pointer outline-none text-left w-full p-4"
        onClick={onClick}
      >
        <div className="flex justify-between w-full">
          <div className="flex gap-2 items-center">
            <div className="ml-2">
              <RadStatus resultat={periode.resultat} />
            </div>

            <div className="flex items-center">
              <BodyShort>{periode.perioder[0]?.prettifyPeriod().split(' - ')[0]}</BodyShort>
            </div>
            {erFraAnnenPart && (
              <div className="ml-5">
                <PersonGroupFillIcon title="Denne vurderingen er fra en annen part" className="text-2xl" />
              </div>
            )}
          </div>
          {erBruktIAksjonspunkt ? (
            <div className="flex gap-1 ml-[-8px]">
              <CheckmarkIcon fontSize={24} className="text-ax-success-600" />
              <BodyShort className="mt-[2px]">Valgt</BodyShort>
            </div>
          ) : null}
        </div>
      </button>
    </div>
  );
};

export default NavigasjonsmenyRad;
