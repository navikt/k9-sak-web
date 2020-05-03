import React, { FunctionComponent } from 'react';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import { Undertittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import transferIcon from '@fpsak-frontend/assets/images/data-transfer-horizontal.svg';
import OverføringsdagerPanelgruppe from './OverføringsdagerPanelgruppe';
import Overføring, { OverføringsretningEnum } from '../types/Overføring';
import styles from './overføringContainer.less';

interface OverføringContainerProps {
  overføringGir: Overføring[];
  overføringFår: Overføring[];
  fordelingGir: Overføring[];
  fordelingFår: Overføring[];
  koronaoverføringGir: Overføring[];
  koronaoverføringFår: Overføring[];
  behandlingId: number;
  behandlingVersjon: number;
  oppdaterForm(felt, nyVerdi): void;
}

const OverføringContainer: FunctionComponent<OverføringContainerProps> = ({
  overføringFår,
  overføringGir,
  fordelingFår,
  fordelingGir,
  koronaoverføringFår,
  koronaoverføringGir,
  behandlingId,
  behandlingVersjon,
  oppdaterForm,
}) => {
  return (
    <div className={styles.container}>
      <Undertittel tag="h3" className={styles.tittel}>
        <Image src={transferIcon} />
        <FormattedMessage id="FaktaRammevedtak.Overføringer.Tittel" />
      </Undertittel>
      <OverføringsdagerPanelgruppe
        overføringer={overføringFår}
        fordelinger={fordelingFår}
        koronaoverføringer={koronaoverføringFår}
        retning={OverføringsretningEnum.INN}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        oppdaterForm={oppdaterForm}
      />
      <VerticalSpacer thirtyTwoPx />
      <OverføringsdagerPanelgruppe
        overføringer={overføringGir}
        fordelinger={fordelingGir}
        koronaoverføringer={koronaoverføringGir}
        retning={OverføringsretningEnum.UT}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        oppdaterForm={oppdaterForm}
      />
    </div>
  );
};

export default OverføringContainer;
