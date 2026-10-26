import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { BehandlingStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingStatus.js';
import { ChevronDownIcon, ChevronUpIcon, InformationSquareFillIcon, PencilIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, HStack, InfoCard, VStack } from '@navikt/ds-react';
import dayjs from 'dayjs';
import { useEffect, useId, useRef, useState } from 'react';
import { LabelledContent } from '../../../shared/labelled-content/LabelledContent.js';
import { isAksjonspunktOpen } from '../../../utils/aksjonspunktUtils.js';
import { useUttakContext } from '../context/UttakContext.js';
import styles from './EndringsdatoInfostripe.module.css';

interface EndringsdatoInfostripeProps {
  virkningsdato: string;
  redigerVirkningsdato: boolean;
  redigerVirkningsdatoFunc: () => void;
}

const EndringsdatoInfostripe = ({
  virkningsdato,
  redigerVirkningsdato,
  redigerVirkningsdatoFunc,
}: EndringsdatoInfostripeProps) => {
  const { readOnly, behandling, aksjonspunkter } = useUttakContext();
  const [visAksjonspunkt, setVisAksjonspunkt] = useState(false);
  const innholdId = useId();
  const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK);
  const formatertVirkningsdato = dayjs(virkningsdato).format('DD.MM.YYYY');
  const kanVisesAksjonspunkt =
    aksjonspunkt !== undefined && !isAksjonspunktOpen(aksjonspunkt.status) && !redigerVirkningsdato;
  const erÅpen = kanVisesAksjonspunkt && visAksjonspunkt;
  const kanRedigere = !readOnly && behandling.status !== BehandlingStatus.AVSLUTTET;
  const infostripeRef = useRef<HTMLDivElement>(null);
  const varIRedigering = useRef(redigerVirkningsdato);

  // Når redigering avbrytes skal saksbehandler tilbake til lesevisningen i infostripen
  useEffect(() => {
    if (varIRedigering.current && !redigerVirkningsdato && visAksjonspunkt) {
      infostripeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    varIRedigering.current = redigerVirkningsdato;
  }, [redigerVirkningsdato, visAksjonspunkt]);

  return (
    <InfoCard data-color="info" size="small" ref={infostripeRef}>
      <InfoCard.Header className={erÅpen ? styles.headerAapen : undefined}>
        <HStack align="center" gap="space-8" wrap={false} paddingBlock="space-8" className="w-full">
          <InformationSquareFillIcon aria-hidden fontSize="1.5rem" className={styles.ikon} />
          <BodyLong size="small" className={styles.tekst}>
            <strong>Endringer fra {formatertVirkningsdato}:</strong> Etter denne datoen er det endring i hvordan
            utbetalingsgrad settes for ikke yrkesaktiv, kun ytelse og ny arbeidsaktivitet.
          </BodyLong>
          {kanVisesAksjonspunkt && (
            <Button
              variant="secondary"
              data-color="accent"
              size="small"
              icon={visAksjonspunkt ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
              iconPosition="right"
              className={styles.visKnapp}
              aria-expanded={visAksjonspunkt}
              aria-controls={visAksjonspunkt ? innholdId : undefined}
              onClick={() => setVisAksjonspunkt(prev => !prev)}
            >
              {visAksjonspunkt ? 'Skjul aksjonspunkt' : 'Vis aksjonspunkt'}
            </Button>
          )}
        </HStack>
      </InfoCard.Header>
      {erÅpen && (
        <InfoCard.Content id={innholdId} className={styles.innhold} data-color="info">
          <VStack gap="space-28" align="start">
            <LabelledContent
              label="Aksjonspunkt:"
              size="small"
              content="Vurder hvilken dato endringer i uttak skal gjelde fra"
            />
            <LabelledContent label="Endringsdato" size="small" content={formatertVirkningsdato} />
            {aksjonspunkt.begrunnelse && (
              <LabelledContent label="Begrunnelse" size="small" content={aksjonspunkt.begrunnelse} indentContent />
            )}
            {kanRedigere && (
              <Button
                variant="tertiary"
                size="small"
                data-color="accent"
                icon={<PencilIcon aria-hidden />}
                onClick={redigerVirkningsdatoFunc}
              >
                Rediger vurdering
              </Button>
            )}
          </VStack>
        </InfoCard.Content>
      )}
    </InfoCard>
  );
};

export default EndringsdatoInfostripe;
