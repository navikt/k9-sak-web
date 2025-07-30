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
  erFraTidligereBehandling,
}: {
  periode: Vurderingselement;
  active: boolean;
  erBruktIAksjonspunkt: boolean;
  onClick: () => void;
  erFraTidligereBehandling: boolean;
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
          <div className="flex items-center">
            <RadStatus resultat={periode.resultat} />

            <div className="flex ml-1 items-center">
              <BodyShort>{periode.perioder[0]?.prettifyPeriod().split(' - ')[0]}</BodyShort>
            </div>
            {erFraTidligereBehandling && (
              <div className="ml-9">
                <PersonGroupFillIcon title="Denne vurderingen er fra en tidligere behandling" className="text-2xl" />
              </div>
            )}
          </div>
          {erBruktIAksjonspunkt ? (
            <div className="flex gap-1 ml-[-4px]">
              <CheckmarkIcon fontSize={24} className="text-green-500" />
              <BodyShort className="mt-[2px]">Valgt</BodyShort>
            </div>
          ) : null}
        </div>
      </button>
    </div>
  );
};

export default NavigasjonsmenyRad;
