import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import { Vurderingsresultat } from '@k9-sak-web/types';

import { Box, Margin, DetailView, LabelledContent, LinkButton, AssessedBy } from '@navikt/ft-plattform-komponenter';
import { Calender } from '@navikt/ds-icons';
import { FaktaOpplaeringContext } from '@k9-sak-web/behandling-opplaeringspenger/src/panelDefinisjoner/faktaPaneler/OpplaeringFaktaPanelDef';
import { ReisetidVurdering } from './ReisetidTypes';
import styles from './reisetidFerdigVisning.modules.css';

interface OwnProps {
  vurdering: ReisetidVurdering;
  rediger: () => void;
}

const ReisetidFerdigVisning = ({ vurdering, rediger }: OwnProps) => {
  const { readOnly } = useContext(FaktaOpplaeringContext);
  const intl = useIntl();

  return (
    <DetailView
      title="Vurdering av opplæring"
      // eslint-disable-next-line react/jsx-no-useless-fragment
      contentAfterTitleRenderer={() =>
        !readOnly ? (
          <LinkButton onClick={rediger} className={styles.endreLink}>
            Endre vurdering
          </LinkButton>
        ) : null
      }
    >
      <div>
        <Calender /> <span>{vurdering.periode.prettifyPeriod()}</span>
      </div>
      <Box marginTop={Margin.xLarge}>
        <LabelledContent
          label={intl.formatMessage({ id: 'opplaering.vurdering.label' })}
          content={vurdering.begrunnelse}
        />
      </Box>
      <Box marginTop={Margin.xLarge}>
        <LabelledContent
          label={intl.formatMessage({ id: 'opplaering.gjennomfoertOpplaering.label' })}
          content={[Vurderingsresultat.GODKJENT].includes(vurdering.resultat) ? 'Ja' : 'Nei'}
        />
      </Box>
      <Box marginTop={Margin.xLarge}>
        <LabelledContent
          label={intl.formatMessage({ id: 'opplaering.perioder.label' })}
          content={vurdering.periode.prettifyPeriod()}
        />
      </Box>
    </DetailView>
  );
};

export default ReisetidFerdigVisning;
