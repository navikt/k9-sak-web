import {
  AksjonspunktDtoDefinisjon,
  VilkårPeriodeDtoMerknad,
  type AksjonspunktDto,
  type OpptjeningDto,
  type VilkårPeriodeDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { fagsakYtelsesType, type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Button, HelpText, Label } from '@navikt/ds-react';
import { Form } from '@navikt/ft-form-hooks';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useContext, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { FeatureToggles } from '../../../featuretoggles/FeatureToggles';
import FeatureTogglesContext from '../../../featuretoggles/FeatureTogglesContext';
import type { Aksjonspunkt } from '../types/Aksjonspunkt';
import type { SubmitCallback } from '../types/SubmitCallback';
import { type VilkårFieldFormValues } from '../types/VilkårFieldFormValues';
import OpptjeningPanel from './OpptjeningPanel';
import styles from './OpptjeningVilkarAksjonspunktPanel.module.css';
import VilkarField, { erVilkarOk, opptjeningMidlertidigInaktivKoder } from './VilkarField';
import { PencilIcon } from '@navikt/aksel-icons';

dayjs.extend(isBetween);

export const buildInitialValues = (
  vilkårPerioder: VilkårPeriodeDto[],
  opptjening: OpptjeningDto[],
  featureToggles: FeatureToggles,
): VilkårFieldFormValues => {
  const utledKode = (periode: VilkårPeriodeDto) => {
    if (
      periode.merknad === VilkårPeriodeDtoMerknad.VM_7847_A ||
      periode.merknad === VilkårPeriodeDtoMerknad.VM_7847_B
    ) {
      return periode.merknad;
    }
    return periode.vilkarStatus;
  };

  return {
    vilkarFields: Array.isArray(vilkårPerioder)
      ? vilkårPerioder.map(periode => {
          const skjæringstidspunkt = periode.periode.fom;
          const opptjeningForPeriode = opptjening?.find(
            o => dayjs(o?.fastsattOpptjening?.opptjeningTom).add(1, 'day').format('YYYY-MM-DD') === skjæringstidspunkt,
          );

          return {
            begrunnelse: periode.begrunnelse ?? '',
            vurderesIBehandlingen: !!periode.vurderesIBehandlingen,
            vurderesIAksjonspunkt: featureToggles?.['OPPTJENING_READ_ONLY_PERIODER']
              ? !!opptjeningForPeriode?.fastsattOpptjening?.vurderesIAksjonspunkt
              : true,
            kode: utledKode(periode),
          };
        })
      : [],
  };
};

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

  const [redigererOpptjening, setRedigererOpptjening] = useState(false);
  const formMethods = useForm({
    defaultValues: buildInitialValues(vilkårPerioder, opptjeninger, featureToggles),
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
  const erOpplæringspenger = fagsakType === fagsakYtelsesType.OPPLÆRINGSPENGER;
  const skalKunneEndreOpptjening = !!(
    (isApOpen || redigererOpptjening) &&
    vilkarField?.vurderesIBehandlingen &&
    vilkarField?.vurderesIAksjonspunkt
  );
  const aksjonspunktErLøst = aksjonspunkter.some(
    ap => AksjonspunktDtoDefinisjon.VURDER_OPPTJENINGSVILKÅRET === ap.definisjon && ap.status === 'UTFO',
  );

  const visRedigeringsknapp = !readOnly && aksjonspunktErLøst && !redigererOpptjening;

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
    <Form formMethods={formMethods} onSubmit={handleSubmit} className="ml-8">
      <OpptjeningPanel
        title="Opptjening"
        isAksjonspunktOpen={skalKunneEndreOpptjening}
        isDirty={formMethods.formState.isDirty}
        readOnlySubmitButton={readOnlySubmitButton || !vilkårPerioder[periodeIndex]?.vurderesIBehandlingen}
        readOnly={readOnly || !vilkårPerioder[periodeIndex]?.vurderesIBehandlingen}
        originalErVilkarOk={vilkårPerioder[periodeIndex]?.vilkarStatus === 'OPPFYLT'}
        aksjonspunktErLøst={aksjonspunktErLøst}
        lovReferanse={lovReferanse}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        isPeriodisertFormComplete={allePerioderHarVurdering()}
        skjulAksjonspunktVisning={!skalKunneEndreOpptjening}
        redigererOpptjening={redigererOpptjening}
        setRedigererOpptjening={setRedigererOpptjening}
      >
        <div className={styles.titelOgHjelpetekstFlexbox}>
          <Label size="small" as="p">
            {erOmsorgspenger && 'Opptjent rett til omsorgspenger'}
            {erPleiepenger && 'Opptjent rett til pleiepenger'}
            {erOpplæringspenger && 'Opptjent rett til opplæringspenger'}
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
            readOnly={readOnly || !skalKunneEndreOpptjening}
            fieldPrefix={`vilkarFields[${periodeIndex}]`}
            skalValgMidlertidigInaktivTypeBVises={finnesOpptjeningsaktiviteterVidOpptjeningTom}
          />
        )}
        {visRedigeringsknapp && (
          <div>
            <div className="mt-2" />
            <Button
              variant="tertiary"
              type="button"
              size="xsmall"
              icon={<PencilIcon />}
              onClick={() => {
                setRedigererOpptjening(!redigererOpptjening);
              }}
            >
              Rediger vurdering
            </Button>
          </div>
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
    innvilgelseMerknadKode: Object.values(opptjeningMidlertidigInaktivKoder).some(kode => kode === vilkarField.kode)
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
  kode: aksjonspunkter?.[0]?.definisjon ?? '',
});

export default OpptjeningVilkarAksjonspunktPanel;
