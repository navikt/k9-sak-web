import { type ung_sak_kontrakt_klage_KlageVurderingResultatDto } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { Button, HGrid } from '@navikt/ds-react';
import styles from './vedtakKlageSubmitPanel.module.css';

// const getBrevKode = (klageVurdering: string | undefined, klageVurdertAvKa: boolean) => {
//   switch (klageVurdering) {
//     case ung_kodeverk_klage_KlageVurderingType.STADFESTE_YTELSESVEDTAK:
//       return klageVurdertAvKa
//         ? ung_kodeverk_dokument_DokumentMalType.KLAGE_YTELSESVEDTAK_STADFESTET_DOK
//         : ung_kodeverk_dokument_DokumentMalType.KLAGE_OVERSENDT_KLAGEINSTANS;
//     case ung_kodeverk_klage_KlageVurderingType.OPPHEVE_YTELSESVEDTAK:
//       return ung_kodeverk_dokument_DokumentMalType.KLAGE_YTELSESVEDTAK_OPPHEVET_DOK;
//     case ung_kodeverk_klage_KlageVurderingType.HJEMSENDE_UTEN_Å_OPPHEVE:
//       return ung_kodeverk_dokument_DokumentMalType.KLAGE_YTELSESVEDTAK_OPPHEVET_DOK;
//     case ung_kodeverk_klage_KlageVurderingType.MEDHOLD_I_KLAGE:
//       return ung_kodeverk_dokument_DokumentMalType.KLAGE_VEDTAK_MEDHOLD;
//     case ung_kodeverk_klage_KlageVurderingType.AVVIS_KLAGE:
//       return ung_kodeverk_dokument_DokumentMalType.KLAGE_AVVIST_DOK;
//     default:
//       return null;
//   }
// };

// const getPreviewCallback = (
//   formState: FormState<FormValues>,
//   begrunnelse: string,
//   previewVedtakCallback: ({
//     dokumentdata,
//     dokumentMal,
//   }: {
//     dokumentdata: {
//       fritekst: string;
//     };
//     dokumentMal: string | null;
//   }) => Promise<void>,
//   klageResultat: ung_sak_kontrakt_klage_KlageVurderingResultatDto,
// ) => {
//   const klageVurdertAvNK = klageResultat.klageVurdertAv === 'KA';
//   const data = {
//     dokumentdata: { fritekst: begrunnelse ?? '' },
//     dokumentMal: getBrevKode(klageResultat.klageVurdering, klageVurdertAvNK),
//   };
//   if (formState.isValid || !formState.isDirty) {
//     void previewVedtakCallback(data);
//   }
//   // else {
//   //   formProps.submit();
//   // }
// };

interface OwnProps {
  behandlingPåVent: boolean;
  readOnly: boolean;
  klageResultat: ung_sak_kontrakt_klage_KlageVurderingResultatDto;
  previewVedtakCallback: () => Promise<void>;
  submitCallback: () => void;
  isSubmitting: boolean;
}

export const VedtakKlageKaSubmitPanel = ({
  behandlingPåVent,
  previewVedtakCallback,
  klageResultat,
  readOnly,
  submitCallback,
  isSubmitting,
}: OwnProps) => {
  // const previewBrev = () => getPreviewCallback(formState, begrunnelse, previewVedtakCallback, klageResultat);

  return (
    <HGrid gap="space-4" columns={{ xs: '8fr 4fr' }}>
      <div>
        {!readOnly && (
          <Button
            variant="primary"
            size="small"
            className={styles.mainButton}
            disabled={behandlingPåVent || klageResultat.godkjentAvMedunderskriver}
            type="submit"
            onClick={submitCallback}
            loading={isSubmitting}
          >
            Send til medunderskriver
          </Button>
        )}
        {!readOnly && (
          <Button
            variant="primary"
            size="small"
            className={styles.mainButton}
            disabled={behandlingPåVent || !klageResultat.godkjentAvMedunderskriver}
            type="submit"
            onClick={submitCallback}
            loading={isSubmitting}
          >
            Ferdigstill klage
          </Button>
        )}
        <Button variant="tertiary" size="small" type="button" onClick={previewVedtakCallback}>
          Forhåndsvis vedtaksbrev
        </Button>
      </div>
    </HGrid>
  );
};
