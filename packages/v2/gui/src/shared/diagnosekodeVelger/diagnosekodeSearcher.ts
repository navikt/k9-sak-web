// This module is here to load and initialize a DiagnosekodeSearcher instance the replaces the external diagnosekode-api service.
// Instead of querying the external service we load all diagnose codes into a searcher class instance from the @navikt/diagnosekoder
// package, and do the lookup of diagnose codes agains this instance directly.
//
// This import is a 1.3MB package, so we import it asynchronously as a separate bundle.
// Should then not impact loading time too much since it will be cached and only reloaded on first load, or once a year.

import type { DiagnosekodeSearcher, ICD10Diagnosekode } from '@navikt/diagnosekoder';

export type DiagnosekodeSearcherPromise = Promise<DiagnosekodeSearcher<ICD10Diagnosekode>>;

export const initDiagnosekodeSearcher = async (pageSize: number): DiagnosekodeSearcherPromise =>
  import('@navikt/diagnosekoder').then(
    diagnosekodeModule => new diagnosekodeModule.DiagnosekodeSearcher(diagnosekodeModule.ICD10, pageSize),
  );
