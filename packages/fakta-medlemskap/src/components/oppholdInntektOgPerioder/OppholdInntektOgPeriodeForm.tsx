import { Button } from '@navikt/ds-react';
import { AssessedBy } from '@navikt/ft-plattform-komponenter';
import moment from 'moment';
import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import {
  BorderBox,
  FlexColumn,
  FlexContainer,
  FlexRow,
  VerticalSpacer,
  useSaksbehandlerOppslag,
} from '@fpsak-frontend/shared-components';
import { ISO_DATE_FORMAT, getKodeverknavnFn } from '@fpsak-frontend/utils';

import FaktaBegrunnelseTextFieldRHF from '@fpsak-frontend/form/src/hook-form/FaktaBegrunnelseTextFieldRHF';
import { Aksjonspunkt, KodeverkMedNavn } from '@k9-sak-web/types';
import { useFormContext, useWatch } from 'react-hook-form';
import { OppholdInntektOgPeriodeFormState, OppholdInntektOgPerioderFormState } from './FormState';
import { MedlemskapPeriode } from './Medlemskap';
import OppholdINorgeOgAdresserFaktaPanel from './OppholdINorgeOgAdresserFaktaPanel';
import { Periode } from './Periode';
import PerioderMedMedlemskapFaktaPanel from './PerioderMedMedlemskapFaktaPanel';
import { Soknad } from './Soknad';
import StatusForBorgerFaktaPanel from './StatusForBorgerFaktaPanel';

const { AVKLAR_OPPHOLDSRETT, AVKLAR_LOVLIG_OPPHOLD } = aksjonspunktCodes;

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap === aksjonspunktCode);

const transformValues = (values: OppholdInntektOgPeriodeFormState) => ({
  begrunnelse: values.begrunnelse || '---',
  ...values,
});

interface OppholdInntektOgPeriodeFormProps {
  selectedId?: string;
  readOnly: boolean;
  updateOppholdInntektPeriode: (values) => void;
  submittable: boolean;
  valgtPeriode: Periode;
  periodeResetCallback: () => void;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  alleMerknaderFraBeslutter: { notAccepted: boolean };
}

export type FormValues = {
  [key: string]: any;
};

interface StaticFunctions {
  buildInitialValues: (
    valgtPeriode: Periode,
    alleAksjonspunkter: Aksjonspunkt[],
    soknad: Soknad,
    medlemskapPerioder: MedlemskapPeriode[],
    gjeldendeFom: string,
    alleKodeverk: { [key: string]: KodeverkMedNavn[] },
  ) => FormValues;
}

export const OppholdInntektOgPeriodeForm: FunctionComponent<OppholdInntektOgPeriodeFormProps> & StaticFunctions = ({
  valgtPeriode,
  readOnly,
  updateOppholdInntektPeriode,
  submittable,
  periodeResetCallback,
  alleKodeverk,
  alleMerknaderFraBeslutter,
}) => {
  const { hentSaksbehandlerNavn } = useSaksbehandlerOppslag();
  const { control, formState } = useFormContext<OppholdInntektOgPerioderFormState>();
  const oppholdInntektOgPeriodeFormValues = useWatch({ control, name: 'oppholdInntektOgPeriodeForm' });
  const handleSubmit = () => {
    updateOppholdInntektPeriode(transformValues(oppholdInntektOgPeriodeFormValues));
  };

  const begrunnelse = useWatch({ control, name: 'oppholdInntektOgPeriodeForm.begrunnelse' });

  return (
    <BorderBox>
      <OppholdINorgeOgAdresserFaktaPanel
        readOnly={readOnly}
        alleKodeverk={alleKodeverk}
        alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
        hasBosattAksjonspunkt={valgtPeriode.isBosattAksjonspunktClosed}
        isBosattAksjonspunktClosed={valgtPeriode.isBosattAksjonspunktClosed}
      />
      <VerticalSpacer twentyPx />
      <PerioderMedMedlemskapFaktaPanel
        readOnly={readOnly}
        alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
        alleKodeverk={alleKodeverk}
      />
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
          />
          {!!begrunnelse && (
            <AssessedBy name={hentSaksbehandlerNavn(valgtPeriode?.vurdertAv)} date={valgtPeriode?.vurdertTidspunkt} />
          )}
        </>
      )}

      <VerticalSpacer twentyPx />
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <Button variant="primary" size="small" type="button" onClick={handleSubmit} disabled={!formState.isDirty}>
              <FormattedMessage id="OppholdInntektOgPeriode.Oppdater" />
            </Button>
          </FlexColumn>
          <FlexColumn>
            <Button variant="secondary" type="button" size="small" onClick={periodeResetCallback}>
              <FormattedMessage id="OppholdInntektOgPeriode.Avbryt" />
            </Button>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </BorderBox>
  );
};

OppholdInntektOgPeriodeForm.buildInitialValues = (
  valgtPeriode: Periode,
  alleAksjonspunkter: Aksjonspunkt[],
  soknad: Soknad,
  medlemskapPerioder: MedlemskapPeriode[],
  gjeldendeFom: string,
  alleKodeverk: { [key: string]: KodeverkMedNavn[] },
) => {
  const aksjonspunkter = alleAksjonspunkter
    .filter(
      ap =>
        valgtPeriode.aksjonspunkter.includes(ap.definisjon.kode) ||
        ap.definisjon.kode === aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP,
    )
    .filter(ap => ap.definisjon.kode !== aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN);
  let oppholdValues = {};
  let confirmValues = {};
  if (
    hasAksjonspunkt(AVKLAR_OPPHOLDSRETT, valgtPeriode.aksjonspunkter) ||
    hasAksjonspunkt(AVKLAR_LOVLIG_OPPHOLD, valgtPeriode.aksjonspunkter)
  ) {
    oppholdValues = StatusForBorgerFaktaPanel.buildInitialValues(valgtPeriode, aksjonspunkter);
  }
  if (valgtPeriode.aksjonspunkter.length > 0) {
    confirmValues = FaktaBegrunnelseTextFieldRHF.buildInitialValues([valgtPeriode]);
  }
  const kodeverkFn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  return {
    ...valgtPeriode,
    ...OppholdINorgeOgAdresserFaktaPanel.buildInitialValues(soknad, valgtPeriode, aksjonspunkter),
    ...PerioderMedMedlemskapFaktaPanel.buildInitialValues(
      valgtPeriode,
      medlemskapPerioder,
      soknad,
      aksjonspunkter,
      kodeverkFn,
    ),
    fom: gjeldendeFom || moment().format(ISO_DATE_FORMAT),
    ...oppholdValues,
    ...confirmValues,
  };
};

export default OppholdInntektOgPeriodeForm;
