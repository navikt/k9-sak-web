import {
  AksjonspunktDtoDefinisjon,
  type AksjonspunktDto,
  type OpptjeningDto,
  type VilkårPeriodeDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { fagsakYtelsesType, type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import FeatureTogglesContext from '@k9-sak-web/gui/utils/featureToggles/FeatureTogglesContext.js';
import { HelpText, Label } from '@navikt/ds-react';
import { Form } from '@navikt/ft-form-hooks';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useContext } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import type { Aksjonspunkt } from '../types/Aksjonspunkt';
import type { SubmitCallback } from '../types/SubmitCallback';
import { type VilkårFieldFormValues } from '../types/VilkårFieldFormValues';
import OpptjeningPanel from './OpptjeningPanel';
import styles from './OpptjeningVilkarAksjonspunktPanel.module.css';
import VilkarField, {
  buildInitialValuesVilkarField,
  erVilkarOk,
  opptjeningMidlertidigInaktivKoder,
} from './VilkarField';

dayjs.extend(isBetween);

interface OpptjeningVilkarAksjonspunktPanelImplProps {
  aksjonspunkter: Aksjonspunkt[];
  behandlingId: number;
  behandlingVersjon: number;
  isApOpen: boolean;
  lovReferanse?: string;
  fagsakType?: FagsakYtelsesType;
  readOnly: boolean;
  readOnlySubmitButton: boolean;
  submitCallback: (props: SubmitCallback[]) => void;
  periodeIndex: number;
  vilkårPerioder: VilkårPeriodeDto[];
  opptjeninger: OpptjeningDto[];
}

/**
 * OpptjeningVilkarAksjonspunktPanel
 *
 * Presentasjonskomponent. Viser panel for å løse aksjonspunkt for avslått opptjeningsvilkår
 */
export const OpptjeningVilkarAksjonspunktPanel = ({
  behandlingId,
  behandlingVersjon,
  isApOpen,
  lovReferanse,
  fagsakType,
  readOnly,
  readOnlySubmitButton,
  aksjonspunkter,
  periodeIndex,
  vilkårPerioder,
  opptjeninger,
  submitCallback,
}: OpptjeningVilkarAksjonspunktPanelImplProps) => {
  const featureToggles = useContext(FeatureTogglesContext);
  const buildInitialValues = (): VilkårFieldFormValues => ({
    ...buildInitialValuesVilkarField(vilkårPerioder, opptjeninger, featureToggles),
  });

  const formMethods = useForm({
    defaultValues: buildInitialValues(),
  });

  const vilkarFields = useWatch({ control: formMethods.control, name: 'vilkarFields' });

  const handleSubmit = async (formvalues: VilkårFieldFormValues) => {
    await submitCallback([transformValues(formvalues, aksjonspunkter, vilkårPerioder, opptjeninger)]);
  };

  const vilkarField = vilkarFields?.[periodeIndex];
  const allePerioderHarVurdering = () => {
    const isAllTabsCreated = Array.isArray(vilkårPerioder) && vilkårPerioder.length === vilkarFields?.length;
    return isAllTabsCreated
      ? !vilkarFields.some(
          vilkarField =>
            vilkarField.vurderesIBehandlingen &&
            vilkarField.vurderesIAksjonspunkt &&
            (!vilkarField.begrunnelse || !vilkarField.kode),
        )
      : false;
  };

  const erOmsorgspenger =
    fagsakType === fagsakYtelsesType.OMSORGSPENGER ||
    fagsakType === fagsakYtelsesType.OMSORGSPENGER_AO ||
    fagsakType === fagsakYtelsesType.OMSORGSPENGER_KS ||
    fagsakType === fagsakYtelsesType.OMSORGSPENGER_MA;

  const erPleiepenger = fagsakType === fagsakYtelsesType.PLEIEPENGER_SYKT_BARN;

  const finnesOpptjeningsaktiviteterVidOpptjeningTom: boolean = !erPleiepenger
    ? true
    : opptjeninger?.some(opptjening => {
        const skjæringstidspunkt = dayjs(opptjening.fastsattOpptjening?.opptjeningTom)
          .add(1, 'day')
          .format('YYYY-MM-DD');

        const vurderesOpptjeningsaktivitetIBehandling = vilkårPerioder.find(
          ({ periode }) => periode.fom === skjæringstidspunkt,
        )?.vurderesIBehandlingen;

        if (!vurderesOpptjeningsaktivitetIBehandling) {
          return false;
        }

        return opptjening.opptjeningAktivitetList?.some(opptjeningAktivitet =>
          // Siste argument ("[]") til isBetween inkluderer start og sluttdato
          dayjs(skjæringstidspunkt).isBetween(
            opptjeningAktivitet.opptjeningFom,
            opptjeningAktivitet.opptjeningTom,
            null,
            '[]',
          ),
        );
      });

  return (
    <Form formMethods={formMethods} onSubmit={handleSubmit}>
      <OpptjeningPanel
        title="Opptjening"
        isAksjonspunktOpen={isApOpen && !!vilkårPerioder[periodeIndex]?.vurderesIBehandlingen}
        // handleSubmit={formProps.handleSubmit}
        isDirty={formMethods.formState.isDirty}
        readOnlySubmitButton={readOnlySubmitButton || !vilkårPerioder[periodeIndex]?.vurderesIBehandlingen}
        readOnly={readOnly || !vilkårPerioder[periodeIndex]?.vurderesIBehandlingen}
        originalErVilkarOk={vilkårPerioder[periodeIndex]?.vilkarStatus === 'OPPFYLT'}
        aksjonspunktErLøst={aksjonspunkter.some(
          ap => AksjonspunktDtoDefinisjon.VURDER_OPPTJENINGSVILKÅRET === ap.definisjon && ap.status === 'UTFO',
        )}
        lovReferanse={lovReferanse}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        isPeriodisertFormComplete={allePerioderHarVurdering()}
        skjulAksjonspunktVisning={!vilkarField?.vurderesIAksjonspunkt}
      >
        <div className={styles.titelOgHjelpetekstFlexbox}>
          <Label size="small" as="p">
            {erOmsorgspenger && 'Opptjent rett til omsorgspenger'}
            {erPleiepenger && 'Opptjent rett til pleiepenger'}
          </Label>
          <HelpText className="ml-2" placement="right-start">
            <b>Veiledning for vurdering av opptjent rett</b>
            <ul>
              <li>Sjekk Opptjening i Saksopplysninger.</li>
              <li>Kontroller opplysningene i Arbeidsforhold.</li>
              <li>
                Er det perioder uten arbeidsforhold eller med permisjon/permittering i noen av arbeidsforholdene som
                varer lengre en 14 dager?
              </li>
              <li>Sjekk opplysningene i A-inntekt</li>
              <li>
                Vurder om det kan være mangelfull registrering fra arbeidsgiver i Aa-registret. Hvis så, ta kontakt med
                arbeidsgiver for korrigering.
              </li>
              <li>
                Skal ytelse være en del av opptjeningen? Husk at perioder med ytelse før skjæringstidspunktet må være
                utbetalt før det blir med i opptjening.
              </li>
            </ul>
            <b>Vurder om bruker oppfyller opptjeningsvilkåret jf. § 9-2</b>
            <div>
              Hvis § 9-2 ikke er oppfylt. Vurder om § 8-47 bokstav A eller § 8-47 bokstav B er oppfylt. Bruker må ha
              aktivt arbeidsforhold på skjæringstidspunktet for at bokstav B kan være oppfylt.
            </div>
          </HelpText>
        </div>
        {vilkarField && (
          <VilkarField
            erOmsorgspenger={erOmsorgspenger}
            field={vilkarField}
            readOnly={readOnly || !vilkarField?.vurderesIBehandlingen || !vilkarField?.vurderesIAksjonspunkt}
            fieldPrefix={`vilkarFields[${periodeIndex}]`}
            skalValgMidlertidigInaktivTypeBVises={finnesOpptjeningsaktiviteterVidOpptjeningTom}
          />
        )}
      </OpptjeningPanel>
    </Form>
  );
};

const transformValues = (
  values: VilkårFieldFormValues,
  aksjonspunkter: AksjonspunktDto[],
  vilkårPerioder: VilkårPeriodeDto[],
  opptjeninger: OpptjeningDto[],
) => ({
  vilkårPeriodeVurderinger: values.vilkarFields.map((vilkarField, index) => ({
    ...vilkarField,
    erVilkarOk: erVilkarOk(vilkarField.kode),
    innvilgelseMerknadKode: Object.values(opptjeningMidlertidigInaktivKoder).includes(vilkarField.kode)
      ? vilkarField.kode
      : undefined,
    periode: Array.isArray(vilkårPerioder) && vilkårPerioder[index] ? vilkårPerioder[index].periode : {},
  })),
  opptjeningPerioder: Array.isArray(opptjeninger)
    ? opptjeninger.map(opptjening => ({
        fom: opptjening.fastsattOpptjening?.opptjeningFom,
        tom: opptjening.fastsattOpptjening?.opptjeningTom,
      }))
    : [],
  ...{ kode: (Array.isArray(aksjonspunkter) && aksjonspunkter.length ? aksjonspunkter[0]?.definisjon : '') || '' },
});

export default OpptjeningVilkarAksjonspunktPanel;
