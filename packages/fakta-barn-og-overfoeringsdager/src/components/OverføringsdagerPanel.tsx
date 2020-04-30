import React, { FunctionComponent, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';
import { FlexRow } from '@fpsak-frontend/shared-components/index';
// import { FieldArray } from 'redux-form';
import Overføring, {
  Overføringsretning,
  OverføringsretningEnum,
  Overføringstype,
  OverføringstypeEnum,
} from '../types/Overføring';
// import Overføringsrader from './Overføringsrader';
import Pil from './Pil';
import OverføringsraderForm from './OverføringsraderForm';

interface OverføringsdagerPanelProps {
  type: Overføringstype;
  retning: Overføringsretning;
  overføringer: Overføring[];
  behandlingId: number;
  behandlingVersjon: number;
}

export const typeTilTekstIdMap = {
  [OverføringstypeEnum.OVERFØRING]: 'FaktaRammevedtak.Overføringsdager.Overføring',
  [OverføringstypeEnum.FORDELING]: 'FaktaRammevedtak.Overføringsdager.Fordeling',
  [OverføringstypeEnum.KORONAOVERFØRING]: 'FaktaRammevedtak.Overføringsdager.Koronaoverføring',
};

const renderTittel = (type, retning, totaltAntallDager) => (
  <FlexRow childrenMargin>
    <span>
      <FormattedMessage id="FaktaRammevedtak.Overføringsdager.AntallDager" values={{ totaltAntallDager }} />
      <FormattedMessage
        id={
          retning === OverføringsretningEnum.INN
            ? 'FaktaRammevedtak.Overføringsdager.Inn'
            : 'FaktaRammevedtak.Overføringsdager.Ut'
        }
      />
    </span>
    <Pil retning={retning} />
    <span>
      <FormattedMessage id={typeTilTekstIdMap[type]} />
    </span>
  </FlexRow>
);

const summerDager = (overføringer: Overføring[]): number =>
  overføringer.reduce((sum, { antallDager }) => sum + antallDager, 0);

const OverføringsdagerPanel: FunctionComponent<OverføringsdagerPanelProps> = ({
  type,
  retning,
  behandlingId,
  behandlingVersjon,
  overføringer,
}) => {
  // const feltnavn = useMemo(() => {
  //   const retningstekst = retning === OverføringsretningEnum.INN ? 'Får' : 'Gir';
  //   return `${type}${retningstekst}`;
  // }, [type, retning]);
  const totaltAntallDager = useMemo(() => summerDager(overføringer), [overføringer]);

  return (
    <EkspanderbartPanel tittel={renderTittel(type, retning, totaltAntallDager)}>
      <OverføringsraderForm
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        retning={retning}
        type={type}
        oppdaterOverføringer={() => {}}
        initialValues={overføringer}
      />
    </EkspanderbartPanel>
  );
  // return (
  //   <EkspanderbartPanel tittel={renderTittel(type, retning, totaltAntallDager)}>
  //     <FlexRow childrenMargin>
  //       <FieldArray name={feltnavn} component={Overføringsrader} props={{ type }} />
  //     </FlexRow>
  //   </EkspanderbartPanel>
  // );
};

export default OverføringsdagerPanel;
