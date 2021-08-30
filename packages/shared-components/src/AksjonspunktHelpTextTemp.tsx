import React, { ReactNode } from 'react';

import AksjonspunktHelpTextHTML from './AksjonspunktHelpTextHTML';
import AksjonspunktHelpText from './AksjonspunktHelpText';

interface OwnProps {
  children: string[] | ReactNode[];
  isAksjonspunktOpen: boolean;
}

/**
 * TODO (TOR) Dette er ein midlertidig komponent som byttar mellom to komponentar. Er ikkje bestemt korleis dette faktisk skal sjå ut enno.
 */
const AksjonspunktHelpTextTemp = ({ isAksjonspunktOpen, children }: OwnProps) => (
  <>
    {isAksjonspunktOpen && <AksjonspunktHelpTextHTML>{children}</AksjonspunktHelpTextHTML>}
    {!isAksjonspunktOpen && <AksjonspunktHelpText isAksjonspunktOpen={false}>{children}</AksjonspunktHelpText>}
  </>
);

export default AksjonspunktHelpTextTemp;
