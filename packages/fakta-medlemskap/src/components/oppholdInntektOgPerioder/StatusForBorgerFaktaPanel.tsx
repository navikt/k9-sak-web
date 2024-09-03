import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { ArrowBox, FaktaGruppe, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { Detail } from '@navikt/ds-react';
import { RadioGroupPanel } from '@navikt/ft-form-hooks';
import { FunctionComponent } from 'react';
import { useFormContext } from 'react-hook-form';
import { OppholdInntektOgPerioderFormState, StatusForBorgerFaktaPanelFormState } from './FormState';
import { Periode } from './Periode';

interface StatusForBorgerFaktaPanelProps {
  readOnly: boolean;
  alleMerknaderFraBeslutter: { notAccepted: boolean };
}

interface StaticFunctions {
  buildInitialValues: (periode: Periode, aksjonspunkter: Aksjonspunkt[]) => StatusForBorgerFaktaPanelFormState;
}

/**
 * StatusForBorgerFaktaPanel
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av borgerstatus (Medlemskapsvilkåret).
 */
const StatusForBorgerFaktaPanel: FunctionComponent<StatusForBorgerFaktaPanelProps> & StaticFunctions = ({
  readOnly,
  alleMerknaderFraBeslutter,
}) => {
  const { getValues } = useFormContext<OppholdInntektOgPerioderFormState>();
  const {
    oppholdInntektOgPeriodeForm: { erEosBorger, isBorgerAksjonspunktClosed, apKode },
  } = getValues();
  return (
    <FaktaGruppe titleCode="Status for søker" merknaderFraBeslutter={alleMerknaderFraBeslutter[apKode]} useIntl={false}>
      <RadioGroupPanel
        name="oppholdInntektOgPeriodeForm.erEosBorger"
        validate={[required]}
        isReadOnly={readOnly}
        isTrueOrFalseSelection
        radios={[
          {
            value: 'true',
            label: 'EØS borger',
          },
          {
            value: 'false',
            label: 'Utenlandsk borger utenfor EØS',
          },
        ]}
      />

      {erEosBorger && (
        <ArrowBox>
          <Detail>Oppholdsrett</Detail>
          <VerticalSpacer fourPx />
          <RadioGroupPanel
            name="oppholdInntektOgPeriodeForm.oppholdsrettVurdering"
            validate={[required]}
            isReadOnly={readOnly}
            isEdited={isBorgerAksjonspunktClosed}
            isTrueOrFalseSelection
            radios={[
              {
                value: 'true',
                label: 'Søker har oppholdsrett',
              },
              {
                value: 'false',
                label: (
                  <>
                    Søker har <b>ikke</b> oppholdsrett
                  </>
                ),
              },
            ]}
          />
        </ArrowBox>
      )}
      {erEosBorger === false && (
        <ArrowBox alignOffset={130}>
          <Detail>Lovlig opphold</Detail>
          <VerticalSpacer fourPx />
          <RadioGroupPanel
            name="oppholdInntektOgPeriodeForm.lovligOppholdVurdering"
            validate={[required]}
            isReadOnly={readOnly}
            isEdited={isBorgerAksjonspunktClosed}
            isTrueOrFalseSelection
            radios={[
              {
                value: 'true',
                label: 'Søker har lovlig opphold',
              },
              {
                value: 'false',
                label: (
                  <>
                    Søker har <b>ikke</b> lovlig opphold
                  </>
                ),
              },
            ]}
          />
        </ArrowBox>
      )}
    </FaktaGruppe>
  );
};

const getApKode = (aksjonspunkter: Aksjonspunkt[]) =>
  aksjonspunkter
    .map(ap => ap.definisjon)
    .filter(
      kode => kode === aksjonspunktCodes.AVKLAR_OPPHOLDSRETT || kode === aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
    )[0];

const getEosBorger = (periode: Periode, aksjonspunkter: Aksjonspunkt[]) =>
  periode.erEosBorger || periode.erEosBorger === false
    ? periode.erEosBorger
    : aksjonspunkter.some(ap => ap.definisjon === aksjonspunktCodes.AVKLAR_OPPHOLDSRETT);

const getOppholdsrettVurdering = (periode: Periode) =>
  periode.oppholdsrettVurdering || periode.oppholdsrettVurdering === false ? periode.oppholdsrettVurdering : undefined;

const getLovligOppholdVurdering = (periode: Periode) =>
  periode.lovligOppholdVurdering || periode.lovligOppholdVurdering === false
    ? periode.lovligOppholdVurdering
    : undefined;

StatusForBorgerFaktaPanel.buildInitialValues = (periode: Periode, aksjonspunkter: Aksjonspunkt[]) => {
  const erEosBorger = getEosBorger(periode, aksjonspunkter);

  const closedAp = aksjonspunkter
    .filter(
      ap =>
        periode.aksjonspunkter.includes(ap.definisjon) ||
        (periode.aksjonspunkter.length > 0 &&
          periode.aksjonspunkter.some(
            pap => pap === aksjonspunktCodes.AVKLAR_OPPHOLDSRETT || pap === aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
          ) &&
          ap.definisjon === aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP),
    )
    .filter(ap => !isAksjonspunktOpen(ap.status));

  return {
    erEosBorger,
    isBorgerAksjonspunktClosed: closedAp.length > 0,
    oppholdsrettVurdering: erEosBorger ? getOppholdsrettVurdering(periode) : undefined,
    lovligOppholdVurdering: erEosBorger === false ? getLovligOppholdVurdering(periode) : undefined,
    apKode: getApKode(aksjonspunkter),
  };
};

export default StatusForBorgerFaktaPanel;
