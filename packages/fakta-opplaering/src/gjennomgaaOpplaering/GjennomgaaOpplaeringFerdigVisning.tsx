import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import { GjennomgaaOpplaeringVurdering, Vurderingsresultat } from '@k9-sak-web/types';
import { Box, Margin, DetailView, LabelledContent, LinkButton, AssessedBy } from '@navikt/ft-plattform-komponenter';
import { Calender } from '@navikt/ds-icons';
import { FaktaOpplaeringContext } from '@k9-sak-web/behandling-opplaeringspenger/src/panelDefinisjoner/faktaPaneler/OpplaeringFaktaPanelDef';
import styles from './GjennomgaaOpplaeringFerdigVisning.modules.css';

interface OwnProps {
  vurdering: GjennomgaaOpplaeringVurdering;
  rediger: () => void;
}

const GjennomgaaOpplaeringFerdigVisning = ({ vurdering, rediger }: OwnProps) => {
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
        <Calender /> <span>{vurdering.opplæring.prettifyPeriod()}</span>
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
          content={vurdering.opplæring.prettifyPeriod()}
        />
      </Box>
    </DetailView>
  );
};

export default GjennomgaaOpplaeringFerdigVisning;
