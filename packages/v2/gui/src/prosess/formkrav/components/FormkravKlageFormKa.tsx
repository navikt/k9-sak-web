import type { Arbeidsgivere } from '@k9-sak-web/backend/combined/kontrakt/arbeidsgiver/Arbeidsgivere.js';
import type { FagsakDto } from '@k9-sak-web/backend/combined/kontrakt/fagsak/FagsakDto.js';
import type { KlagebehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/klage/KlagebehandlingDto.js';
import type { PartDto } from '@k9-sak-web/backend/combined/kontrakt/klage/PartDto.js';
import type { BehandlingDto as K9KlageBehandlingDto } from '@k9-sak-web/backend/k9klage/kontrakt/behandling/BehandlingDto.js';
import type { BehandlingDto as UngSakBehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
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
  avsluttedeBehandlinger: K9KlageBehandlingDto[] | UngSakBehandlingDto[],
  parterMedKlagerett: PartDto[],
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
  klageVurdering: KlagebehandlingDto,
  avsluttedeBehandlinger: K9KlageBehandlingDto[] | UngSakBehandlingDto[],
  valgtPartMedKlagerett?: PartDto,
) => {
  const klageFormkavResultatKa =
    klageVurdering && 'klageFormkravResultatKA' in klageVurdering ? klageVurdering.klageFormkravResultatKA : null;
  return {
    vedtak: klageFormkavResultatKa ? getPaklagdVedtak(klageFormkavResultatKa, avsluttedeBehandlinger) : '',
    begrunnelse: klageFormkavResultatKa ? klageFormkavResultatKa.begrunnelse : null,
    erKlagerPart: klageFormkavResultatKa ? klageFormkavResultatKa.erKlagerPart : null,
    erKonkret: klageFormkavResultatKa ? klageFormkavResultatKa.erKlageKonkret : null,
    erFristOverholdt: klageFormkavResultatKa ? klageFormkavResultatKa.erKlagefirstOverholdt : null,
    erSignert: klageFormkavResultatKa ? klageFormkavResultatKa.erSignert : null,
    valgtPartMedKlagerett: valgtPartMedKlagerett?.identifikasjon?.id,
  };
};
