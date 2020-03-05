import React, { FunctionComponent } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { useIntl } from 'react-intl';
import { Arbeidsgiver } from './UttakFaktaIndex2';
import UttakFaktaForm from './UttakFaktaForm2';
import styles from './uttakFaktaPanel.less';

interface UttakFaktaPanelProps {
  behandlingId: number;
  behandlingVersjon: number;
  arbeidsgivere: Arbeidsgiver[];
  submitCallback: (values: Arbeidsgiver[]) => void;
}

const UttakFaktaPanel: FunctionComponent<UttakFaktaPanelProps> = props => {
  const intl = useIntl();
  return (
    <Ekspanderbartpanel
      tittel={intl.formatMessage({ id: 'UttakInfoPanel.FaktaUttak' })}
      className={styles.uttakFaktaPanel}
    >
      <UttakFaktaForm {...props} />
    </Ekspanderbartpanel>
  );
};

export default UttakFaktaPanel;
