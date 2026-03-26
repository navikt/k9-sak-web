import { ung_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { BodyShort, Box, Button, Heading, VStack } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  aksjonspunkter: AksjonspunktDto[];
  submitCallback: (
    data: Array<{ kode: AksjonspunktDto['definisjon']; begrunnelse: string }>,
    aksjonspunkt: Array<Pick<AksjonspunktDto, 'definisjon'>>,
  ) => Promise<unknown>;
}

export const AktivitetspengerInngangsvilkår = ({ aksjonspunkter, submitCallback }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const vurderBistandsvilkår = aksjonspunkter.find(
    ap =>
      ap.definisjon === AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR &&
      ap.status === ung_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.OPPRETTET,
  );
  const lokalkontorForeslårVilkår = aksjonspunkter.find(
    ap =>
      ap.definisjon === AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR &&
      ap.status === ung_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.OPPRETTET,
  );
  const lokalkontorBeslutter = aksjonspunkter.find(
    ap =>
      ap.definisjon === AksjonspunktDefinisjon.LOKALKONTOR_BESLUTTER_VILKÅR &&
      ap.status === ung_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.OPPRETTET,
  );

  const harAksjonspunkt = !!vurderBistandsvilkår || !!lokalkontorForeslårVilkår || !!lokalkontorBeslutter;

  const alleAksjonspunkterErVurdert =
    aksjonspunkter.every(ap => ap.status === ung_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.UTFØRT) ||
    !harAksjonspunkt;

  const handleSubmit = async () => {
    setIsLoading(true);
    const aksjonspunkt = vurderBistandsvilkår ?? lokalkontorForeslårVilkår ?? lokalkontorBeslutter;
    if (!aksjonspunkt) {
      return;
    }
    const payload = {
      kode: aksjonspunkt.definisjon,
      begrunnelse: 'fordi',
    };
    try {
      await submitCallback([payload], [aksjonspunkt]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box width="fit-content">
      <Heading size="medium" level="1" spacing>
        Inngangsvilkår
      </Heading>
      <VStack gap="space-16">
        {vurderBistandsvilkår && (
          <>
            <BodyShort weight="semibold">Vurder bistandsvilkår</BodyShort>
            <BodyShort>Du må ha rolle LOKALKONTOR_SAKSBEHANDLER</BodyShort>
          </>
        )}
        {lokalkontorForeslårVilkår && (
          <>
            <BodyShort weight="semibold">Lokalkontor foreslår vilkår</BodyShort>
            <BodyShort>Du må ha rolle LOKALKONTOR_SAKSBEHANDLER</BodyShort>
          </>
        )}
        {lokalkontorBeslutter && (
          <>
            <BodyShort weight="semibold">Lokalkontor beslutter vilkår</BodyShort>
            <BodyShort>Du må ha rolle LOKALKONTOR_BESLUTTER</BodyShort>
          </>
        )}
        {alleAksjonspunkterErVurdert && <BodyShort>Alle aksjonspunkter er vurdert</BodyShort>}
        {harAksjonspunkt && !alleAksjonspunkterErVurdert && (
          <Button variant="primary" size="small" onClick={handleSubmit} loading={isLoading}>
            Bekreft
          </Button>
        )}
      </VStack>
    </Box>
  );
};
