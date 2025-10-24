import {
  ung_kodeverk_behandling_FagsakYtelseType,
  type ung_sak_kontrakt_fagsak_FagsakDto,
  type ung_sak_kontrakt_klage_KlageHjemmelDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import ArrowBox from '@k9-sak-web/gui/shared/arrowBox/ArrowBox.js';
import ContentMaxWidth from '@k9-sak-web/gui/shared/ContentMaxWidth/ContentMaxWidth.js';
import type { KodeverkMedUndertype, KodeverkV2 } from '@k9-sak-web/lib/kodeverk/types.js';
import { Box, Radio, UNSAFE_Combobox } from '@navikt/ds-react';
import { RhfRadioGroup, RhfSelect } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { Controller, useFormContext } from 'react-hook-form';
import { klageVurderingOmgjoerType, klageVurderingType } from '../KlageVurderingType';
import type { BehandleKlageFormNfpFormValues } from './BehandleKlageFormNfpFormValues';

export const TILBAKEKREVING_HJEMMEL = '22-15';

const utledHjemler = (
  fagsak: ung_sak_kontrakt_fagsak_FagsakDto,
  ungHjemler: ung_sak_kontrakt_klage_KlageHjemmelDto[],
): {
  kode: string;
  navn: string;
}[] => {
  switch (fagsak.sakstype) {
    case ung_kodeverk_behandling_FagsakYtelseType.PLEIEPENGER_SYKT_BARN:
      return [
        { kode: '9-2', navn: '§ 9-2' },
        { kode: '9-3', navn: '§ 9-3' },
        { kode: '9-10', navn: '§ 9-10' },
        { kode: '9-11', navn: '§ 9-11' },
        { kode: '9-15', navn: '§ 9-15' },
        { kode: '9-16', navn: '§ 9-16' },
        { kode: '22-13', navn: '§ 22-13' },
      ];

    case ung_kodeverk_behandling_FagsakYtelseType.OMSORGSPENGER:
    case ung_kodeverk_behandling_FagsakYtelseType.OMSORGSPENGER_KS:
    case ung_kodeverk_behandling_FagsakYtelseType.OMSORGSPENGER_MA:
    case ung_kodeverk_behandling_FagsakYtelseType.OMSORGSPENGER_AO:
      return [
        { kode: '9-2', navn: '§ 9-2' },
        { kode: '9-3', navn: '§ 9-3' },
        { kode: '9-5', navn: '§ 9-5' },
        { kode: '9-6', navn: '§ 9-6' },
        { kode: '9-8', navn: '§ 9-8' },
        { kode: '9-9', navn: '§ 9-9' },
        { kode: '22-13', navn: '§ 22-13' },
      ];

    case ung_kodeverk_behandling_FagsakYtelseType.PLEIEPENGER_NÆRSTÅENDE:
      return [
        { kode: '9-2', navn: '§ 9-2' },
        { kode: '9-3', navn: '§ 9-3' },
        { kode: '9-13', navn: '§ 9-13' },
        { kode: '22-13', navn: '§ 22-13' },
      ];
    case ung_kodeverk_behandling_FagsakYtelseType.UNGDOMSYTELSE:
      return ungHjemler
        .filter(hjemmel => hjemmel.kode !== undefined && hjemmel.navn !== undefined)
        .map(hjemmel => ({ kode: hjemmel.kode!, navn: hjemmel.navn! }));

    default:
      return [];
  }
};

interface KlageVurderingRadioOptionsNfpProps {
  fagsak: ung_sak_kontrakt_fagsak_FagsakDto;
  readOnly: boolean;
  medholdReasons: KodeverkV2[] | KodeverkMedUndertype;
  klageVurdering: string | null;
  erPåklagdBehandlingTilbakekreving: boolean;
  ungHjemler: ung_sak_kontrakt_klage_KlageHjemmelDto[];
}

export const KlageVurderingRadioOptionsNfp = ({
  fagsak,
  readOnly = true,
  medholdReasons,
  klageVurdering = null,
  erPåklagdBehandlingTilbakekreving,
  ungHjemler,
}: KlageVurderingRadioOptionsNfpProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<BehandleKlageFormNfpFormValues>();
  const hjemler = utledHjemler(fagsak, ungHjemler);

  const skalViseHjemler =
    fagsak.sakstype !== ung_kodeverk_behandling_FagsakYtelseType.FRISINN &&
    klageVurdering === klageVurderingType.STADFESTE_YTELSESVEDTAK &&
    hjemler.length > 0;

  const medholdOptions = Array.isArray(medholdReasons)
    ? medholdReasons
        .filter(mo => typeof mo === 'object' && 'kode' in mo)
        .map(mo => (
          <option key={mo.kode} value={mo.kode}>
            {mo.navn}
          </option>
        ))
    : [];

  return (
    <div>
      <ContentMaxWidth>
        <RhfRadioGroup control={control} name="klageVurdering" validate={[required]} isReadOnly={readOnly}>
          <Radio value={klageVurderingType.MEDHOLD_I_KLAGE}>Omgjør vedtaket</Radio>
          <Radio value={klageVurderingType.STADFESTE_YTELSESVEDTAK}>Oppretthold vedtaket</Radio>
        </RhfRadioGroup>
      </ContentMaxWidth>
      {klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE && (
        <ContentMaxWidth>
          <ArrowBox>
            <RhfSelect
              control={control}
              readOnly={readOnly}
              name="klageMedholdArsak"
              selectValues={medholdOptions}
              label="Årsak"
              validate={[required]}
            />
            <Box.New marginBlock="space-16 0">
              <RhfRadioGroup control={control} name="klageVurderingOmgjoer" validate={[required]} isReadOnly={readOnly}>
                <Radio value={klageVurderingOmgjoerType.GUNST_MEDHOLD_I_KLAGE}>Til gunst</Radio>
                <Radio value={klageVurderingOmgjoerType.UGUNST_MEDHOLD_I_KLAGE}>Til ugunst</Radio>
                <Radio value={klageVurderingOmgjoerType.DELVIS_MEDHOLD_I_KLAGE}>Delvis omgjør, til gunst</Radio>
              </RhfRadioGroup>
            </Box.New>
          </ArrowBox>
        </ContentMaxWidth>
      )}
      {skalViseHjemler && !erPåklagdBehandlingTilbakekreving && (
        <ContentMaxWidth>
          <ArrowBox>
            <Controller
              name="klageHjemmel"
              control={control}
              rules={{ required: 'Feltet må fylles ut' }}
              render={({ field }) => (
                <UNSAFE_Combobox
                  label="Hjemmel"
                  options={hjemler.map(hjemmel => ({ value: hjemmel.kode, label: hjemmel.navn }))}
                  readOnly={readOnly}
                  error={errors.klageHjemmel?.message}
                  ref={field.ref}
                  name={field.name}
                  onBlur={field.onBlur}
                  onToggleSelected={option => {
                    field.onChange(option);
                  }}
                />
              )}
            />
          </ArrowBox>
        </ContentMaxWidth>
      )}
    </div>
  );
};
