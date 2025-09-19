import {
  ung_kodeverk_klage_KlageVurderingType,
  type ung_sak_kontrakt_klage_KlagebehandlingDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import AksjonspunktHelpText from '@k9-sak-web/gui/shared/aksjonspunktHelpText/AksjonspunktHelpText.js';
import ContentMaxWidth from '@k9-sak-web/gui/shared/ContentMaxWidth/ContentMaxWidth.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
import AksjonspunktCodes from '@k9-sak-web/lib/kodeverk/types/AksjonspunktCodes.js';
import { Box, Button, HGrid, Heading, VStack } from '@navikt/ds-react';
import { RhfForm, RhfTextarea } from '@navikt/ft-form-hooks';
import { hasValidText, required } from '@navikt/ft-form-validators';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import TempSaveAndPreviewKlageLink from '../felles/TempSaveAndPreviewKlageLink';
import TempsaveKlageButton from '../felles/TempsaveKlageButton';
import styles from './behandleKlageFormKa.module.css';
import type { BehandleKlageFormKaFormValues } from './BehandleKlageFormKaFormValues';
import { KlageVurderingRadioOptionsKa } from './KlageVurderingRadioOptionsKa';

interface BehandleKlageFormKaProps {
  klageVurdering: ung_sak_kontrakt_klage_KlagebehandlingDto;
  saveKlage: () => Promise<void>;
  submitCallback: (values: TransformedValues) => Promise<void>;
  isReadOnly: boolean;
  previewCallback: () => Promise<void>;
  readOnlySubmitButton: boolean;
}

/**
 * BehandleklageformNfp
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for behandling av klage (KA).
 */
export const BehandleKlageFormKa = ({
  klageVurdering,
  isReadOnly = true,
  submitCallback,
  saveKlage,
  previewCallback,
  readOnlySubmitButton = true,
}: BehandleKlageFormKaProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formMethods = useForm<BehandleKlageFormKaFormValues>({
    defaultValues: buildInitialValues(klageVurdering),
  });
  const handleSubmit = (values: BehandleKlageFormKaFormValues) => {
    setIsSubmitting(true);
    try {
      void submitCallback(transformValues(values));
    } finally {
      setIsSubmitting(false);
    }
  };
  const formValues = formMethods.watch();
  const { hentKodeverkForKode } = useKodeverkContext();
  const medholdReasons = hentKodeverkForKode(KodeverkType.KLAGE_MEDHOLD_ARSAK) || [];
  return (
    <RhfForm formMethods={formMethods} onSubmit={handleSubmit}>
      <Heading size="small" level="2">
        Behandle klage
      </Heading>
      <Box.New marginBlock="space-4 0">
        <AksjonspunktHelpText isAksjonspunktOpen={!readOnlySubmitButton}>
          Vurder om klagen skal tas til følge
        </AksjonspunktHelpText>
      </Box.New>
      <Box.New marginBlock="space-16 0">
        <KlageVurderingRadioOptionsKa
          readOnly={isReadOnly}
          klageVurdering={formValues.klageVurdering}
          medholdReasons={medholdReasons}
        />
      </Box.New>
      <div className={styles.confirmVilkarForm}>
        <VStack gap="space-16">
          <ContentMaxWidth>
            <RhfTextarea
              control={formMethods.control}
              name="fritekstTilBrev"
              label="Fritekst til brev"
              validate={[required, hasValidText]}
              readOnly={isReadOnly}
              maxLength={100000}
            />
          </ContentMaxWidth>
          <HGrid gap="space-4" columns={{ xs: '8fr 2fr 2fr' }}>
            <div className="relative">
              <Button variant="primary" size="small" loading={isSubmitting} type="submit">
                Bekreft og fortsett
              </Button>
              {!isReadOnly &&
                formValues.klageVurdering &&
                formValues.fritekstTilBrev &&
                formValues.fritekstTilBrev.length > 2 && (
                  <TempSaveAndPreviewKlageLink
                    formValues={formValues}
                    saveKlage={saveKlage}
                    readOnly={isReadOnly}
                    aksjonspunktCode={AksjonspunktCodes.BEHANDLE_KLAGE_NK}
                    previewCallback={previewCallback}
                  />
                )}
            </div>
            <div>
              <TempsaveKlageButton
                formValues={formValues}
                saveKlage={saveKlage}
                readOnly={isReadOnly}
                aksjonspunktCode={AksjonspunktCodes.BEHANDLE_KLAGE_NK}
              />
            </div>
          </HGrid>
        </VStack>
      </div>
    </RhfForm>
  );
};

export const buildInitialValues = (klageVurdering: ung_sak_kontrakt_klage_KlagebehandlingDto) => ({
  klageMedholdArsak: klageVurdering.klageVurderingResultatNK
    ? klageVurdering.klageVurderingResultatNK.klageMedholdArsak
    : null,
  klageVurderingOmgjoer: klageVurdering.klageVurderingResultatNK
    ? klageVurdering.klageVurderingResultatNK.klageVurderingOmgjoer
    : null,
  klageVurdering: klageVurdering.klageVurderingResultatNK
    ? klageVurdering.klageVurderingResultatNK.klageVurdering
    : null,
  begrunnelse: klageVurdering.klageVurderingResultatNK ? klageVurdering.klageVurderingResultatNK.begrunnelse : null,
  fritekstTilBrev: klageVurdering.klageVurderingResultatNK
    ? klageVurdering.klageVurderingResultatNK.fritekstTilBrev
    : null,
});

interface TransformedValues {
  klageMedholdArsak: string | null;
  klageVurderingOmgjoer: string | null;
  klageVurdering: string | null;
  fritekstTilBrev: string | null;
  begrunnelse: string | null;
  kode: string;
}

export const transformValues = (values: BehandleKlageFormKaFormValues): TransformedValues => ({
  klageMedholdArsak:
    values.klageVurdering === ung_kodeverk_klage_KlageVurderingType.MEDHOLD_I_KLAGE ||
    values.klageVurdering === ung_kodeverk_klage_KlageVurderingType.OPPHEVE_YTELSESVEDTAK
      ? values.klageMedholdArsak
      : null,
  klageVurderingOmgjoer:
    values.klageVurdering === ung_kodeverk_klage_KlageVurderingType.MEDHOLD_I_KLAGE
      ? values.klageVurderingOmgjoer
      : null,
  klageVurdering: values.klageVurdering,
  fritekstTilBrev: values.fritekstTilBrev,
  begrunnelse: values.begrunnelse,
  kode: AksjonspunktCodes.BEHANDLE_KLAGE_NK,
});
