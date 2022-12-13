import { Box, Margin, DetailView, LabelledContent, LinkButton, AssessedBy } from '@navikt/ft-plattform-komponenter';
import React, { useContext } from 'react';
import { GjennomgaaOpplaeringVurdering, Vurderingsresultat } from '@k9-sak-web/types';
import { Calender } from '@navikt/ds-icons';
import { FaktaOpplaeringContext } from '@k9-sak-web/behandling-opplaeringspenger/src/panelDefinisjoner/faktaPaneler/OpplaeringFaktaPanelDef';
import styles from './GjennomgaaOpplaeringFerdigVisning.modules.css';

interface OwnProps {
  vurdering: GjennomgaaOpplaeringVurdering;
  rediger: () => void;
}

const GjennomgaaOpplaeringFerdigVisning = ({ vurdering, rediger }: OwnProps) => {
  const { readOnly } = useContext(FaktaOpplaeringContext);

  return (
    <DetailView
      title="Vurdering av opplæringen"
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
          // eslint-disable-next-line max-len
          label="Gjør en vurdering av om det er opplæring i perioden som følge av § 9-14."
          content={vurdering.begrunnelse}
        />
      </Box>
      <Box marginTop={Margin.xLarge}>
        <LabelledContent
          label="Er det opplæring i perioden?"
          content={
            [Vurderingsresultat.GODKJENT_AUTOMATISK, Vurderingsresultat.GODKJENT_MANUELT].includes(vurdering.resultat)
              ? 'Ja'
              : 'Nei'
          }
        />
      </Box>
    </DetailView>
  );
};

export default GjennomgaaOpplaeringFerdigVisning;
