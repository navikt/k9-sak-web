import type {
  k9_klage_kontrakt_behandling_BehandlingDto,
  k9_klage_kontrakt_behandling_part_PartDto,
  k9_klage_kontrakt_klage_KlageFormkravResultatDto,
} from '@k9-sak-web/backend/k9klage/generated/types.js';
import type {
  ung_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto,
  ung_sak_kontrakt_fagsak_FagsakDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import AksjonspunktHelpText from '@k9-sak-web/gui/shared/aksjonspunktHelpText/AksjonspunktHelpText.js';
import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { KodeverkType, type KodeverkNavnFraKodeType } from '@k9-sak-web/lib/kodeverk/types.js';
import AksjonspunktCodes from '@k9-sak-web/lib/kodeverk/types/AksjonspunktCodes.js';
import { BoxNew, Button, Detail, HGrid, HStack, Heading, Radio, VStack } from '@navikt/ds-react';
import { RhfRadioGroup, RhfSelect, RhfTextarea } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';
import { useFormContext } from 'react-hook-form';
import lagVisningsnavnForKlagepart from '../utils/lagVisningsnavnForKlagepart';
import styles from './formkravKlageForm.module.css';
import type { FormValuesNfp } from './FormValuesNfp';

export const IKKE_PAKLAGD_VEDTAK = 'ikkePaklagdVedtak';

export const getPaklagdVedtak = (
  klageFormkravResultat: k9_klage_kontrakt_klage_KlageFormkravResultatDto,
  avsluttedeBehandlinger: k9_klage_kontrakt_behandling_BehandlingDto[],
) => {
  const behandlingid =
    Array.isArray(avsluttedeBehandlinger) &&
    avsluttedeBehandlinger.find(b => b.uuid === klageFormkravResultat.påklagdBehandlingRef)?.uuid;
  return behandlingid ? `${behandlingid}` : IKKE_PAKLAGD_VEDTAK;
};

const getKlagbareVedtak = (
  avsluttedeBehandlinger: k9_klage_kontrakt_behandling_BehandlingDto[],
  kodeverkNavnFraKode: KodeverkNavnFraKodeType,
) => {
  const klagBareVedtak = [
    <option key="formkrav" value={IKKE_PAKLAGD_VEDTAK}>
      Ikke påklagd et vedtak
    </option>,
  ];
  return klagBareVedtak.concat(
    avsluttedeBehandlinger.map(behandling => (
      <option key={behandling.uuid} value={`${behandling.uuid}`}>
        {`${kodeverkNavnFraKode(behandling.type, KodeverkType.BEHANDLING_TYPE)} ${behandling.avsluttet ? initializeDate(behandling.avsluttet).format(DDMMYYYY_DATE_FORMAT) : ''}`}
      </option>
    )),
  );
};

const getLovHjemmeler = (aksjonspunktCode: string) =>
  aksjonspunktCode === AksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP
    ? 'Fvl §§ 28, 31, 32, 33 og ftrl § 21-12'
    : 'Fvl §§  28, 31, 32, 34 og ftrl § 21-12';

interface OwnProps {
  readOnly: boolean;
  readOnlySubmitButton: boolean;
  fagsakPerson: ung_sak_kontrakt_fagsak_FagsakDto['person'];
  arbeidsgiverOpplysningerPerId: ung_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto['arbeidsgivere'];
  avsluttedeBehandlinger: k9_klage_kontrakt_behandling_BehandlingDto[];
  parterMedKlagerett?: k9_klage_kontrakt_behandling_part_PartDto[];
  aksjonspunktCode: string;
  skalKunneVelgeKlagepart: boolean;
  isSubmitting: boolean;
}

/**
 * FormkravKlageForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for formkrav klage (NFP og KA).
 */
export const FormkravKlageForm = ({
  readOnly = true,
  readOnlySubmitButton = true,
  aksjonspunktCode,
  avsluttedeBehandlinger,
  fagsakPerson,
  arbeidsgiverOpplysningerPerId,
  parterMedKlagerett,
  skalKunneVelgeKlagepart = true,
  isSubmitting,
}: OwnProps) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();
  const { control } = useFormContext<FormValuesNfp>();
  const klagbareVedtakOptions = getKlagbareVedtak(avsluttedeBehandlinger, kodeverkNavnFraKode);

  return (
    <div>
      <VStack gap="space-4">
        <Heading size="small" level="2">
          Vurder formkrav
        </Heading>

        <Detail>{getLovHjemmeler(aksjonspunktCode)}</Detail>
        <AksjonspunktHelpText isAksjonspunktOpen={!readOnlySubmitButton}>
          {['Vurder om klagen oppfyller formkravene']}
        </AksjonspunktHelpText>
      </VStack>
      <HGrid gap="space-4" columns={2} marginBlock="space-16 0">
        <BoxNew maxWidth="70%">
          {parterMedKlagerett?.length ? (
            <BoxNew marginBlock="0 space-16">
              <RhfSelect
                control={control}
                readOnly={readOnly || !skalKunneVelgeKlagepart}
                name="valgtPartMedKlagerett"
                selectValues={parterMedKlagerett.map(part => (
                  <option value={JSON.stringify(part)} key={part.identifikasjon?.id}>
                    {part.identifikasjon?.id &&
                      lagVisningsnavnForKlagepart(part.identifikasjon?.id, fagsakPerson, arbeidsgiverOpplysningerPerId)}
                  </option>
                ))}
                label={skalKunneVelgeKlagepart ? 'Velg klagepart' : 'Klagepart'}
                validate={[required]}
              />
            </BoxNew>
          ) : null}
          <RhfTextarea
            control={control}
            label="Vurdering"
            readOnly={readOnly}
            name="begrunnelse"
            validate={[required, maxLength(1500), minLength(3)]}
            maxLength={1500}
          />
        </BoxNew>
        <div>
          <RhfSelect
            control={control}
            readOnly={readOnly}
            validate={[required]}
            name="vedtak"
            label="Vedtaket som er påklagd"
            selectValues={klagbareVedtakOptions}
          />
          <HGrid gap="space-4" columns={{ xs: '4fr 8fr' }} marginBlock="space-16 0">
            <div>
              <RhfRadioGroup
                control={control}
                label="Er klager part i saken?"
                name="erKlagerPart"
                validate={[required]}
                isReadOnly={readOnly}
              >
                <HStack gap="space-16">
                  <Radio value={true}>Ja</Radio>
                  <Radio value={false}>Nei</Radio>
                </HStack>
              </RhfRadioGroup>
            </div>
            <div>
              <RhfRadioGroup
                label="Klages det på konkrete elementer i vedtaket?"
                control={control}
                name="erKonkret"
                validate={[required]}
                isReadOnly={readOnly}
              >
                <HStack gap="space-16">
                  <Radio value={true}>Ja</Radio>
                  <Radio value={false}>Nei</Radio>
                </HStack>
              </RhfRadioGroup>
            </div>
          </HGrid>
          <HGrid gap="space-4" columns={{ xs: '4fr 8fr' }} marginBlock="space-16 0">
            <div>
              <RhfRadioGroup
                label="Er klagefristen overholdt?"
                control={control}
                name="erFristOverholdt"
                validate={[required]}
                isReadOnly={readOnly}
              >
                <HStack gap="space-16">
                  <Radio value={true}>Ja</Radio>
                  <Radio value={false}>Nei</Radio>
                </HStack>
              </RhfRadioGroup>
            </div>
            <div>
              <RhfRadioGroup
                label="Er klagen signert?"
                control={control}
                name="erSignert"
                validate={[required]}
                isReadOnly={readOnly}
              >
                <HStack gap="space-16">
                  <Radio value={true}>Ja</Radio>
                  <Radio value={false}>Nei</Radio>
                </HStack>
              </RhfRadioGroup>
            </div>
          </HGrid>
        </div>
      </HGrid>
      <BoxNew marginBlock="space-16 0" className={styles.confirmVilkarForm}>
        {!readOnly && (
          <Button variant="primary" size="small" type="submit" loading={isSubmitting}>
            Bekreft og fortsett
          </Button>
        )}
      </BoxNew>
    </div>
  );
};
