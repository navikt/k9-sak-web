import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { FunctionComponent } from 'react';

import { Aksjonspunkt, Personopplysninger } from '@k9-sak-web/types';
import { useFormContext, useWatch } from 'react-hook-form';
import { OppholdInntektOgPerioderFormState, OppholdINorgeOgAdresserFaktaPanelFormState } from './FormState';
import { MerknaderFraBeslutter } from './MerknaderFraBeslutter';
import OppholdINorgeOgAdresser from './OppholdINorgeOgAdresser';
import { Periode } from './Periode';
import { Soknad } from './Soknad';

interface OppholdINorgeOgAdresserFaktaPanelProps {
  readOnly: boolean;
  alleMerknaderFraBeslutter: MerknaderFraBeslutter;
}

interface StaticFunctions {
  buildInitialValues: (
    soknad: Soknad,
    aksjonspunkter: Aksjonspunkt[],
    periode?: Periode,
  ) => OppholdINorgeOgAdresserFaktaPanelFormState;
}

/**
 * OppholdINorgeOgAdresserFaktaPanel
 *
 * Presentasjonskomponent. Er tilknyttet faktapanelet for medlemskap.
 * Viser opphold i innland og utland som er relevante for søker. ReadOnly.
 */
const OppholdINorgeOgAdresserFaktaPanel: FunctionComponent<OppholdINorgeOgAdresserFaktaPanelProps> &
  StaticFunctions = ({ readOnly, alleMerknaderFraBeslutter }) => {
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
const createParent = (isApplicant: boolean, personopplysning?: Personopplysninger) => ({
  isApplicant,
  personopplysning,
});

OppholdINorgeOgAdresserFaktaPanel.buildInitialValues = (
  soknad: Soknad,
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
  const parents = [createParent(true, personopplysninger)];
  if (personopplysninger?.annenPart) {
    parents.push(createParent(false, personopplysninger.annenPart));
  }

  const filteredAp = aksjonspunkter.filter(
    ap =>
      ap.definisjon === aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT ||
      (periode?.aksjonspunkter.includes(aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT) &&
        ap.definisjon === aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP),
  );

  return {
    opphold,
    hasBosattAksjonspunkt: filteredAp.length > 0,
    isBosattAksjonspunktClosed: filteredAp.some(ap => !isAksjonspunktOpen(ap.status)),
    foreldre: parents,
    bosattVurdering:
      periode?.bosattVurdering || periode?.bosattVurdering === false ? periode.bosattVurdering : undefined,
  };
};

export default OppholdINorgeOgAdresserFaktaPanel;
