import {
  k9_klage_kodeverk_behandling_BehandlingType,
  type k9_klage_kontrakt_behandling_BehandlingDto,
  type k9_klage_kontrakt_behandling_part_PartDto,
  type k9_klage_kontrakt_klage_KlagebehandlingDto,
} from '@k9-sak-web/backend/k9klage/generated/types.js';
import type {
  ung_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto,
  ung_sak_kontrakt_fagsak_FagsakDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import AksjonspunktCodes from '@k9-sak-web/lib/kodeverk/types/AksjonspunktCodes.js';
import { RhfForm } from '@navikt/ft-form-hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormkravKlageForm, getPaklagdVedtak, IKKE_PAKLAGD_VEDTAK } from './FormkravKlageForm';
import type { FormValuesNfp } from './FormValuesNfp';

interface TransformedValues {
  erKlagerPart: boolean;
  erFristOverholdt: boolean;
  erKonkret: boolean;
  erSignert: boolean;
  begrunnelse: string;
  kode: string;
  vedtak: string | null;
  erTilbakekreving: boolean;
  påklagdBehandlingInfo: {
    påklagBehandlingUuid: string;
    påklagBehandlingVedtakDato: string | undefined;
    påklagBehandlingType: k9_klage_kodeverk_behandling_BehandlingType;
  } | null;
  valgtKlagePart: k9_klage_kontrakt_behandling_part_PartDto | undefined;
}

interface OwnProps {
  arbeidsgiverOpplysningerPerId: ung_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto['arbeidsgivere'];
  avsluttedeBehandlinger: k9_klage_kontrakt_behandling_BehandlingDto[];
  fagsakPerson: ung_sak_kontrakt_fagsak_FagsakDto['person'];
  klageVurdering: k9_klage_kontrakt_klage_KlagebehandlingDto;
  parterMedKlagerett?: k9_klage_kontrakt_behandling_part_PartDto[];
  readOnly: boolean;
  readOnlySubmitButton: boolean;
  submitCallback: (values: TransformedValues[]) => Promise<void>;
  valgtPartMedKlagerett?: k9_klage_kontrakt_behandling_part_PartDto;
}

/**
 * FormkravklageformNfp
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for formkrav klage (NFP).
 */
export const FormkravKlageFormNfp = ({
  readOnly = true,
  readOnlySubmitButton = true,
  fagsakPerson,
  arbeidsgiverOpplysningerPerId,
  avsluttedeBehandlinger,
  parterMedKlagerett,
  submitCallback,
  klageVurdering,
  valgtPartMedKlagerett,
}: OwnProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formMethods = useForm<FormValuesNfp>({
    defaultValues: buildInitialValues(
      klageVurdering,
      avsluttedeBehandlinger,
      parterMedKlagerett,
      valgtPartMedKlagerett,
    ),
  });
  const handleSubmit = async (values: FormValuesNfp) => {
    setIsSubmitting(true);
    try {
      await submitCallback([transformValues(values, avsluttedeBehandlinger, parterMedKlagerett || [])]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RhfForm formMethods={formMethods} onSubmit={handleSubmit}>
      <FormkravKlageForm
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
        aksjonspunktCode={AksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP}
        fagsakPerson={fagsakPerson}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        avsluttedeBehandlinger={avsluttedeBehandlinger}
        parterMedKlagerett={parterMedKlagerett}
        skalKunneVelgeKlagepart
        isSubmitting={isSubmitting}
      />
    </RhfForm>
  );
};

const getPåklagdBehandling = (
  avsluttedeBehandlinger: k9_klage_kontrakt_behandling_BehandlingDto[],
  påklagdVedtak: string | null,
): k9_klage_kontrakt_behandling_BehandlingDto | undefined =>
  avsluttedeBehandlinger.find(behandling => behandling.uuid.toString() === påklagdVedtak);

export const erTilbakekreving = (
  avsluttedeBehandlinger: k9_klage_kontrakt_behandling_BehandlingDto[],
  påklagdVedtak: string | null,
) => {
  const behandling = getPåklagdBehandling(avsluttedeBehandlinger, påklagdVedtak);
  return (
    behandling?.type === k9_klage_kodeverk_behandling_BehandlingType.TILBAKEKREVING ||
    behandling?.type === k9_klage_kodeverk_behandling_BehandlingType.REVURDERING_TILBAKEKREVING
  );
};
export const påklagdBehandlingInfo = (
  avsluttedeBehandlinger: k9_klage_kontrakt_behandling_BehandlingDto[],
  påklagdVedtak: string | null,
) => {
  const behandling = getPåklagdBehandling(avsluttedeBehandlinger, påklagdVedtak);
  return behandling
    ? {
        påklagBehandlingUuid: behandling.uuid,
        påklagBehandlingVedtakDato: behandling.avsluttet,
        påklagBehandlingType: behandling.type,
      }
    : null;
};
const transformValues = (
  values: FormValuesNfp,
  avsluttedeBehandlinger: k9_klage_kontrakt_behandling_BehandlingDto[],
  parterMedKlagerett: k9_klage_kontrakt_behandling_part_PartDto[],
) => ({
  erKlagerPart: values.erKlagerPart ?? false,
  erFristOverholdt: values.erFristOverholdt ?? false,
  erKonkret: values.erKonkret ?? false,
  erSignert: values.erSignert ?? false,
  begrunnelse: values.begrunnelse ?? '',
  kode: AksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP,
  vedtak: values.vedtak === IKKE_PAKLAGD_VEDTAK ? null : values.vedtak,
  erTilbakekreving: erTilbakekreving(avsluttedeBehandlinger, values.vedtak),
  påklagdBehandlingInfo: påklagdBehandlingInfo(avsluttedeBehandlinger, values.vedtak),
  valgtKlagePart: values.valgtPartMedKlagerett
    ? parterMedKlagerett?.find(part => part.identifikasjon?.id === values.valgtPartMedKlagerett)
    : undefined,
});

const buildInitialValues = (
  klageVurdering: k9_klage_kontrakt_klage_KlagebehandlingDto,
  avsluttedeBehandlinger: k9_klage_kontrakt_behandling_BehandlingDto[],
  parterMedKlagerett?: k9_klage_kontrakt_behandling_part_PartDto[],
  valgtPartMedKlagerett?: k9_klage_kontrakt_behandling_part_PartDto,
) => {
  const klageFormkavResultatNfp = klageVurdering ? klageVurdering.klageFormkravResultatNFP : null;
  const defaultKlagepart =
    Array.isArray(parterMedKlagerett) && parterMedKlagerett.length === 1
      ? parterMedKlagerett[0]?.identifikasjon?.id
      : null;
  return {
    vedtak: klageFormkavResultatNfp ? getPaklagdVedtak(klageFormkavResultatNfp, avsluttedeBehandlinger) : null,
    begrunnelse: klageFormkavResultatNfp ? klageFormkavResultatNfp.begrunnelse : null,
    erKlagerPart: klageFormkavResultatNfp ? klageFormkavResultatNfp.erKlagerPart : null,
    erKonkret: klageFormkavResultatNfp ? klageFormkavResultatNfp.erKlageKonkret : null,
    erFristOverholdt: klageFormkavResultatNfp ? klageFormkavResultatNfp.erKlagefirstOverholdt : null,
    erSignert: klageFormkavResultatNfp ? klageFormkavResultatNfp.erSignert : null,
    valgtPartMedKlagerett: valgtPartMedKlagerett ? valgtPartMedKlagerett.identifikasjon?.id : defaultKlagepart,
  };
};
