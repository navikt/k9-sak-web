import { Label } from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import {
  DateLabel,
  FaktaGruppe,
  FlexColumn,
  FlexContainer,
  FlexRow,
  PeriodLabel,
  VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { Aksjonspunkt, Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import { BodyShort, Table, VStack } from '@navikt/ds-react';
import { RadioGroupPanel } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import moment from 'moment';
import { FunctionComponent, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { OppholdInntektOgPerioderFormState, PerioderMedMedlemskapFaktaPanelFormState } from './FormState';
import { MedlemskapPeriode } from './Medlemskap';
import { MerknaderFraBeslutter } from './MerknaderFraBeslutter';
import { Periode } from './Periode';
import { Soknad } from './Soknad';

const headerTextCodes = ['Periode', 'Dekning', 'Status', 'Beslutningsdato'];

export const getAksjonspunkter = (alleKodeverk: { [key: string]: KodeverkMedNavn[] }) => {
  const vurderingTypes = alleKodeverk[kodeverkTyper.MEDLEMSKAP_MANUELL_VURDERING_TYPE];
  return vurderingTypes.sort((a, b) => {
    const kodeA = a.kode;
    const kodeB = b.kode;
    if (kodeA < kodeB) {
      return -1;
    }
    if (kodeA > kodeB) {
      return 1;
    }

    return 0;
  });
};

interface PerioderMedMedlemskapFaktaPanelProps {
  readOnly: boolean;
  fodselsdato?: string;
  alleMerknaderFraBeslutter?: MerknaderFraBeslutter;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

interface StaticFunctions {
  buildInitialValues: (
    medlemskapPerioder: MedlemskapPeriode[],
    soknad: Soknad,
    aksjonspunkter: Aksjonspunkt[],
    getKodeverknavn: (kode: Kodeverk) => string,
    periode?: Periode,
  ) => PerioderMedMedlemskapFaktaPanelFormState;
}

/**
 * PerioderMedMedlemskapFaktaPanel
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av perioder (Medlemskapsvilkåret).
 */
export const PerioderMedMedlemskapFaktaPanel: FunctionComponent<PerioderMedMedlemskapFaktaPanelProps> &
  StaticFunctions = ({ readOnly, fodselsdato, alleMerknaderFraBeslutter, alleKodeverk }) => {
  const { getValues } = useFormContext<OppholdInntektOgPerioderFormState>();
  const {
    oppholdInntektOgPeriodeForm: { fixedMedlemskapPerioder, hasPeriodeAksjonspunkt, isPeriodAksjonspunktClosed },
  } = getValues();
  const vurderingTypes = useMemo(() => getAksjonspunkter(alleKodeverk), [alleKodeverk]);
  if (!fixedMedlemskapPerioder || fixedMedlemskapPerioder.length === 0) {
    return (
      <FaktaGruppe titleCode="Perioder med medlemskap" useIntl={false}>
        <BodyShort size="small">Ingen registrerte opplysninger om medlemskap</BodyShort>
      </FaktaGruppe>
    );
  }

  return (
    <FaktaGruppe
      titleCode="Perioder med medlemskap"
      merknaderFraBeslutter={alleMerknaderFraBeslutter[aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE]}
      useIntl={false}
    >
      <VStack gap="4">
        <Table>
          <Table.Header>
            <Table.Row>
              {headerTextCodes.map(text => (
                <Table.HeaderCell scope="col" key={text}>
                  {text}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {fixedMedlemskapPerioder.map(periode => {
              const key = periode.fom + periode.tom + periode.dekning + periode.status + periode.beslutningsdato;
              return (
                <Table.Row key={key} id={key}>
                  <Table.DataCell>
                    <PeriodLabel showTodayString dateStringFom={periode.fom} dateStringTom={periode.tom} />
                  </Table.DataCell>
                  <Table.DataCell>{periode.dekning}</Table.DataCell>
                  <Table.DataCell>{periode.status}</Table.DataCell>
                  <Table.DataCell>
                    {periode.beslutningsdato ? <DateLabel dateString={periode.beslutningsdato} /> : null}
                  </Table.DataCell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <FlexContainer>
          {hasPeriodeAksjonspunkt && (
            <FlexRow>
              <FlexColumn>
                <RadioGroupPanel
                  name="oppholdInntektOgPeriodeForm.medlemskapManuellVurderingType.kode"
                  validate={[required]}
                  isReadOnly={readOnly}
                  isEdited={isPeriodAksjonspunktClosed}
                  radios={vurderingTypes.map(type => ({
                    value: type.kode,
                    label: <Label input={type.navn} textOnly />,
                  }))}
                  isHorizontal
                />
              </FlexColumn>
            </FlexRow>
          )}
          <VerticalSpacer sixteenPx />
          <FlexRow className="justifyItemsToFlexEnd">
            <FlexColumn>{fodselsdato && `Fødselsdato: ${moment(fodselsdato).format(DDMMYYYY_DATE_FORMAT)}`}</FlexColumn>
          </FlexRow>
        </FlexContainer>
      </VStack>
    </FaktaGruppe>
  );
};

PerioderMedMedlemskapFaktaPanel.buildInitialValues = (
  medlemskapPerioder: MedlemskapPeriode[],
  soknad: Soknad,
  aksjonspunkter: Aksjonspunkt[],
  getKodeverknavn: (kode: Kodeverk) => string,
  periode?: Periode,
) => {
  const fixedMedlemskapPerioder = medlemskapPerioder
    ?.map(i => ({
      fom: i.fom,
      tom: i.tom,
      dekning: i.dekningType ? getKodeverknavn(i.dekningType) : '',
      status: getKodeverknavn(i.medlemskapType),
      beslutningsdato: i.beslutningsdato,
    }))
    .sort((p1, p2) => new Date(p1.fom).getTime() - new Date(p2.fom).getTime());
  const filteredAp = aksjonspunkter.filter(
    ap =>
      periode?.aksjonspunkter.includes(ap.definisjon.kode) ||
      (periode?.aksjonspunkter.includes(aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE) &&
        ap.definisjon.kode === aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP),
  );

  return {
    fixedMedlemskapPerioder,
    medlemskapManuellVurderingType: periode?.medlemskapManuellVurderingType,
    fodselsdato: soknad && soknad.fodselsdatoer ? Object.values(soknad.fodselsdatoer)[0] : undefined,
    hasPeriodeAksjonspunkt: filteredAp.length > 0,
    isPeriodAksjonspunktClosed: filteredAp.some(ap => !isAksjonspunktOpen(ap.status.kode)),
  };
};

export default PerioderMedMedlemskapFaktaPanel;
