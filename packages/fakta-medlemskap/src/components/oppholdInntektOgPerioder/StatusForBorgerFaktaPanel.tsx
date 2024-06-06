import { RadioGroupField, behandlingFormValueSelector } from '@fpsak-frontend/form';
import React, { FunctionComponent } from 'react';
import { FormattedMessage, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { ArrowBox, FaktaGruppe, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { Detail } from '@navikt/ds-react';

export type FormValues = {
  erEosBorger: boolean;
  isBorgerAksjonspunktClosed: boolean;
  oppholdsrettVurdering: boolean;
  lovligOppholdVurdering: boolean;
  apKode: string;
};

interface TransformedValues {
  kode: string;
  oppholdsrettVurdering: boolean;
  lovligOppholdVurdering: boolean;
  erEosBorger: boolean;
}

interface StatusForBorgerFaktaPanelProps {
  readOnly: boolean;
  isBorgerAksjonspunktClosed: boolean;
  apKode: string;
  alleMerknaderFraBeslutter: { notAccepted: boolean };
  erEosBorger?: boolean;
}

interface StaticFunctions {
  buildInitialValues: (periode, aksjonspunkter) => FormValues;
  transformValues: (values: FormValues, name?: string) => TransformedValues;
}

/**
 * StatusForBorgerFaktaPanel
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av borgerstatus (Medlemskapsvilkåret).
 */
const StatusForBorgerFaktaPanel: FunctionComponent<StatusForBorgerFaktaPanelProps & WrappedComponentProps> &
  StaticFunctions = ({ readOnly, erEosBorger, isBorgerAksjonspunktClosed, apKode, alleMerknaderFraBeslutter }) => (
  <FaktaGruppe
    titleCode="StatusForBorgerFaktaPanel.ApplicationInformation"
    merknaderFraBeslutter={alleMerknaderFraBeslutter[apKode]}
  >
    <RadioGroupField
      name="erEosBorger"
      validate={[required]}
      readOnly={readOnly}
      radios={[
        {
          value: true,
          label: <FormattedMessage id="StatusForBorgerFaktaPanel.CitizenEEA" />,
        },
        {
          value: false,
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
        <RadioGroupField
          name="oppholdsrettVurdering"
          validate={[required]}
          readOnly={readOnly}
          isEdited={isBorgerAksjonspunktClosed}
          radios={[
            {
              value: true,
              label: <FormattedMessage id="StatusForBorgerFaktaPanel.HarOppholdsrett" />,
            },
            {
              value: false,
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
        <RadioGroupField
          name="lovligOppholdVurdering"
          validate={[required]}
          readOnly={readOnly}
          isEdited={isBorgerAksjonspunktClosed}
          radios={[
            {
              value: true,
              label: <FormattedMessage id="StatusForBorgerFaktaPanel.HarLovligOpphold" />,
            },
            {
              value: false,
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

const mapStateToProps = (state, ownProps) => ({
  ...behandlingFormValueSelector(
    `OppholdInntektOgPeriodeForm-${ownProps.id}`,
    ownProps.behandlingId,
    ownProps.behandlingVersjon,
  )(state, 'erEosBorger', 'isBorgerAksjonspunktClosed', 'apKode'),
});

const getApKode = aksjonspunkter =>
  aksjonspunkter
    .map(ap => ap.definisjon)
    .filter(
      kode => kode === aksjonspunktCodes.AVKLAR_OPPHOLDSRETT || kode === aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
    )[0];

const getEosBorger = (periode, aksjonspunkter) =>
  periode.erEosBorger || periode.erEosBorger === false
    ? periode.erEosBorger
    : aksjonspunkter.some(ap => ap.definisjon === aksjonspunktCodes.AVKLAR_OPPHOLDSRETT);

const getOppholdsrettVurdering = periode =>
  periode.oppholdsrettVurdering || periode.oppholdsrettVurdering === false ? periode.oppholdsrettVurdering : undefined;

const getLovligOppholdVurdering = periode =>
  periode.lovligOppholdVurdering || periode.lovligOppholdVurdering === false
    ? periode.lovligOppholdVurdering
    : undefined;

StatusForBorgerFaktaPanel.buildInitialValues = (periode, aksjonspunkter) => {
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

StatusForBorgerFaktaPanel.transformValues = (values, aksjonspunkter) => ({
  kode: getApKode(aksjonspunkter),
  oppholdsrettVurdering: values.oppholdsrettVurdering,
  lovligOppholdVurdering: values.lovligOppholdVurdering,
  erEosBorger: values.erEosBorger,
});

export default connect(mapStateToProps)(StatusForBorgerFaktaPanel);
