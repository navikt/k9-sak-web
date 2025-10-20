import React from 'react';
import Diagnosekode from '../../types/Diagnosekode';

type DiagnosekodeWrapper = { koder: Array<Diagnosekode>; hasLoaded: boolean };

const DiagnosekodeContext = React.createContext<(diagnosekodeState: DiagnosekodeWrapper) => void | null>(null);
export default DiagnosekodeContext;
