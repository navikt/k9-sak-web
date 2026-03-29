import { ung_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { BodyShort, Box, Button, Heading, VStack } from '@navikt/ds-react';
import { useState } from 'react';

const relevanteAksjonspunktDefinisjoner = [
  AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR,
  AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR,
  AksjonspunktDefinisjon.LOKALKONTOR_BESLUTTER_VILKÅR,
];

const aksjonspunktErÅpent = (ap?: AksjonspunktDto) =>
  ap ? ap.status !== ung_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.UTFØRT : false;

interface Props {
  aksjonspunkter: AksjonspunktDto[];
  submitCallback: (
    data: Array<{ kode: AksjonspunktDto['definisjon']; begrunnelse: string }>,
    aksjonspunkt: Array<Pick<AksjonspunktDto, 'definisjon'>>,
  ) => Promise<unknown>;
}

export const AktivitetspengerInngangsvilkår = ({ aksjonspunkter, submitCallback }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const relevanteAksjonspunkter = aksjonspunkter.filter(ap =>
    relevanteAksjonspunktDefinisjoner.some(def => def === ap.definisjon),
  );
  const vurderBistandsvilkår = relevanteAksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR,
  );
  const lokalkontorForeslårVilkår = relevanteAksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR,
  );
  const lokalkontorBeslutter = relevanteAksjonspunkter.find(
    ap => ap.definisjon === AksjonspunktDefinisjon.LOKALKONTOR_BESLUTTER_VILKÅR,
  );

  const harAksjonspunkt = !!vurderBistandsvilkår || !!lokalkontorForeslårVilkår || !!lokalkontorBeslutter;

  const alleAksjonspunkterErVurdert =
    harAksjonspunkt &&
    relevanteAksjonspunkter.every(ap => ap.status === ung_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.UTFØRT);

  const handleSubmit = async () => {
    setIsLoading(true);
    const aksjonspunkt = lokalkontorBeslutter ?? lokalkontorForeslårVilkår ?? vurderBistandsvilkår;
    if (!aksjonspunkt) {
      return;
    }
    const payload = {
      kode: aksjonspunkt.definisjon,
      begrunnelse: 'fordi',

      aksjonspunktGodkjenningDtos: lokalkontorBeslutter
        ? [{ aksjonspunktKode: vurderBistandsvilkår?.definisjon, begrunnelse: 'OK', godkjent: true }]
        : undefined,
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
        {vurderBistandsvilkår && aksjonspunktErÅpent(vurderBistandsvilkår) && (
          <>
            <BodyShort weight="semibold">Vurder bistandsvilkår</BodyShort>
          </>
        )}
        {lokalkontorForeslårVilkår && aksjonspunktErÅpent(lokalkontorForeslårVilkår) && (
          <>
            <BodyShort weight="semibold">Lokalkontor foreslår vilkår</BodyShort>
          </>
        )}
        {lokalkontorBeslutter && aksjonspunktErÅpent(lokalkontorBeslutter) && (
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
