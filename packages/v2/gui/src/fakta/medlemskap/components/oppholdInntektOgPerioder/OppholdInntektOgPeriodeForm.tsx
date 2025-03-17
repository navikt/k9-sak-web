import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { Alert, Box, Button, HStack, VStack } from '@navikt/ds-react';
import { TextAreaField } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, minLength, required } from '@navikt/ft-form-validators';
import { AssessedBy } from '@navikt/ft-plattform-komponenter';
import { type FunctionComponent, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { getCurrentISODate } from '../../../../utils/dateutils';
import type { Aksjonspunkt } from '../../types/Aksjonspunkt';
import type {
  OppholdInntektOgPeriodeFormState,
  OppholdInntektOgPerioderFormState,
  StatusForBorgerFaktaPanelFormState,
} from '../../types/FormState';
import type { MedlemskapPeriode } from '../../types/Medlemskap';
import type { MerknaderFraBeslutter } from '../../types/MerknaderFraBeslutter';
import type { Periode } from '../../types/Periode';
import type { Soknad } from '../../types/Soknad';
import OppholdINorgeOgAdresserFaktaPanel, {
  buildInitialValuesOppholdINorgeOgAdresserFaktaPanel,
} from './OppholdINorgeOgAdresserFaktaPanel';
import PerioderMedMedlemskapFaktaPanel, {
  buildInitialValuesPerioderMedMedlemskapFaktaPanel,
} from './PerioderMedMedlemskapFaktaPanel';
import StatusForBorgerFaktaPanel, { buildInitialValuesStatusForBorgerFaktaPanel } from './StatusForBorgerFaktaPanel';

const { AVKLAR_OPPHOLDSRETT, AVKLAR_LOVLIG_OPPHOLD } = aksjonspunktCodes;

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const hasAksjonspunkt = (aksjonspunktCode: string, aksjonspunkter: string[]) =>
  aksjonspunkter.some(ap => ap === aksjonspunktCode);

const transformValues = (values: OppholdInntektOgPeriodeFormState) => ({
  ...values,
  begrunnelse: values.begrunnelse || '---',
});

interface OppholdInntektOgPeriodeFormProps {
  selectedId?: string;
  readOnly: boolean;
  updateOppholdInntektPeriode: (values: OppholdInntektOgPeriodeFormState) => void;
  submittable: boolean;
  valgtPeriode: Periode;
  periodeResetCallback: () => void;
  alleMerknaderFraBeslutter: MerknaderFraBeslutter;
}

export const OppholdInntektOgPeriodeForm: FunctionComponent<OppholdInntektOgPeriodeFormProps> = ({
  valgtPeriode,
  readOnly,
  updateOppholdInntektPeriode,
  submittable,
  periodeResetCallback,
  alleMerknaderFraBeslutter,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { control, formState, trigger } = useFormContext<OppholdInntektOgPerioderFormState>();
  const oppholdInntektOgPeriodeFormValues = useWatch({ control, name: 'oppholdInntektOgPeriodeForm' });
  const handleSubmit = async () => {
    try {
      const isValid = await trigger('oppholdInntektOgPeriodeForm');
      if (isValid) {
        setIsSubmitted(true);
      }
    } finally {
      updateOppholdInntektPeriode(transformValues(oppholdInntektOgPeriodeFormValues));
    }
  };

  const begrunnelse = useWatch({ control, name: 'oppholdInntektOgPeriodeForm.begrunnelse' });
  const perioder = useWatch({ control, name: 'perioder' });
  const harAndreÅpneAksjonspunkter = perioder.some(
    periode => periode.aksjonspunkter.length > 0 && periode.begrunnelse === null,
  );
  return (
    <Box
      marginBlock="4 0"
      background="surface-default"
      padding="4"
      borderWidth="1"
      borderColor="border-subtle"
      borderRadius="medium"
    >
      <VStack gap="5">
        <OppholdINorgeOgAdresserFaktaPanel readOnly={readOnly} alleMerknaderFraBeslutter={alleMerknaderFraBeslutter} />

        <PerioderMedMedlemskapFaktaPanel readOnly={readOnly} alleMerknaderFraBeslutter={alleMerknaderFraBeslutter} />
        {(hasAksjonspunkt(AVKLAR_OPPHOLDSRETT, valgtPeriode.aksjonspunkter) ||
          hasAksjonspunkt(AVKLAR_LOVLIG_OPPHOLD, valgtPeriode.aksjonspunkter)) && (
          <StatusForBorgerFaktaPanel readOnly={readOnly} alleMerknaderFraBeslutter={alleMerknaderFraBeslutter} />
        )}

        {valgtPeriode.aksjonspunkter && valgtPeriode.aksjonspunkter.length > 0 && (submittable || !!begrunnelse) && (
          <>
            <TextAreaField
              name="oppholdInntektOgPeriodeForm.begrunnelse"
              label="Begrunn endringene"
              readOnly={readOnly}
              validate={[required, minLength3, maxLength1500, hasValidText]}
            />
            <AssessedBy ident={valgtPeriode?.vurdertAv} date={valgtPeriode?.vurdertTidspunkt} />
          </>
        )}

        {submittable && (
          <>
            <HStack gap="4">
              <Button variant="primary" size="small" type="button" onClick={handleSubmit} disabled={!formState.isDirty}>
                Oppdater
              </Button>
              <Button variant="secondary" type="button" size="small" onClick={periodeResetCallback}>
                Avbryt
              </Button>
            </HStack>
            {harAndreÅpneAksjonspunkter && isSubmitted && (
              <Alert inline variant="info" className="mt-3">
                Denne perioden er nå oppdatert. Du har flere perioder som må vurderes før du kan bekrefte og fortsette.
              </Alert>
            )}
          </>
        )}
      </VStack>
    </Box>
  );
};

export const buildInitialValuesOppholdInntektOgPeriodeForm = (
  alleAksjonspunkter: Aksjonspunkt[],
  soknad: Soknad,
  medlemskapPerioder: MedlemskapPeriode[],
  gjeldendeFom: string,
  valgtPeriode: Periode,
) => {
  const aksjonspunkter = alleAksjonspunkter.filter(
    ap =>
      valgtPeriode?.aksjonspunkter.some(a => a === ap.definisjon) ||
      ap.definisjon === aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP,
  );
  let oppholdValues: StatusForBorgerFaktaPanelFormState | undefined;
  let confirmValues:
    | {
        begrunnelse: string;
      }
    | undefined;
  if (
    valgtPeriode &&
    (hasAksjonspunkt(AVKLAR_OPPHOLDSRETT, valgtPeriode.aksjonspunkter) ||
      hasAksjonspunkt(AVKLAR_LOVLIG_OPPHOLD, valgtPeriode.aksjonspunkter))
  ) {
    oppholdValues = buildInitialValuesStatusForBorgerFaktaPanel(valgtPeriode, aksjonspunkter);
  }
  if (valgtPeriode && valgtPeriode.aksjonspunkter.length > 0) {
    confirmValues = { begrunnelse: valgtPeriode.begrunnelse };
  }
  return {
    ...valgtPeriode,
    ...buildInitialValuesOppholdINorgeOgAdresserFaktaPanel(soknad, aksjonspunkter, valgtPeriode),
    ...buildInitialValuesPerioderMedMedlemskapFaktaPanel(medlemskapPerioder, soknad, aksjonspunkter, valgtPeriode),
    fom: gjeldendeFom || getCurrentISODate(),
    ...oppholdValues,
    ...confirmValues,
  };
};

export default OppholdInntektOgPeriodeForm;
