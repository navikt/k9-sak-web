import React from 'react';
import {DiagnosekodeWrapper} from '../../types/Diagnosekode'

const DiagnosekodeContext = React.createContext<(diagnosekodeState: DiagnosekodeWrapper) => void | null>(null);
export default DiagnosekodeContext;
