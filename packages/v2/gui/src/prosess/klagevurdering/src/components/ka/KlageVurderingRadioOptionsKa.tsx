import { Box, HGrid, Radio } from '@navikt/ds-react';

import ArrowBox from '@k9-sak-web/gui/shared/arrowBox/ArrowBox.js';
import type { KodeverkMedUndertype, KodeverkV2 } from '@k9-sak-web/lib/kodeverk/types.js';
import { RhfRadioGroup, RhfSelect, RhfTextarea } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, minLength, required } from '@navikt/ft-form-validators';
import { useFormContext } from 'react-hook-form';
import { klageVurderingOmgjoerType, klageVurderingType } from '../KlageVurderingType';
import { type BehandleKlageFormKaFormValues } from './BehandleKlageFormKaFormValues';

interface KlageVurderingRadioOptionsKaProps {
  readOnly: boolean;
  medholdReasons: KodeverkV2[] | KodeverkMedUndertype;
  klageVurdering: string | null;
}

export const KlageVurderingRadioOptionsKa = ({
  readOnly = true,
  medholdReasons,
  klageVurdering,
}: KlageVurderingRadioOptionsKaProps) => {
  const { control } = useFormContext<BehandleKlageFormKaFormValues>();
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
      <RhfTextarea
        control={control}
        name="begrunnelse"
        label="Vurdering"
        validate={[required, minLength(3), maxLength(100000), hasValidText]}
        maxLength={100000}
        readOnly={readOnly}
        placeholder="Begrunn vurderingen din"
      />
      <Box.New marginBlock="space-16 0">
        <HGrid gap="space-4" columns={{ xs: '4fr 4fr 4fr' }}>
          <RhfRadioGroup control={control} name="klageVurdering" validate={[required]} isReadOnly={readOnly}>
            <Radio value={klageVurderingType.STADFESTE_YTELSESVEDTAK}>Stadfest vedtaket</Radio>
            <Radio value={klageVurderingType.MEDHOLD_I_KLAGE}>Omgjør vedtaket</Radio>
            <Radio value={klageVurderingType.HJEMSENDE_UTEN_Å_OPPHEVE}>Hjemsend vedtaket</Radio>
            <Radio value={klageVurderingType.OPPHEVE_YTELSESVEDTAK}>Opphev og hjemsend vedtaket</Radio>
          </RhfRadioGroup>
        </HGrid>
      </Box.New>
      {klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE && (
        <ArrowBox>
          <RhfSelect
            control={control}
            readOnly={readOnly}
            name="klageMedholdArsak"
            selectValues={medholdOptions}
            label="Årsak"
            validate={[required]}
          />
          <Box.New marginBlock="space-6 0">
            <RhfRadioGroup control={control} name="klageVurderingOmgjoer" validate={[required]} isReadOnly={readOnly}>
              <Radio value={klageVurderingOmgjoerType.GUNST_MEDHOLD_I_KLAGE}>Til gunst</Radio>
              <Radio value={klageVurderingOmgjoerType.UGUNST_MEDHOLD_I_KLAGE}>Til ugunst</Radio>
              <Radio value={klageVurderingOmgjoerType.DELVIS_MEDHOLD_I_KLAGE}>Delvis omgjør, til gunst</Radio>
            </RhfRadioGroup>
          </Box.New>
        </ArrowBox>
      )}
      {klageVurdering === klageVurderingType.OPPHEVE_YTELSESVEDTAK && (
        <ArrowBox marginLeft={380}>
          <RhfSelect
            control={control}
            readOnly={readOnly}
            name="klageMedholdArsak"
            selectValues={medholdOptions}
            label="Årsak"
            validate={[required]}
          />
        </ArrowBox>
      )}
    </div>
  );
};
