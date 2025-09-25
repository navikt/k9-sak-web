import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import {
  ung_kodeverk_klage_KlageVurderingType,
  type ung_sak_kontrakt_fagsak_FagsakDto,
  type ung_sak_kontrakt_klage_KlagebehandlingDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import AksjonspunktHelpText from '@k9-sak-web/gui/shared/aksjonspunktHelpText/AksjonspunktHelpText.js';
import ContentMaxWidth from '@k9-sak-web/gui/shared/ContentMaxWidth/ContentMaxWidth.js';
import { erTilbakekreving } from '@k9-sak-web/gui/utils/behandlingUtils.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
import AksjonspunktCodes from '@k9-sak-web/lib/kodeverk/types/AksjonspunktCodes.js';
import { Box, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { RhfForm, RhfTextarea } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, minLength, required } from '@navikt/ft-form-validators';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import TempSaveAndPreviewKlageLink from '../felles/TempSaveAndPreviewKlageLink';
import TempsaveKlageButton from '../felles/TempsaveKlageButton';
import styles from './behandleKlageFormNfp.module.css';
import type { BehandleKlageFormNfpFormValues } from './BehandleKlageFormNfpFormValues';
import { KlageVurderingRadioOptionsNfp, TILBAKEKREVING_HJEMMEL } from './KlageVurderingRadioOptionsNfp';

interface BehandleKlageFormNfpProps {
  fagsak: ung_sak_kontrakt_fagsak_FagsakDto;
  klageVurdering: ung_sak_kontrakt_klage_KlagebehandlingDto;
  saveKlage: () => Promise<void>;
  submitCallback: (values: TransformValues) => Promise<void>;
  isReadOnly: boolean;
  previewCallback: () => Promise<void>;
  readOnlySubmitButton: boolean;
}

/**
 * BehandleklageformNfp
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for behandling av klage (NFP).
 */
export const BehandleKlageFormNfp = ({
  fagsak,
  isReadOnly = true,
  submitCallback,
  klageVurdering,
  previewCallback,
  saveKlage,
  readOnlySubmitButton = true,
}: BehandleKlageFormNfpProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formMethods = useForm<BehandleKlageFormNfpFormValues>({
    defaultValues: buildInitialValues(klageVurdering, fagsak),
  });
  const erPåklagdBehandlingTilbakekreving = getErPåklagdBehandlingTilbakekreving(klageVurdering);
  const handleSubmit = (values: BehandleKlageFormNfpFormValues) => {
    setIsSubmitting(true);
    try {
      void submitCallback(transformValues(values, fagsak, erPåklagdBehandlingTilbakekreving));
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
        <KlageVurderingRadioOptionsNfp
          fagsak={fagsak}
          readOnly={isReadOnly}
          erPåklagdBehandlingTilbakekreving={erPåklagdBehandlingTilbakekreving}
          klageVurdering={formValues.klageVurdering}
          medholdReasons={medholdReasons}
        />
      </Box.New>
      <div className={styles.confirmVilkarForm}>
        <ContentMaxWidth>
          <VStack gap="space-16">
            <RhfTextarea
              control={formMethods.control}
              name="begrunnelse"
              label="Vurdering"
              validate={[required, minLength(3), maxLength(100000), hasValidText]}
              maxLength={100000}
              readOnly={isReadOnly}
              placeholder="Begrunn vurderingen din"
            />
            <RhfTextarea
              control={formMethods.control}
              name="fritekstTilBrev"
              label="Fritekst til brev"
              validate={[required, hasValidText]}
              readOnly={isReadOnly}
              maxLength={100000}
            />
          </VStack>
        </ContentMaxWidth>
        <HStack gap="space-8" marginBlock="space-16">
          <div>
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
                  aksjonspunktCode={AksjonspunktCodes.BEHANDLE_KLAGE_NFP}
                  previewCallback={previewCallback}
                />
              )}
          </div>
          <div>
            <TempsaveKlageButton
              formValues={formValues}
              saveKlage={saveKlage}
              readOnly={isReadOnly}
              aksjonspunktCode={AksjonspunktCodes.BEHANDLE_KLAGE_NFP}
            />
          </div>
        </HStack>
      </div>
    </RhfForm>
  );
};

export const buildInitialValues = (
  klageVurdering: ung_sak_kontrakt_klage_KlagebehandlingDto,
  fagsak: ung_sak_kontrakt_fagsak_FagsakDto,
) => ({
  klageMedholdArsak: klageVurdering.klageVurderingResultatNFP
    ? klageVurdering.klageVurderingResultatNFP.klageMedholdArsak
    : null,
  klageVurderingOmgjoer: klageVurdering.klageVurderingResultatNFP
    ? klageVurdering.klageVurderingResultatNFP.klageVurderingOmgjoer
    : null,
  klageHjemmel:
    fagsak.sakstype !== fagsakYtelsesType.FRISINN &&
    klageVurdering.klageVurderingResultatNFP &&
    klageVurdering.klageVurderingResultatNFP.hjemmel !== '-'
      ? klageVurdering.klageVurderingResultatNFP.hjemmel
      : null,
  klageVurdering: klageVurdering.klageVurderingResultatNFP
    ? klageVurdering.klageVurderingResultatNFP.klageVurdering
    : null,
  begrunnelse: klageVurdering.klageVurderingResultatNFP ? klageVurdering.klageVurderingResultatNFP.begrunnelse : null,
  fritekstTilBrev: klageVurdering.klageVurderingResultatNFP
    ? klageVurdering.klageVurderingResultatNFP.fritekstTilBrev
    : null,
});

interface TransformValues {
  klageMedholdArsak: string | null;
  klageVurderingOmgjoer: string | null;
  klageHjemmel: string | null;
  klageVurdering: string | null;
  fritekstTilBrev: string | null;
  begrunnelse: string | null;
  kode: string;
}

export const transformValues = (
  values: BehandleKlageFormNfpFormValues,
  fagsak: ung_sak_kontrakt_fagsak_FagsakDto,
  erPåklagdBehandlingTilbakekreving: boolean,
): TransformValues => {
  let klageHjemmel: string | null = null;

  if (
    fagsak.sakstype !== fagsakYtelsesType.FRISINN &&
    values.klageVurdering === ung_kodeverk_klage_KlageVurderingType.STADFESTE_YTELSESVEDTAK
  ) {
    klageHjemmel = erPåklagdBehandlingTilbakekreving ? TILBAKEKREVING_HJEMMEL : values.klageHjemmel;
  }

  return {
    klageMedholdArsak:
      values.klageVurdering === ung_kodeverk_klage_KlageVurderingType.MEDHOLD_I_KLAGE ||
      values.klageVurdering === ung_kodeverk_klage_KlageVurderingType.OPPHEVE_YTELSESVEDTAK
        ? values.klageMedholdArsak
        : null,
    klageVurderingOmgjoer:
      values.klageVurdering === ung_kodeverk_klage_KlageVurderingType.MEDHOLD_I_KLAGE
        ? values.klageVurderingOmgjoer
        : null,
    klageHjemmel,
    klageVurdering: values.klageVurdering,
    fritekstTilBrev: values.fritekstTilBrev,
    begrunnelse: values.begrunnelse,
    kode: AksjonspunktCodes.BEHANDLE_KLAGE_NFP,
  };
};

const getErPåklagdBehandlingTilbakekreving = (klageVurdering: ung_sak_kontrakt_klage_KlagebehandlingDto) =>
  erTilbakekreving(
    klageVurdering.klageFormkravResultatNFP && klageVurdering.klageFormkravResultatNFP.påklagdBehandlingType,
  );
