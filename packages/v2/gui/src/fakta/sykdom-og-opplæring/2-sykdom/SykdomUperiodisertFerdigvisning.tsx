import { BodyLong, BodyShort, Button, Tag } from '@navikt/ds-react';
import { LabelledContent } from '../../../shared/labelled-content/LabelledContent';
import type { UperiodisertSykdom } from './SykdomUperiodisertForm';
import { VurdertAv } from '../../../shared/vurdert-av/VurdertAv';
import { ICD10 } from '@navikt/diagnosekoder';
import { Lovreferanse } from '../../../shared/lovreferanse/Lovreferanse';
import { useContext } from 'react';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import { useVurdertLangvarigSykdom } from '../SykdomOgOpplæringQueries';

const SykdomUperiodisertFerdigvisning = ({ vurdering }: { vurdering: UperiodisertSykdom }) => {
  const { behandlingUuid, løsAksjonspunkt9301 } = useContext(SykdomOgOpplæringContext);
  const { data: vurderingBruktIAksjonspunkt } = useVurdertLangvarigSykdom(behandlingUuid);

  const sykdomGodkjentText = () => {
    if (vurdering.godkjent === 'ja') {
      return 'Ja';
    }
    if (vurdering.godkjent === 'nei') {
      return 'Nei';
    }
    if (vurdering.godkjent === 'mangler_dokumentasjon') {
      return 'Mangler dokumentasjon';
    }
    return '';
  };
  return (
    <div className="flex flex-col gap-4">
      <div>
        <LabelledContent
          label={
            <>
              Vurder om barnet har en funksjonshemning eller en langvarig sykdom antatt å vare i mer enn ett år som
              følge av <Lovreferanse>§ 9-14</Lovreferanse>.
            </>
          }
          indentContent
          size="small"
          content={
            <BodyLong size="small" className="whitespace-pre-wrap">
              {vurdering.begrunnelse}
            </BodyLong>
          }
        />
        <VurdertAv ident={vurdering.vurdertAv} date={vurdering.vurdertTidspunkt} size="small" />
      </div>
      <LabelledContent
        label="Har barnet en langvarig funksjonshemming eller langvarig sykdom?"
        size="small"
        content={<BodyShort size="small">{sykdomGodkjentText()}</BodyShort>}
      />
      {vurdering.diagnosekoder && vurdering.diagnosekoder.length > 0 && (
        <LabelledContent
          label="Hvilke diagnoser har barnet?"
          size="small"
          content={<Diagnoser diagnosekoder={vurdering.diagnosekoder} />}
        />
      )}
      {vurderingBruktIAksjonspunkt?.vurderingUuid !== vurdering.uuid && (
        <div>
          <Button size="small" variant="primary" onClick={() => løsAksjonspunkt9301(vurdering.uuid)}>
            Bruk denne sykdomsvurderingen
          </Button>
        </div>
      )}
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
          <Tag size="small" key={diagnose} variant="neutral-moderate" className="border-none rounded">
            {diagnosekode?.code} - {diagnosekode?.text}
          </Tag>
        );
      })}
    </div>
  );
};

export default SykdomUperiodisertFerdigvisning;
