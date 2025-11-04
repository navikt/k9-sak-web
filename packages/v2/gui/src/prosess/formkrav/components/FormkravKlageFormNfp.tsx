import type { Arbeidsgivere } from '@k9-sak-web/backend/combined/kontrakt/arbeidsgiver/Arbeidsgivere.js';
import type { FagsakDto } from '@k9-sak-web/backend/combined/kontrakt/fagsak/FagsakDto.js';
import type { KlagebehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/klage/KlagebehandlingDto.js';
import type { PartDto } from '@k9-sak-web/backend/combined/kontrakt/klage/PartDto.js';
import { k9_klage_kodeverk_behandling_BehandlingType } from '@k9-sak-web/backend/k9klage/generated/types.js';
import type { BehandlingDto as K9KlageBehandlingDto } from '@k9-sak-web/backend/k9klage/kontrakt/behandling/BehandlingDto.js';
import type { BehandlingDto as UngSakBehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
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
    påklagBehandlingType: K9KlageBehandlingDto['type'] | UngSakBehandlingDto['type'];
  } | null;
  valgtKlagePart: PartDto | undefined;
}

interface OwnProps {
  arbeidsgiverOpplysningerPerId: Arbeidsgivere;
  avsluttedeBehandlinger: K9KlageBehandlingDto[] | UngSakBehandlingDto[];
  fagsakPerson: FagsakDto['person'];
  klageVurdering: KlagebehandlingDto;
  parterMedKlagerett?: PartDto[];
  readOnly: boolean;
  readOnlySubmitButton: boolean;
  submitCallback: (values: TransformedValues[]) => Promise<void>;
  valgtPartMedKlagerett?: PartDto;
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
  avsluttedeBehandlinger: K9KlageBehandlingDto[] | UngSakBehandlingDto[],
  påklagdVedtak: string | null,
): K9KlageBehandlingDto | UngSakBehandlingDto | undefined =>
  avsluttedeBehandlinger.find(behandling => behandling.uuid.toString() === påklagdVedtak);

export const erTilbakekreving = (
  avsluttedeBehandlinger: K9KlageBehandlingDto[] | UngSakBehandlingDto[],
  påklagdVedtak: string | null,
) => {
  const behandling = getPåklagdBehandling(avsluttedeBehandlinger, påklagdVedtak);
  return (
    behandling?.type === k9_klage_kodeverk_behandling_BehandlingType.TILBAKEKREVING ||
    behandling?.type === k9_klage_kodeverk_behandling_BehandlingType.REVURDERING_TILBAKEKREVING
  );
};
export const påklagdBehandlingInfo = (
  avsluttedeBehandlinger: K9KlageBehandlingDto[] | UngSakBehandlingDto[],
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
  avsluttedeBehandlinger: K9KlageBehandlingDto[] | UngSakBehandlingDto[],
  parterMedKlagerett: PartDto[],
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
  klageVurdering: KlagebehandlingDto,
  avsluttedeBehandlinger: K9KlageBehandlingDto[] | UngSakBehandlingDto[],
  parterMedKlagerett?: PartDto[],
  valgtPartMedKlagerett?: PartDto,
) => {
  const klageFormkavResultatNfp = klageVurdering ? klageVurdering.klageFormkravResultatNFP : null;
  const defaultKlagepart =
    Array.isArray(parterMedKlagerett) && parterMedKlagerett.length === 1
      ? parterMedKlagerett[0]?.identifikasjon?.id
      : null;
  return {
    vedtak: klageFormkavResultatNfp ? getPaklagdVedtak(klageFormkavResultatNfp, avsluttedeBehandlinger) : '',
    begrunnelse: klageFormkavResultatNfp ? klageFormkavResultatNfp.begrunnelse : null,
    erKlagerPart: klageFormkavResultatNfp ? klageFormkavResultatNfp.erKlagerPart : null,
    erKonkret: klageFormkavResultatNfp ? klageFormkavResultatNfp.erKlageKonkret : null,
    erFristOverholdt: klageFormkavResultatNfp ? klageFormkavResultatNfp.erKlagefirstOverholdt : null,
    erSignert: klageFormkavResultatNfp ? klageFormkavResultatNfp.erSignert : null,
    valgtPartMedKlagerett: valgtPartMedKlagerett ? valgtPartMedKlagerett.identifikasjon?.id : defaultKlagepart,
  };
};
