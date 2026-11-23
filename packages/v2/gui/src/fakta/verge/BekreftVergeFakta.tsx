import type { AksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { $AvklarVergeDto, type AvklarVergeDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/AvklarVergeDto.js';
import { InformationSquareFillIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Heading, HStack, InfoCard, Label, VStack } from '@navikt/ds-react';
import { RhfForm, RhfTextarea } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, required } from '@navikt/ft-form-validators';
import { decodeHtmlEntity } from '@navikt/ft-utils';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AksjonspunktHelpText from '../../shared/aksjonspunktHelpText/AksjonspunktHelpText.js';

export type BekreftVergeAksjonspunkt = Required<Pick<AvklarVergeDto, 'begrunnelse'>> & {
  kode: typeof AksjonspunktDefinisjon.AVKLAR_VERGE;
};

interface BekreftVergeFaktaProps {
  aksjonspunktStatus: AksjonspunktStatus | undefined;
  lagretBegrunnelse: string | undefined;
  readOnly: boolean;
  submittable: boolean;
  submitCallback: (aksjonspunkter: [BekreftVergeAksjonspunkt]) => Promise<void>;
}

interface BekreftVergeFormValues {
  begrunnelse: string;
}

const begrunnelseMaksLengde = $AvklarVergeDto.properties.begrunnelse.maxLength;
const maksLengdeBegrunnelse = maxLength(begrunnelseMaksLengde);

interface BekreftVergeSkjemaProps {
  lagretBegrunnelse: string;
  kanAvbryte: boolean;
  onSubmit: (begrunnelse: string) => Promise<void>;
  onAvbryt: () => void;
}

const BekreftVergeSkjema = ({ lagretBegrunnelse, kanAvbryte, onSubmit, onAvbryt }: BekreftVergeSkjemaProps) => {
  const formMethods = useForm<BekreftVergeFormValues>({ defaultValues: { begrunnelse: lagretBegrunnelse } });
  const { reset } = formMethods;
  const { isSubmitting } = formMethods.formState;

  // Skjemaet fylles inn på nytt når lagret begrunnelse endres, f.eks. etter lagring.
  useEffect(() => {
    reset({ begrunnelse: lagretBegrunnelse });
  }, [lagretBegrunnelse, reset]);

  const avbryt = () => {
    reset();
    onAvbryt();
  };

  return (
    <RhfForm formMethods={formMethods} onSubmit={({ begrunnelse }) => onSubmit(begrunnelse.trim())}>
      <VStack gap="space-16">
        <div className="max-w-xl">
          <RhfTextarea
            control={formMethods.control}
            name="begrunnelse"
            label="Begrunnelse"
            size="small"
            maxLength={begrunnelseMaksLengde}
            validate={[required, maksLengdeBegrunnelse, hasValidText]}
          />
        </div>
        <HStack gap="space-16">
          <Button size="small" loading={isSubmitting}>
            Bekreft og fortsett
          </Button>
          {kanAvbryte && (
            <Button size="small" variant="secondary" type="button" disabled={isSubmitting} onClick={avbryt}>
              Avbryt
            </Button>
          )}
        </HStack>
      </VStack>
    </RhfForm>
  );
};

/**
 * Bekreftelse av aksjonspunkt 5030 (Avklar verge) for k9-sak, når søker er under 18 år.
 * Bare åpent (OPPRETTET) og løst (UTFØRT) aksjonspunkt kan behandles. Andre statuser vises bare.
 */
const BekreftVergeFakta = ({
  aksjonspunktStatus: status,
  lagretBegrunnelse,
  readOnly,
  submittable,
  submitCallback,
}: BekreftVergeFaktaProps) => {
  const [redigerer, setRedigerer] = useState(false);
  const erÅpent = status === aksjonspunktStatus.OPPRETTET;
  const erUtført = status === aksjonspunktStatus.UTFØRT;
  const kanLøse = !readOnly && submittable;
  const begrunnelse = decodeHtmlEntity(lagretBegrunnelse) ?? '';
  const visSkjema = kanLøse && (erÅpent || (erUtført && redigerer));

  const lagre = async (nyBegrunnelse: string) => {
    await submitCallback([{ kode: AksjonspunktDefinisjon.AVKLAR_VERGE, begrunnelse: nyBegrunnelse }]);
    setRedigerer(false);
  };

  return (
    <VStack gap="space-16">
      <HStack gap="space-8" align="center">
        <Heading size="small" level="2">
          Verge
        </Heading>
        {erUtført && kanLøse && !redigerer && (
          <Button variant="tertiary" size="xsmall" onClick={() => setRedigerer(true)}>
            Rediger vurdering
          </Button>
        )}
      </HStack>
      {(erÅpent || erUtført) && (
        <AksjonspunktHelpText isAksjonspunktOpen={erÅpent}>{['Søker er under 18 år.']}</AksjonspunktHelpText>
      )}
      <InfoCard data-color="info" size="small">
        <InfoCard.Header icon={<InformationSquareFillIcon aria-hidden color="var(--ax-text-info-decoration)" />}>
          <InfoCard.Title as="h3">Mer om verge for mindreårige</InfoCard.Title>
        </InfoCard.Header>
        <InfoCard.Content>
          <VStack gap="space-16">
            <BodyLong size="small">
              Når søker er under 18 år, må en verge signere søknaden. For mindreårige vil det vanligvis være den eller
              de foreldrene som har foreldreansvar, du kan se dette i Modia.
            </BodyLong>
            <BodyLong size="small">
              Hvis vi ikke har signatur må du kontakte vergene, og be dem sende signert papirsøknad og førsteside for
              innsending i søkers fødselsnummer innen en frist. Hvis vi ikke får signatur fra verge, må saken henlegges
              fra Behandlingsmenyen.
            </BodyLong>
            <BodyLong size="small">
              Merk at hvis vi får signatur, må brevene i saken manuelt sendes til vergene i tillegg til søker.
            </BodyLong>
          </VStack>
        </InfoCard.Content>
      </InfoCard>
      {visSkjema && (
        <BekreftVergeSkjema
          lagretBegrunnelse={begrunnelse}
          kanAvbryte={erUtført}
          onSubmit={lagre}
          onAvbryt={() => setRedigerer(false)}
        />
      )}
      {!visSkjema && !erÅpent && (begrunnelse !== '' || erUtført) && (
        <VStack gap="space-4">
          <Label size="small">Begrunnelse</Label>
          <BodyLong size="small" className="whitespace-pre-wrap">
            {begrunnelse !== '' ? begrunnelse : 'Ingen begrunnelse er registrert.'}
          </BodyLong>
        </VStack>
      )}
    </VStack>
  );
};

export default BekreftVergeFakta;
