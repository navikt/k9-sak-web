import { Alert } from '@navikt/ds-react';
import React, { type JSX } from 'react';
import ContainerContract from '../types/ContainerContract';
import Komponenter from '../types/Komponenter';
import AleneOmOmsorgen from './components/alene-om-omsorgen/AleneOmOmsorgen';
import KorrigerePerioder from './components/korrigere-perioder/KorrigerePerioder';
import Omsorg from './components/omsorg/Omsorg';
import VilkarKroniskSyktBarn from './components/vilkar-kronisk-sykt-barn/VilkarKroniskSyktBarn';
import VilkarMidlertidigAlene from './components/vilkar-midlertidig-alene/VilkarMidlertidigAlene';
import ContainerContext from './context/ContainerContext';
import styles from './global.module.css';

interface MainComponentProps {
  containerData: ContainerContract;
}

const OmsorgsdagerContainer = ({ containerData }: MainComponentProps): JSX.Element => {
  let innhold;
  switch (containerData.visKomponent) {
    case Komponenter.KORRIGERE_PERIODER:
      innhold = <KorrigerePerioder {...containerData.props} />;
      break;
    case Komponenter.VILKAR_KRONISK_SYKT_BARN:
      innhold = <VilkarKroniskSyktBarn {...containerData.props} />;
      break;
    case Komponenter.VILKAR_MIDLERTIDIG_ALENE:
      innhold = <VilkarMidlertidigAlene {...containerData.props} />;
      break;
    case Komponenter.OMSORG:
      innhold = <Omsorg {...containerData.props} />;
      break;
    case Komponenter.ALENE_OM_OMSORGEN:
      innhold = <AleneOmOmsorgen {...containerData.props} />;
      break;
    default:
      innhold = (
        <Alert size="small" variant="error">
          Noe gikk galt, vennligst prøv igjen senere
        </Alert>
      );
  }

  return (
    <ContainerContext.Provider value={containerData}>
      <div className={styles.global}>{innhold}</div>
    </ContainerContext.Provider>
  );
};

export default OmsorgsdagerContainer;
