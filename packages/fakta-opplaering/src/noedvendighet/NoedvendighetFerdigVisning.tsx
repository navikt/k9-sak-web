import { Box, Margin, DetailView, LabelledContent, LinkButton, AssessedBy } from '@navikt/ft-plattform-komponenter';
import React, { useContext } from 'react';
import { NoedvendighetVurderingMedPerioder, Vurderingsresultat } from '@k9-sak-web/types';
import { Calender } from '@navikt/ds-icons';
import { FaktaOpplaeringContext } from '@k9-sak-web/behandling-opplaeringspenger/src/panelDefinisjoner/faktaPaneler/OpplaeringFaktaPanelDef';
import { useIntl } from 'react-intl';
import styles from './noedvendighetFerdigVisning.modules.css';

interface OwnProps {
  vurdering: NoedvendighetVurderingMedPerioder;
  rediger: () => void;
}

const NoedvendighetFerdigVisning = ({ vurdering, rediger }: OwnProps) => {
  const { readOnly } = useContext(FaktaOpplaeringContext);
  const intl = useIntl();

  return (
    <DetailView
      title="Vurdering av noedvendighet"
      // eslint-disable-next-line react/jsx-no-useless-fragment
      contentAfterTitleRenderer={() =>
        !readOnly ? (
          <LinkButton onClick={rediger} className={styles.endreLink}>
            Endre vurdering
          </LinkButton>
        ) : null
      }
    >
      {vurdering.perioder.map(periode => (
        <div>
          <Calender /> <span>{periode.prettifyPeriod()}</span>
        </div>
      ))}
      <Box marginTop={Margin.xLarge}>
        <LabelledContent
          // eslint-disable-next-line max-len
          label={intl.formatMessage({ id: 'noedvendighet.vurdering.label' })}
          content={vurdering.begrunnelse}
        />
      </Box>
      <Box marginTop={Margin.xLarge}>
        <LabelledContent
          label={intl.formatMessage({ id: 'noedvendighet.noedvendigOpplaering.label' })}
          content={[Vurderingsresultat.GODKJENT].includes(vurdering.resultat) ? 'Ja' : 'Nei'}
        />
      </Box>
    </DetailView>
  );
};

export default NoedvendighetFerdigVisning;
