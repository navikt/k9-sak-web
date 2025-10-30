import type { k9_klage_kontrakt_klage_KlagebehandlingDto } from '@k9-sak-web/backend/k9klage/generated/types.js';
import {
  ung_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus,
  ung_kodeverk_klage_KlageVurderingType,
  type ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  type ung_sak_kontrakt_behandling_BehandlingsresultatDto,
  type ung_sak_kontrakt_klage_KlagebehandlingDto,
  type ung_sak_kontrakt_klage_KlageVurderingResultatDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import AksjonspunktHelpText from '@k9-sak-web/gui/shared/aksjonspunktHelpText/AksjonspunktHelpText.js';
import { KodeverkKlageType } from '@k9-sak-web/lib/kodeverk/types.js';
import AksjonspunktCodes from '@k9-sak-web/lib/kodeverk/types/AksjonspunktCodes.js';
import { BodyShort, BoxNew, Detail, Heading } from '@navikt/ds-react';
import { useState } from 'react';
import { VedtakKlageKaSubmitPanel } from './VedtakKlageKaSubmitPanel';
import VedtakKlageNkkSubmitPanel from './VedtakKlageNkkSubmitPanel';
import { VedtakKlageSubmitPanel } from './VedtakKlageSubmitPanel';

// const getPreviewVedtakCallback = previewVedtakCallback => () =>
//   previewVedtakCallback({
//     dokumentMal: dokumentMalType.UTLED,
//   });

export const getAvvisningsAarsaker = (
  klageVurdering: ung_sak_kontrakt_klage_KlagebehandlingDto | k9_klage_kontrakt_klage_KlagebehandlingDto,
) => {
  if (klageVurdering) {
    if (
      'klageFormkravResultatKA' in klageVurdering &&
      klageVurdering.klageFormkravResultatKA &&
      klageVurdering.klageVurderingResultatNK
    ) {
      return klageVurdering.klageFormkravResultatKA.avvistArsaker;
    }
    if (klageVurdering.klageFormkravResultatNFP) {
      return klageVurdering.klageFormkravResultatNFP.avvistArsaker;
    }
  }
  return null;
};

const getOmgjortAarsak = (
  klageVurdering: ung_sak_kontrakt_klage_KlagebehandlingDto | k9_klage_kontrakt_klage_KlagebehandlingDto,
) => {
  if (klageVurdering) {
    if (klageVurdering.klageVurderingResultatNK) {
      return klageVurdering.klageVurderingResultatNK.klageMedholdArsakNavn;
    }
    if (klageVurdering.klageVurderingResultatNFP) {
      return klageVurdering.klageVurderingResultatNFP.klageMedholdArsakNavn;
    }
  }
  return null;
};

const getResultatText = (klageresultat: ung_sak_kontrakt_klage_KlageVurderingResultatDto | undefined) => {
  switch (klageresultat?.klageVurdering) {
    case ung_kodeverk_klage_KlageVurderingType.AVVIS_KLAGE:
      return 'Avvist fordi klagen ikke oppfyller formkravene';
    case ung_kodeverk_klage_KlageVurderingType.STADFESTE_YTELSESVEDTAK:
      return 'Vedtaket er stadfestet';
    case ung_kodeverk_klage_KlageVurderingType.OPPHEVE_YTELSESVEDTAK:
      return 'Vedtak er opphevet og hjemsendt';
    case ung_kodeverk_klage_KlageVurderingType.HJEMSENDE_UTEN_Å_OPPHEVE:
      return 'Vedtaket er hjemsendt';
    case ung_kodeverk_klage_KlageVurderingType.TRUKKET:
      return 'Klagen er trukket';
    case ung_kodeverk_klage_KlageVurderingType.FEILREGISTRERT:
      return klageresultat.begrunnelse;
    case ung_kodeverk_klage_KlageVurderingType.MEDHOLD_I_KLAGE:
      return klageresultat.klageVurderingOmgjoer
        ? omgjoerTekstMap[klageresultat.klageVurderingOmgjoer as keyof typeof omgjoerTekstMap]
        : null;
    default:
      return null;
  }
};

interface OwnProps {
  readOnly: boolean;
  klageVurdering: ung_sak_kontrakt_klage_KlagebehandlingDto | k9_klage_kontrakt_klage_KlagebehandlingDto;
  previewVedtakCallback: () => Promise<void>;
  behandlingsresultat?: ung_sak_kontrakt_behandling_BehandlingsresultatDto;
  aksjonspunkter: ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto[];
  behandlingPåVent: boolean;
  submitCallback: (data: { kode: string }[]) => Promise<void>;
}

export const VedtakKlageForm = ({
  readOnly,
  previewVedtakCallback,
  behandlingPåVent,
  klageVurdering,
  aksjonspunkter,
  submitCallback,
}: OwnProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const klageresultat = klageVurdering.klageVurderingResultatNK || klageVurdering.klageVurderingResultatNFP;
  const isAvvist = klageresultat?.klageVurdering === ung_kodeverk_klage_KlageVurderingType.AVVIS_KLAGE;
  const avvistArsaker = getAvvisningsAarsaker(klageVurdering);
  const isOpphevOgHjemsend =
    klageresultat?.klageVurdering === ung_kodeverk_klage_KlageVurderingType.OPPHEVE_YTELSESVEDTAK;
  const isOmgjort = klageresultat?.klageVurdering === ung_kodeverk_klage_KlageVurderingType.MEDHOLD_I_KLAGE;
  const omgjortAarsak = getOmgjortAarsak(klageVurdering);
  const behandlingsResultatTekst = getResultatText(klageresultat);
  const åpneAksjonspunktKoder = aksjonspunkter
    .filter(ap => ap.status === ung_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.OPPRETTET && ap.kanLoses)
    .map(ap => ap.definisjon);
  const { kodeverkNavnFraKode } = useKodeverkContext();
  const submitHandler = async () => {
    setIsSubmitting(true);
    try {
      await submitCallback(aksjonspunkter.filter(ap => ap.definisjon).map(ap => ({ kode: ap.definisjon! })));
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <Heading size="small" level="2">
        Resultat
      </Heading>
      <BoxNew marginBlock="space-20 0" />
      {!readOnly && åpneAksjonspunktKoder.some(a => a === AksjonspunktCodes.VURDERE_DOKUMENT) ? (
        <>
          <AksjonspunktHelpText isAksjonspunktOpen>
            Vurder om den åpne oppgaven «Vurder dokument» påvirker behandlingen
          </AksjonspunktHelpText>
          <BoxNew marginBlock="space-8 0" />
        </>
      ) : null}
      <>
        <div>
          <Detail>Resultat av klage</Detail>
        </div>
        {behandlingsResultatTekst && <BodyShort size="small">{behandlingsResultatTekst}</BodyShort>}
        <BoxNew marginBlock="space-16 0">
          {isAvvist && Array.isArray(avvistArsaker) && avvistArsaker.length > 0 && (
            <div>
              <Detail>Årsak til avvisning</Detail>
              {avvistArsaker.map(arsak => (
                <BodyShort size="small" key={arsak}>
                  {kodeverkNavnFraKode(arsak, KodeverkKlageType.KLAGE_AVVIST_AARSAK)}
                </BodyShort>
              ))}
              <BoxNew marginBlock="space-16 0" />
            </div>
          )}
        </BoxNew>
        {isOmgjort && omgjortAarsak && (
          <div>
            <Detail>Årsak til omgjøring</Detail>
            <BodyShort size="small">{omgjortAarsak}</BodyShort>
            <BoxNew marginBlock="space-16 0" />
          </div>
        )}
        {isOpphevOgHjemsend && omgjortAarsak && (
          <div>
            <Detail>Årsak til oppheving</Detail>
            <BodyShort size="small">{omgjortAarsak}</BodyShort>
            <BoxNew marginBlock="space-16 0" />
          </div>
        )}

        {klageresultat?.klageVurdertAv === 'NKK' && (
          <VedtakKlageNkkSubmitPanel
            klageResultat={klageresultat}
            readOnly={readOnly}
            behandlingPåVent={behandlingPåVent}
            submitCallback={submitHandler}
            isSubmitting={isSubmitting}
          />
        )}

        {klageresultat?.klageVurdertAv === 'NK' && (
          <VedtakKlageKaSubmitPanel
            klageResultat={klageresultat}
            previewVedtakCallback={previewVedtakCallback}
            readOnly={readOnly}
            behandlingPåVent={behandlingPåVent}
            submitCallback={submitHandler}
            isSubmitting={isSubmitting}
          />
        )}

        {(klageresultat?.klageVurdertAv === 'NAY' ||
          klageresultat?.klageVurdertAv === 'NFP' ||
          klageresultat?.klageVurdertAv === 'VI') && (
          <VedtakKlageSubmitPanel
            previewVedtakCallback={previewVedtakCallback}
            readOnly={readOnly}
            behandlingPåVent={behandlingPåVent}
            submitCallback={submitHandler}
            isSubmitting={isSubmitting}
          />
        )}
      </>
    </div>
  );
};

const omgjoerTekstMap = {
  GUNST_MEDHOLD_I_KLAGE: 'Vedtaket er omgjort til gunst',
  UGUNST_MEDHOLD_I_KLAGE: 'Vedtaket er omgjort til ugunst',
  DELVIS_MEDHOLD_I_KLAGE: 'Vedtaket er delvis omgjort til gunst',
};
