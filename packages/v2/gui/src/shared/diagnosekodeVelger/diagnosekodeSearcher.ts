// This module is here to load and initialize a DiagnosekodeSearcher instance the replaces the external diagnosekode-api service.
// Instead of querying the external service we load all diagnose codes into a searcher class instance from the @navikt/diagnosekoder
// package, and do the lookup of diagnose codes agains this instance directly.
//
// This import is a 1.3MB package, so it is set as a separate "manualOutputChunk" in vite.config.js
// Should then not impact loading time too much since it will be cached and only reloaded on first load, or once a year.
import { ICD10, DiagnosekodeSearcher, type ICD10Diagnosekode } from '@navikt/diagnosekoder';

export type ICD10DiagnosekodeSearcher = DiagnosekodeSearcher<ICD10Diagnosekode>;

export const initDiagnosekodeSearcher = (pageSize: number): ICD10DiagnosekodeSearcher =>
  new DiagnosekodeSearcher(ICD10, pageSize);
