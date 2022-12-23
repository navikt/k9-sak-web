import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { Box, Margin, DetailView, LabelledContent, LinkButton, AssessedBy } from '@navikt/ft-plattform-komponenter';

import { FaktaOpplaeringContext } from '@k9-sak-web/behandling-opplaeringspenger/src/panelDefinisjoner/faktaPaneler/OpplaeringFaktaPanelDef';
import { ReisetidVurdering } from './ReisetidTypes';
import FraSoeknad from './FraSoeknad';
import BeskrivelseFraSoeker from './BeskrivelseFraSoeker';
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
      title="Vurdering av reisetid"
      // eslint-disable-next-line react/jsx-no-useless-fragment
      contentAfterTitleRenderer={() =>
        !readOnly ? (
          <LinkButton onClick={rediger} className={styles.endreLink}>
            Endre vurdering
          </LinkButton>
        ) : null
      }
    >
      <BeskrivelseFraSoeker vurdering={vurdering} />
      <Box marginTop={Margin.xLarge}>
        {vurdering.til ? (
          <LabelledContent
            label={intl.formatMessage({ id: 'reisetid.foersteDag' })}
            content={
              <FraSoeknad>
                {dayjs(vurdering.perioderFraSoeknad.opplæringPeriode.fom).format(DDMMYYYY_DATE_FORMAT)}
              </FraSoeknad>
            }
          />
        ) : (
          <LabelledContent
            label={intl.formatMessage({ id: 'reisetid.sisteDag' })}
            content={
              <FraSoeknad>
                {dayjs(vurdering.perioderFraSoeknad.opplæringPeriode.tom).format(DDMMYYYY_DATE_FORMAT)}
              </FraSoeknad>
            }
          />
        )}
      </Box>
      <Box marginTop={Margin.xLarge}>
        {vurdering.til ? (
          <LabelledContent
            label={intl.formatMessage({ id: 'reisetid.avreisedato' })}
            content={
              <FraSoeknad>
                {dayjs(vurdering.perioderFraSoeknad.reisetidTil.fom).format(DDMMYYYY_DATE_FORMAT)}
              </FraSoeknad>
            }
          />
        ) : (
          <LabelledContent
            label={intl.formatMessage({ id: 'reisetid.hjemkomstdato' })}
            content={
              <FraSoeknad>
                {dayjs(vurdering.perioderFraSoeknad.reisetidHjem.tom).format(DDMMYYYY_DATE_FORMAT)}
              </FraSoeknad>
            }
          />
        )}
      </Box>
      <Box marginTop={Margin.xLarge}>
        <LabelledContent
          label={intl.formatMessage({ id: 'reisetid.periode' })}
          content={vurdering.periode.prettifyPeriod()}
        />
      </Box>
      <Box marginTop={Margin.xLarge}>
        <LabelledContent
          label={intl.formatMessage({ id: 'reisetid.begrunnelse' })}
          content={vurdering.begrunnelse}
          indentContent
        />
      </Box>
    </DetailView>
  );
};

export default ReisetidFerdigVisning;
