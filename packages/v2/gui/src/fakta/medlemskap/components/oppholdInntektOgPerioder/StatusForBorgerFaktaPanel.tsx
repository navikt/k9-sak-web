import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import ArrowBox from '@k9-sak-web/gui/shared/arrowBox/ArrowBox.js';
import FaktaGruppe from '@k9-sak-web/gui/shared/FaktaGruppe.js';
import { isAksjonspunktOpen } from '@k9-sak-web/gui/utils/aksjonspunktUtils.js';
import { Box, Detail, HStack, Radio } from '@navikt/ds-react';
import { RhfRadioGroup } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { type FunctionComponent } from 'react';
import { useFormContext } from 'react-hook-form';
import type { Aksjonspunkt } from '../../types/Aksjonspunkt';
import type { OppholdInntektOgPerioderFormState } from '../../types/FormState';
import type { MerknaderFraBeslutter } from '../../types/MerknaderFraBeslutter';
import type { Periode } from '../../types/Periode';

interface StatusForBorgerFaktaPanelProps {
  readOnly: boolean;
  alleMerknaderFraBeslutter: MerknaderFraBeslutter;
}

/**
 * StatusForBorgerFaktaPanel
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av borgerstatus (Medlemskapsvilkåret).
 */
const StatusForBorgerFaktaPanel: FunctionComponent<StatusForBorgerFaktaPanelProps> = ({
  readOnly,
  alleMerknaderFraBeslutter,
}) => {
  const { getValues, control } = useFormContext<OppholdInntektOgPerioderFormState>();
  const {
    oppholdInntektOgPeriodeForm: { erEosBorger, isBorgerAksjonspunktClosed, apKode },
  } = getValues();
  return (
    <FaktaGruppe merknaderFraBeslutter={apKode ? alleMerknaderFraBeslutter[apKode] : undefined}>
      <RhfRadioGroup
        control={control}
        name="oppholdInntektOgPeriodeForm.erEosBorger"
        validate={[required]}
        isReadOnly={readOnly}
      >
        <HStack gap="space-16">
          <Radio value={true}>EØS borger</Radio>
          <Radio value={false}>Utenlandsk borger utenfor EØS</Radio>
        </HStack>
      </RhfRadioGroup>

      {erEosBorger && (
        <ArrowBox>
          <Detail>Oppholdsrett</Detail>
          <Box.New marginBlock="1 0">
            <RhfRadioGroup
              control={control}
              name="oppholdInntektOgPeriodeForm.oppholdsrettVurdering"
              validate={[required]}
              isReadOnly={readOnly}
              isEdited={isBorgerAksjonspunktClosed}
            >
              <Radio value={true}>Søker har oppholdsrett</Radio>
              <Radio value={false}>
                Søker har <b>ikke</b> oppholdsrett
              </Radio>
            </RhfRadioGroup>
          </Box.New>
        </ArrowBox>
      )}
      {erEosBorger === false && (
        <ArrowBox alignOffset={117}>
          <Detail>Lovlig opphold</Detail>
          <Box.New marginBlock="1 0">
            <RhfRadioGroup
              control={control}
              name="oppholdInntektOgPeriodeForm.lovligOppholdVurdering"
              validate={[required]}
              isReadOnly={readOnly}
              isEdited={isBorgerAksjonspunktClosed}
            >
              <Radio value={true}>Søker har lovlig opphold</Radio>
              <Radio value={false}>
                Søker har <b>ikke</b> lovlig opphold
              </Radio>
            </RhfRadioGroup>
          </Box.New>
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

export const buildInitialValuesStatusForBorgerFaktaPanel = (periode: Periode, aksjonspunkter: Aksjonspunkt[]) => {
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
    apKode: getApKode(aksjonspunkter) ?? '',
  };
};

export default StatusForBorgerFaktaPanel;
