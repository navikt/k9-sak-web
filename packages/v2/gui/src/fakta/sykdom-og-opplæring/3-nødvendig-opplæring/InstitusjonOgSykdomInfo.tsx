import { BodyShort, Label, Skeleton } from '@navikt/ds-react';
import {
  useInstitusjonInfo,
  useLangvarigSykVurderingerFagsak,
  useVurdertLangvarigSykdom,
} from '../SykdomOgOpplæringQueries';
import { useContext } from 'react';
import { SykdomOgOpplæringContext } from '../FaktaSykdomOgOpplæringIndex';
import type { Period as PeriodType } from '@navikt/ft-utils';
import { Period } from '@navikt/ft-utils';
import { ICD10 } from '@navikt/diagnosekoder';

const InstitusjonOgSykdomInfo = ({ perioder }: { perioder: PeriodType[] }) => {
  const periode = perioder[0];
  const { behandlingUuid } = useContext(SykdomOgOpplæringContext);
  const { data: institusjonData, isLoading: isLoadingInstitusjon } = useInstitusjonInfo(behandlingUuid);
  const { data: langvarigSykdomData, isLoading: isLoadingLangvarigSykdom } =
    useLangvarigSykVurderingerFagsak(behandlingUuid);
  const { data: vurdertLangvarigSykdomData, isLoading: isLoadingVurdertLangvarigSykdom } =
    useVurdertLangvarigSykdom(behandlingUuid);

  if (!periode) return null;

  const redigertInstitusjonNavn = institusjonData?.vurderinger.find(vurdering =>
    vurdering.perioder.some(p => new Period(p.fom, p.tom).covers(periode)),
  )?.redigertInstitusjonNavn;

  const institusjonNavn = institusjonData?.perioder.find(v =>
    new Period(v.periode.fom, v.periode.tom).covers(periode),
  )?.institusjon;

  const diagnosekoder = langvarigSykdomData?.find(
    v => v.uuid === vurdertLangvarigSykdomData?.vurderingUuid,
  )?.diagnosekoder;

  return (
    <div className="grid grid-cols-2 gap-4 bg-[var(--ax-bg-info-moderate)] py-2.5 px-4 rounded-md">
      <div className="flex flex-col gap-2">
        <Label size="small">Institusjon:</Label>
        {isLoadingInstitusjon ? (
          <Skeleton variant="text" width="50%" height="24px" />
        ) : (
          <BodyShort size="small">{redigertInstitusjonNavn || institusjonNavn}</BodyShort>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label size="small">{diagnosekoder?.length && diagnosekoder.length > 1 ? 'Diagnoser:' : 'Diagnose:'}</Label>
        {isLoadingLangvarigSykdom || isLoadingVurdertLangvarigSykdom ? (
          <Skeleton variant="text" width="50%" height="24px" />
        ) : (
          diagnosekoder?.map((kode, index) => (
            <BodyShort size="small" key={index}>
              {ICD10.find(icd => icd.code === kode)?.text}
            </BodyShort>
          ))
        )}
      </div>
    </div>
  );
};

export default InstitusjonOgSykdomInfo;
