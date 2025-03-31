import { BodyLong, BodyShort, Tag } from '@navikt/ds-react';
import { LabelledContent } from '../../../shared/LabelledContent/LabelledContent';
import type { UperiodisertSykdom } from './SykdomUperiodisertForm';
import { VurdertAv } from '../../../shared/vurdert-av/VurdertAv';
import { ICD10 } from '@navikt/diagnosekoder';

const SykdomUperiodisertFerdigvisning = ({ vurdering }: { vurdering: UperiodisertSykdom }) => {
  return (
    <div className="flex flex-col gap-4">
      <LabelledContent
        label="Vurder om barnet har en funksjonshemning eller en langvarig sykdom antatt å vare i mer enn ett år som følge av § 9-14."
        indentContent
      >
        <BodyLong className="whitespace-pre-wrap">{vurdering.begrunnelse}</BodyLong>
      </LabelledContent>
      <VurdertAv ident={'Trollmannen Gandalf🧙'} date="2025-03-28" />
      <LabelledContent label="Har barnet en langvarig funksjonshemming eller langvarig sykdom?">
        <BodyShort>{vurdering.godkjent ? 'Ja' : 'Nei'}</BodyShort>
      </LabelledContent>
      <LabelledContent label="Diagnose(r)">
        <Diagnoser diagnosekoder={vurdering.diagnosekoder} />
      </LabelledContent>
    </div>
  );
};

const Diagnoser = ({ diagnosekoder = [] }: { diagnosekoder?: string[] }) => {
  if (diagnosekoder.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {diagnosekoder.map(diagnose => {
        const diagnosekode = ICD10.find(d => d.code === diagnose);
        return (
          <Tag key={diagnose} variant="info" className="border-none rounded-">
            {diagnosekode?.code} - {diagnosekode?.text}
          </Tag>
        );
      })}
    </div>
  );
};

export default SykdomUperiodisertFerdigvisning;
