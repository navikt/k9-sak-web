import { BodyShort } from '@navikt/ds-react';
import type { Aktørinfo } from './Aktørinfo';
import AktoerGrid from './components/AktoerGrid';

interface OwnProps {
  valgtAktorId: string;
  aktorInfo?: Aktørinfo;
}

const AktorSakIndex = ({ valgtAktorId, aktorInfo }: OwnProps) => (
  <>
    {aktorInfo && <AktoerGrid aktorInfo={aktorInfo} />}
    {!aktorInfo && <BodyShort size="small">{`Ugyldig aktørId: ${valgtAktorId}`}</BodyShort>}
  </>
);

export default AktorSakIndex;
