import FaktaBegrunnelseTextFieldRHF from '@fpsak-frontend/form/src/hook-form/FaktaBegrunnelseTextFieldRHF';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  BorderBox,
  FlexColumn,
  FlexContainer,
  FlexRow,
  VerticalSpacer,
  useSaksbehandlerOppslag,
} from '@fpsak-frontend/shared-components';
import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { Alert, Button } from '@navikt/ds-react';
import { AssessedBy } from '@navikt/ft-plattform-komponenter';
import moment from 'moment';
import { FunctionComponent, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  OppholdInntektOgPeriodeFormState,
  OppholdInntektOgPerioderFormState,
  StatusForBorgerFaktaPanelFormState,
} from './FormState';
import { MedlemskapPeriode } from './Medlemskap';
import OppholdINorgeOgAdresserFaktaPanel from './OppholdINorgeOgAdresserFaktaPanel';
import { Periode } from './Periode';
import PerioderMedMedlemskapFaktaPanel from './PerioderMedMedlemskapFaktaPanel';
import { Soknad } from './Soknad';
import StatusForBorgerFaktaPanel from './StatusForBorgerFaktaPanel';

const { AVKLAR_OPPHOLDSRETT, AVKLAR_LOVLIG_OPPHOLD } = aksjonspunktCodes;

const hasAksjonspunkt = (aksjonspunktCode: string, aksjonspunkter: string[]) =>
  aksjonspunkter.some(ap => ap === aksjonspunktCode);

const transformValues = (values: OppholdInntektOgPeriodeFormState) => ({
  begrunnelse: values.begrunnelse || '---',
  ...values,
});

interface OppholdInntektOgPeriodeFormProps {
  selectedId?: string;
  readOnly: boolean;
  updateOppholdInntektPeriode: (values: OppholdInntektOgPeriodeFormState) => void;
  submittable: boolean;
  valgtPeriode: Periode;
  periodeResetCallback: () => void;
  alleMerknaderFraBeslutter: { notAccepted: boolean };
}

interface StaticFunctions {
  buildInitialValues: (
    valgtPeriode: Periode,
    alleAksjonspunkter: Aksjonspunkt[],
    soknad: Soknad,
    medlemskapPerioder: MedlemskapPeriode[],
    gjeldendeFom: string,
  ) => OppholdInntektOgPeriodeFormState;
}

export const OppholdInntektOgPeriodeForm: FunctionComponent<OppholdInntektOgPeriodeFormProps> & StaticFunctions = ({
  valgtPeriode,
  readOnly,
  updateOppholdInntektPeriode,
  submittable,
  periodeResetCallback,
  alleMerknaderFraBeslutter,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { hentSaksbehandlerNavn } = useSaksbehandlerOppslag();
  const { control, formState, trigger } = useFormContext<OppholdInntektOgPerioderFormState>();
  const oppholdInntektOgPeriodeFormValues = useWatch({ control, name: 'oppholdInntektOgPeriodeForm' });
  const handleSubmit = () => {
    trigger('oppholdInntektOgPeriodeForm').then(isValid => {
      if (isValid) {
        setIsSubmitted(true);
      }
    });
    updateOppholdInntektPeriode(transformValues(oppholdInntektOgPeriodeFormValues));
  };

  const begrunnelse = useWatch({ control, name: 'oppholdInntektOgPeriodeForm.begrunnelse' });
  const perioder = useWatch({ control, name: 'perioder' });
  const harAndreÅpneAksjonspunkter = perioder.some(
    periode => periode.aksjonspunkter.length > 0 && periode.begrunnelse === null,
  );
  return (
    <BorderBox>
      <OppholdINorgeOgAdresserFaktaPanel
        readOnly={readOnly}
        alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
        hasBosattAksjonspunkt={valgtPeriode.isBosattAksjonspunktClosed}
        isBosattAksjonspunktClosed={valgtPeriode.isBosattAksjonspunktClosed}
      />
      <VerticalSpacer twentyPx />
      <PerioderMedMedlemskapFaktaPanel readOnly={readOnly} alleMerknaderFraBeslutter={alleMerknaderFraBeslutter} />
      {(hasAksjonspunkt(AVKLAR_OPPHOLDSRETT, valgtPeriode.aksjonspunkter) ||
        hasAksjonspunkt(AVKLAR_LOVLIG_OPPHOLD, valgtPeriode.aksjonspunkter)) && (
        <StatusForBorgerFaktaPanel readOnly={readOnly} alleMerknaderFraBeslutter={alleMerknaderFraBeslutter} />
      )}
      <VerticalSpacer twentyPx />
      {valgtPeriode.aksjonspunkter && valgtPeriode.aksjonspunkter.length > 0 && (
        <>
          <FaktaBegrunnelseTextFieldRHF
            isReadOnly={readOnly}
            isSubmittable={submittable}
            hasBegrunnelse={!!begrunnelse}
            name="oppholdInntektOgPeriodeForm.begrunnelse"
            label="Begrunn endringene"
          />
          {!!begrunnelse && (
            <AssessedBy name={hentSaksbehandlerNavn(valgtPeriode?.vurdertAv)} date={valgtPeriode?.vurdertTidspunkt} />
          )}
        </>
      )}

      <VerticalSpacer twentyPx />
      {submittable && (
        <FlexContainer>
          <FlexRow>
            <FlexColumn>
              <Button variant="primary" size="small" type="button" onClick={handleSubmit} disabled={!formState.isDirty}>
                Oppdater
              </Button>
            </FlexColumn>
            <FlexColumn>
              <Button variant="secondary" type="button" size="small" onClick={periodeResetCallback}>
                Avbryt
              </Button>
            </FlexColumn>
          </FlexRow>
          {harAndreÅpneAksjonspunkter && isSubmitted && (
            <Alert inline variant="info" className="mt-3">
              Denne perioden er nå oppdatert. Du har flere perioder som må vurderes før du kan bekrefte og fortsette.
            </Alert>
          )}
        </FlexContainer>
      )}
    </BorderBox>
  );
};

OppholdInntektOgPeriodeForm.buildInitialValues = (
  valgtPeriode: Periode,
  alleAksjonspunkter: Aksjonspunkt[],
  soknad: Soknad,
  medlemskapPerioder: MedlemskapPeriode[],
  gjeldendeFom: string,
) => {
  const aksjonspunkter = alleAksjonspunkter
    .filter(
      ap =>
        valgtPeriode.aksjonspunkter.includes(ap.definisjon) ||
        ap.definisjon === aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP,
    )
    .filter(ap => ap.definisjon !== aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN);
  let oppholdValues: StatusForBorgerFaktaPanelFormState | undefined;
  let confirmValues:
    | {
        begrunnelse: string;
      }
    | undefined;
  if (
    hasAksjonspunkt(AVKLAR_OPPHOLDSRETT, valgtPeriode.aksjonspunkter) ||
    hasAksjonspunkt(AVKLAR_LOVLIG_OPPHOLD, valgtPeriode.aksjonspunkter)
  ) {
    oppholdValues = StatusForBorgerFaktaPanel.buildInitialValues(valgtPeriode, aksjonspunkter);
  }
  if (valgtPeriode.aksjonspunkter.length > 0) {
    confirmValues = FaktaBegrunnelseTextFieldRHF.buildInitialValues([valgtPeriode]);
  }

  return {
    ...valgtPeriode,
    ...OppholdINorgeOgAdresserFaktaPanel.buildInitialValues(soknad, valgtPeriode, aksjonspunkter),
    ...PerioderMedMedlemskapFaktaPanel.buildInitialValues(valgtPeriode, medlemskapPerioder, soknad, aksjonspunkter),
    fom: gjeldendeFom || moment().format(ISO_DATE_FORMAT),
    ...oppholdValues,
    ...confirmValues,
  };
};

export default OppholdInntektOgPeriodeForm;
