import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import type { FunctionComponent } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { isAksjonspunktOpen } from '../../../../utils/aksjonspunktUtils';
import type { Aksjonspunkt } from '../../types/Aksjonspunkt';
import type { OppholdInntektOgPerioderFormState } from '../../types/FormState';
import type { MerknaderFraBeslutter } from '../../types/MerknaderFraBeslutter';
import type { Periode } from '../../types/Periode';
import type { Søknad } from '../../types/Søknad';
import OppholdINorgeOgAdresser from './OppholdINorgeOgAdresser';

interface OppholdINorgeOgAdresserFaktaPanelProps {
  readOnly: boolean;
  alleMerknaderFraBeslutter: MerknaderFraBeslutter;
}

/**
 * OppholdINorgeOgAdresserFaktaPanel
 *
 * Presentasjonskomponent. Er tilknyttet faktapanelet for medlemskap.
 * Viser opphold i innland og utland som er relevante for søker. ReadOnly.
 */
const OppholdINorgeOgAdresserFaktaPanel: FunctionComponent<OppholdINorgeOgAdresserFaktaPanelProps> = ({
  readOnly,
  alleMerknaderFraBeslutter,
}) => {
  const { control } = useFormContext<OppholdInntektOgPerioderFormState>();
  const { foreldre, opphold, hasBosattAksjonspunkt, isBosattAksjonspunktClosed } = useWatch({
    control,
    name: 'oppholdInntektOgPeriodeForm',
  });
  return (
    <OppholdINorgeOgAdresser
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      foreldre={foreldre}
      hasBosattAksjonspunkt={hasBosattAksjonspunkt}
      isBosattAksjonspunktClosed={isBosattAksjonspunktClosed}
      opphold={opphold}
      readOnly={readOnly}
    />
  );
};
const createParent = (isApplicant: boolean, personopplysning: Periode['personopplysninger']) => ({
  isApplicant,
  personopplysning,
});

export const buildInitialValuesOppholdINorgeOgAdresserFaktaPanel = (
  soknad: Søknad,
  aksjonspunkter: Aksjonspunkt[],
  periode?: Periode,
) => {
  let opphold = {};

  if (soknad && soknad.oppgittTilknytning) {
    const { oppgittTilknytning } = soknad;
    opphold = {
      utlandsopphold: oppgittTilknytning.utlandsopphold,
    };
  }

  const { personopplysninger } = periode || {};
  const foreldre = personopplysninger ? [createParent(true, personopplysninger)] : [];
  if (personopplysninger?.annenPart) {
    foreldre.push(createParent(false, personopplysninger.annenPart));
  }

  const filteredAp = aksjonspunkter.filter(
    ap =>
      ap.definisjon === aksjonspunktCodes.AVKLAR_OM_ER_BOSATT ||
      (periode?.aksjonspunkter.includes(aksjonspunktCodes.AVKLAR_OM_ER_BOSATT) &&
        ap.definisjon === aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP),
  );

  return {
    opphold,
    hasBosattAksjonspunkt: filteredAp.length > 0,
    isBosattAksjonspunktClosed: filteredAp.some(ap => !isAksjonspunktOpen(ap.status)),
    foreldre: foreldre,
    bosattVurdering:
      periode?.bosattVurdering || periode?.bosattVurdering === false ? periode.bosattVurdering : undefined,
  };
};

export default OppholdINorgeOgAdresserFaktaPanel;
