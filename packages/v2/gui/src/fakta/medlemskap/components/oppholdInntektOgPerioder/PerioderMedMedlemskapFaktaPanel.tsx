import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { KodeverkType, type KodeverkObject } from '@k9-sak-web/lib/kodeverk/types.js';
import { BodyShort, Box, HStack, Table, VStack } from '@navikt/ds-react';
import { RadioGroupPanel } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { type FunctionComponent } from 'react';
import { useFormContext } from 'react-hook-form';
import { useKodeverkContext } from '../../../../kodeverk';
import DateLabel from '../../../../shared/dateLabel/DateLabel';
import FaktaGruppe from '../../../../shared/FaktaGruppe';
import PeriodLabel from '../../../../shared/periodLabel/PeriodLabel';
import { isAksjonspunktOpen } from '../../../../utils/aksjonspunktUtils';
import { formatDateStringToDDMMYYYY } from '../../../../utils/dateutils';
import type { Aksjonspunkt } from '../../types/Aksjonspunkt';
import type { OppholdInntektOgPerioderFormState } from '../../types/FormState';
import type { MedlemskapPeriode } from '../../types/Medlemskap';
import type { MerknaderFraBeslutter } from '../../types/MerknaderFraBeslutter';
import type { Periode } from '../../types/Periode';
import type { Soknad } from '../../types/Soknad';

const headerTextCodes = ['Periode', 'Dekning', 'Status', 'Beslutningsdato'];

export const getAksjonspunkter = (kodeverkVurderingTypes: KodeverkObject[]) => {
  return kodeverkVurderingTypes.sort((a, b) => {
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
  alleMerknaderFraBeslutter: MerknaderFraBeslutter;
}

/**
 * PerioderMedMedlemskapFaktaPanel
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av perioder (Medlemskapsvilkåret).
 */
export const PerioderMedMedlemskapFaktaPanel: FunctionComponent<PerioderMedMedlemskapFaktaPanelProps> = ({
  readOnly,
  fodselsdato,
  alleMerknaderFraBeslutter,
}) => {
  const { kodeverkNavnFraKode, hentKodeverkForKode } = useKodeverkContext();
  const { getValues } = useFormContext<OppholdInntektOgPerioderFormState>();
  const kodeverkVurderingTypes: KodeverkObject[] = hentKodeverkForKode(
    KodeverkType.MEDLEMSKAP_MANUELL_VURDERING_TYPE,
  ) as KodeverkObject[];
  const {
    oppholdInntektOgPeriodeForm: { fixedMedlemskapPerioder, hasPeriodeAksjonspunkt, isPeriodAksjonspunktClosed },
  } = getValues();
  const vurderingTypes = getAksjonspunkter(kodeverkVurderingTypes);
  if (!fixedMedlemskapPerioder || fixedMedlemskapPerioder.length === 0) {
    return (
      <FaktaGruppe title="Perioder med medlemskap">
        <BodyShort size="small">Ingen registrerte opplysninger om medlemskap</BodyShort>
      </FaktaGruppe>
    );
  }

  return (
    <FaktaGruppe
      title="Perioder med medlemskap"
      merknaderFraBeslutter={alleMerknaderFraBeslutter[aksjonspunktCodes.AVKLAR_GYLDIG_MEDLEMSKAPSPERIODE]}
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
                  <Table.DataCell>
                    {kodeverkNavnFraKode(periode.dekning, KodeverkType.MEDLEMSKAP_DEKNING)}
                  </Table.DataCell>
                  <Table.DataCell>{kodeverkNavnFraKode(periode.status, KodeverkType.MEDLEMSKAP_TYPE)}</Table.DataCell>
                  <Table.DataCell>
                    {periode.beslutningsdato ? <DateLabel dateString={periode.beslutningsdato} /> : null}
                  </Table.DataCell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <VStack gap="4">
          {hasPeriodeAksjonspunkt && (
            <RadioGroupPanel
              name="oppholdInntektOgPeriodeForm.medlemskapManuellVurderingType.kode"
              validate={[required]}
              isReadOnly={readOnly}
              isEdited={isPeriodAksjonspunktClosed}
              radios={vurderingTypes.map(type => ({
                value: type.kode,
                label: type.navn,
              }))}
              isHorizontal
            />
          )}
          <Box marginBlock="4 0">
            <HStack justify="end">{fodselsdato && `Fødselsdato: ${formatDateStringToDDMMYYYY(fodselsdato)}`}</HStack>
          </Box>
        </VStack>
      </VStack>
    </FaktaGruppe>
  );
};

export const buildInitialValuesPerioderMedMedlemskapFaktaPanel = (
  medlemskapPerioder: MedlemskapPeriode[],
  soknad: Soknad,
  aksjonspunkter: Aksjonspunkt[],
  periode?: Periode,
) => {
  const fixedMedlemskapPerioder = medlemskapPerioder
    ?.map(i => ({
      fom: i.fom,
      tom: i.tom,
      dekning: i.dekningType ? i.dekningType : '',
      status: i.medlemskapType,
      beslutningsdato: i.beslutningsdato,
    }))
    .sort((p1, p2) => new Date(p1.fom).getTime() - new Date(p2.fom).getTime());
  const filteredAp = aksjonspunkter.filter(
    ap =>
      periode?.aksjonspunkter.includes(ap.definisjon) ||
      (periode?.aksjonspunkter.includes(aksjonspunktCodes.AVKLAR_GYLDIG_MEDLEMSKAPSPERIODE) &&
        ap.definisjon === aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP),
  );

  return {
    fixedMedlemskapPerioder,
    medlemskapManuellVurderingType: periode?.medlemskapManuellVurderingType ?? '',
    fodselsdato: soknad && soknad.fodselsdatoer ? Object.values(soknad.fodselsdatoer)[0] : undefined,
    hasPeriodeAksjonspunkt: filteredAp.length > 0,
    isPeriodAksjonspunktClosed: filteredAp.some(ap => !isAksjonspunktOpen(ap.status)),
  };
};

export default PerioderMedMedlemskapFaktaPanel;
