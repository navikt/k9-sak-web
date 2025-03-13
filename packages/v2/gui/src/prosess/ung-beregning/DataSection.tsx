import { CalendarIcon, InformationSquareIcon, SackKronerIcon } from '@navikt/aksel-icons';
import { Bleed, BodyShort, HelpText, HGrid, HStack, Label, ProgressBar, ReadMore, VStack } from '@navikt/ds-react';

const DataBox = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg bg-[#EEF6FC] px-4 py-5 mb-4">
    <VStack gap="4">{children}</VStack>
  </div>
);

export const DataSection = () => (
  <HGrid gap="5" columns={3}>
    <DataBox>
      <HStack gap="2" className="ml-0.5">
        <InformationSquareIcon color="#417DA0" fontSize="1.5rem" />
        <Label as="p">Nøkkelinformasjon</Label>
      </HStack>
      <HStack gap="4">
        <BodyShort size="small">
          <b>Startdato:</b> xxx
        </BodyShort>
        <BodyShort size="small">
          <b>Sluttdato:</b> xxx
        </BodyShort>
      </HStack>
    </DataBox>
    <DataBox>
      <HStack gap="2" className="ml-0.5">
        <CalendarIcon color="#417DA0" fontSize="1.5rem" />
        <Label as="p">Dager i ungdomsprogram</Label>
      </HStack>
      <HStack gap="2">
        <BodyShort>Dager utbetalt</BodyShort>
        <HelpText title="Hvor kommer dette fra?">Informasjonen er hentet fra X sin statistikk fra 2021</HelpText>
      </HStack>
      <div>
        <HStack justify="space-between">
          <BodyShort className="mb-2" size="small" id="progress-bar-label-medium">
            86 av 260
          </BodyShort>
          <BodyShort className="mb-2" size="small">
            174 dager igjen
          </BodyShort>
        </HStack>
        <ProgressBar value={86} valueMax={260} size="medium" aria-labelledby="progress-bar-label-medium" />
      </div>
    </DataBox>
    <DataBox>
      <HStack gap="2" className="ml-0.5">
        <SackKronerIcon color="#417DA0" fontSize="1.5rem" />
        <Label as="p">Siste utbetaling</Label>
      </HStack>
      <BodyShort>16 500 kr</BodyShort>
      <BodyShort size="small">10. februar til kontonummer xxxxxxxx</BodyShort>
      <Bleed marginInline="4" asChild>
        <div className="h-[1px] bg-[#C0D6E4]" />
      </Bleed>
      <ReadMore header="Vis utregning">Utregning her</ReadMore>
    </DataBox>
  </HGrid>
);
