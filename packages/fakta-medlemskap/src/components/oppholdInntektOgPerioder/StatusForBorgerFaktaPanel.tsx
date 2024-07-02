import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { ArrowBox, FaktaGruppe, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { Detail } from '@navikt/ds-react';
import { RadioGroupPanel } from '@navikt/ft-form-hooks';
import React, { FunctionComponent } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { OppholdInntektOgPerioderFormState, StatusForBorgerFaktaPanelFormState } from './FormState';
import { Periode } from './Periode';

interface TransformedValues {
  kode: string;
  oppholdsrettVurdering: boolean;
  lovligOppholdVurdering: boolean;
  erEosBorger: boolean;
}

interface StatusForBorgerFaktaPanelProps {
  readOnly: boolean;
  alleMerknaderFraBeslutter: { notAccepted: boolean };
}

interface StaticFunctions {
  buildInitialValues: (periode: Periode, aksjonspunkter: Aksjonspunkt[]) => StatusForBorgerFaktaPanelFormState;
  transformValues: (values: StatusForBorgerFaktaPanelFormState, aksjonspunkter: Aksjonspunkt[]) => TransformedValues;
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
    <FaktaGruppe
      titleCode="StatusForBorgerFaktaPanel.ApplicationInformation"
      merknaderFraBeslutter={alleMerknaderFraBeslutter[apKode]}
    >
      <RadioGroupPanel
        name="oppholdInntektOgPeriodeForm.erEosBorger"
        validate={[required]}
        isReadOnly={readOnly}
        isTrueOrFalseSelection
        radios={[
          {
            value: 'true',
            label: <FormattedMessage id="StatusForBorgerFaktaPanel.CitizenEEA" />,
          },
          {
            value: 'false',
            label: <FormattedMessage id="StatusForBorgerFaktaPanel.CitizenOutsideEEA" />,
          },
        ]}
      />

      {erEosBorger && (
        <ArrowBox>
          <Detail>
            <FormattedMessage id="StatusForBorgerFaktaPanel.Oppholdsrett" />
          </Detail>
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
                label: <FormattedMessage id="StatusForBorgerFaktaPanel.HarOppholdsrett" />,
              },
              {
                value: 'false',
                label: (
                  <FormattedMessage
                    id="StatusForBorgerFaktaPanel.HarIkkeOppholdsrett"
                    values={{
                      b: chunks => <b>{chunks}</b>,
                    }}
                  />
                ),
              },
            ]}
          />
        </ArrowBox>
      )}
      {erEosBorger === false && (
        <ArrowBox alignOffset={130}>
          <Detail>
            <FormattedMessage id="StatusForBorgerFaktaPanel.LovligOpphold" />
          </Detail>
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
                label: <FormattedMessage id="StatusForBorgerFaktaPanel.HarLovligOpphold" />,
              },
              {
                value: 'false',
                label: (
                  <FormattedMessage
                    id="StatusForBorgerFaktaPanel.HarIkkeLovligOpphold"
                    values={{
                      b: chunks => <b>{chunks}</b>,
                    }}
                  />
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
    .map(ap => ap.definisjon.kode)
    .filter(
      kode => kode === aksjonspunktCodes.AVKLAR_OPPHOLDSRETT || kode === aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
    )[0];

const getEosBorger = (periode: Periode, aksjonspunkter: Aksjonspunkt[]) =>
  periode.erEosBorger || periode.erEosBorger === false
    ? periode.erEosBorger
    : aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_OPPHOLDSRETT);

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
        periode.aksjonspunkter.includes(ap.definisjon.kode) ||
        (periode.aksjonspunkter.length > 0 &&
          periode.aksjonspunkter.some(
            pap => pap === aksjonspunktCodes.AVKLAR_OPPHOLDSRETT || pap === aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
          ) &&
          ap.definisjon.kode === aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP),
    )
    .filter(ap => !isAksjonspunktOpen(ap.status.kode));

  return {
    erEosBorger,
    isBorgerAksjonspunktClosed: closedAp.length > 0,
    oppholdsrettVurdering: erEosBorger ? getOppholdsrettVurdering(periode) : undefined,
    lovligOppholdVurdering: erEosBorger === false ? getLovligOppholdVurdering(periode) : undefined,
    apKode: getApKode(aksjonspunkter),
  };
};

StatusForBorgerFaktaPanel.transformValues = (
  values: StatusForBorgerFaktaPanelFormState,
  aksjonspunkter: Aksjonspunkt[],
) => ({
  kode: getApKode(aksjonspunkter),
  oppholdsrettVurdering: values.oppholdsrettVurdering,
  lovligOppholdVurdering: values.lovligOppholdVurdering,
  erEosBorger: values.erEosBorger,
});

export default StatusForBorgerFaktaPanel;
