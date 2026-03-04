import { Box, HGrid, Radio } from '@navikt/ds-react';

import { KlagevurderingOmgjør } from '@k9-sak-web/backend/k9klage/kodeverk/KlagevurderingOmgjør.js';
import { KlageVurdering } from '@k9-sak-web/backend/k9klage/kodeverk/vedtak/KlageVurdering.js';
import ArrowBox from '@k9-sak-web/gui/shared/arrowBox/ArrowBox.js';
import ContentMaxWidth from '@k9-sak-web/gui/shared/ContentMaxWidth/ContentMaxWidth.js';
import type { KodeverkMedUndertype, KodeverkV2 } from '@k9-sak-web/lib/kodeverk/types.js';
import { RhfRadioGroup, RhfSelect, RhfTextarea } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, minLength, required } from '@navikt/ft-form-validators';
import { useFormContext } from 'react-hook-form';
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
      <ContentMaxWidth>
        <RhfTextarea
          control={control}
          name="begrunnelse"
          label="Vurdering"
          validate={[required, minLength(3), maxLength(100000), hasValidText]}
          maxLength={100000}
          readOnly={readOnly}
          placeholder="Begrunn vurderingen din"
        />
      </ContentMaxWidth>
      <Box marginBlock="space-16 space-0">
        <HGrid gap="space-4" columns={{ xs: '4fr 4fr 4fr' }}>
          <ContentMaxWidth>
            <RhfRadioGroup
              control={control}
              name="klageVurdering"
              validate={[required]}
              readOnly={readOnly}
              legend=""
              hideLegend
            >
              <Radio value={KlageVurdering.STADFESTE_YTELSESVEDTAK}>Stadfest vedtaket</Radio>
              <Radio value={KlageVurdering.MEDHOLD_I_KLAGE}>Omgjør vedtaket</Radio>
              <Radio value={KlageVurdering.HJEMSENDE_UTEN_Å_OPPHEVE}>Hjemsend vedtaket</Radio>
              <Radio value={KlageVurdering.OPPHEVE_YTELSESVEDTAK}>
                Opphev og hjemsend vedtaket
              </Radio>
            </RhfRadioGroup>
          </ContentMaxWidth>
        </HGrid>
      </Box>
      {klageVurdering === KlageVurdering.MEDHOLD_I_KLAGE && (
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
            <Box marginBlock="space-6 space-0">
              <RhfRadioGroup
                control={control}
                name="klageVurderingOmgjoer"
                validate={[required]}
                readOnly={readOnly}
                legend=""
                hideLegend
              >
                <Radio value={KlagevurderingOmgjør.GUNST_MEDHOLD_I_KLAGE}>Til gunst</Radio>
                <Radio value={KlagevurderingOmgjør.UGUNST_MEDHOLD_I_KLAGE}>Til ugunst</Radio>
                <Radio value={KlagevurderingOmgjør.DELVIS_MEDHOLD_I_KLAGE}>
                  Delvis omgjør, til gunst
                </Radio>
              </RhfRadioGroup>
            </Box>
          </ArrowBox>
        </ContentMaxWidth>
      )}
      {klageVurdering === KlageVurdering.OPPHEVE_YTELSESVEDTAK && (
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
          </ArrowBox>
        </ContentMaxWidth>
      )}
    </div>
  );
};
