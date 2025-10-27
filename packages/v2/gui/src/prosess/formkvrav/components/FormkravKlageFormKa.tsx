import type {
  k9_klage_kodeverk_behandling_BehandlingType,
  k9_klage_kontrakt_behandling_BehandlingDto,
  k9_klage_kontrakt_behandling_part_PartDto,
  k9_klage_kontrakt_klage_KlagebehandlingDto,
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
import { erTilbakekreving, påklagdBehandlingInfo } from './FormkravKlageFormNfp';
import type { FormValuesKa } from './FormValuesKa';

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
 * FormkravKlageFormKA
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for formkrav klage (KA).
 */
export const FormkravKlageFormKa = ({
  readOnly = true,
  readOnlySubmitButton = true,
  fagsakPerson,
  arbeidsgiverOpplysningerPerId,
  avsluttedeBehandlinger,
  parterMedKlagerett,
  klageVurdering,
  valgtPartMedKlagerett,
  submitCallback,
}: OwnProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formMethods = useForm<FormValuesKa>({
    defaultValues: buildInitialValues(klageVurdering, avsluttedeBehandlinger, valgtPartMedKlagerett),
  });

  const handleSubmit = async (values: FormValuesKa) => {
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
        aksjonspunktCode={AksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA}
        fagsakPerson={fagsakPerson}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        avsluttedeBehandlinger={avsluttedeBehandlinger}
        parterMedKlagerett={parterMedKlagerett}
        skalKunneVelgeKlagepart={false}
        isSubmitting={isSubmitting}
      />
    </RhfForm>
  );
};

export const transformValues = (
  values: FormValuesKa,
  avsluttedeBehandlinger: k9_klage_kontrakt_behandling_BehandlingDto[],
  parterMedKlagerett: k9_klage_kontrakt_behandling_part_PartDto[],
) => ({
  erKlagerPart: values.erKlagerPart ?? false,
  erFristOverholdt: values.erFristOverholdt ?? false,
  erKonkret: values.erKonkret ?? false,
  erSignert: values.erSignert ?? false,
  begrunnelse: values.begrunnelse ?? '',
  kode: AksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA,
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
  valgtPartMedKlagerett?: k9_klage_kontrakt_behandling_part_PartDto,
) => {
  const klageFormkavResultatKa = klageVurdering ? klageVurdering.klageFormkravResultatKA : null;
  return {
    vedtak: klageFormkavResultatKa ? getPaklagdVedtak(klageFormkavResultatKa, avsluttedeBehandlinger) : null,
    begrunnelse: klageFormkavResultatKa ? klageFormkavResultatKa.begrunnelse : null,
    erKlagerPart: klageFormkavResultatKa ? klageFormkavResultatKa.erKlagerPart : null,
    erKonkret: klageFormkavResultatKa ? klageFormkavResultatKa.erKlageKonkret : null,
    erFristOverholdt: klageFormkavResultatKa ? klageFormkavResultatKa.erKlagefirstOverholdt : null,
    erSignert: klageFormkavResultatKa ? klageFormkavResultatKa.erSignert : null,
    valgtPartMedKlagerett: valgtPartMedKlagerett?.identifikasjon?.id,
  };
};
