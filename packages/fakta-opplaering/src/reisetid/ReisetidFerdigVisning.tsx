import { AssessedBy, DetailView, LinkButton } from '@navikt/ft-plattform-komponenter';
import dayjs from 'dayjs';
import { useContext } from 'react';
import { useIntl } from 'react-intl';

import { FaktaOpplaeringContext } from '@k9-sak-web/behandling-opplaeringspenger/src/FaktaOpplaeringContext';

import { LabelledContent } from '@k9-sak-web/gui/shared/labelledContent/LabelledContent.js';
import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { Vurderingsresultat } from '@k9-sak-web/types';
import { Box } from '@navikt/ds-react';
import BeskrivelseFraSoeker from './BeskrivelseFraSoeker';
import FraSoeknad from './FraSoeknad';
import { ReisetidVurdering } from './ReisetidTypes';
import styles from './reisetidFerdigVisning.module.css';

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
      <Box marginBlock="8 0">
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
      <Box marginBlock="8 0">
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
      <Box marginBlock="8 0">
        <LabelledContent
          label={
            [Vurderingsresultat.GODKJENT_AUTOMATISK, Vurderingsresultat.GODKJENT].includes(vurdering.resultat)
              ? intl.formatMessage({ id: 'reisetid.periode.innvilget' })
              : intl.formatMessage({ id: 'reisetid.periode.avslått' })
          }
          content={vurdering.periode.prettifyPeriod()}
        />
      </Box>
      {vurdering.begrunnelse && (
        <Box marginBlock="8 0">
          <LabelledContent
            label={intl.formatMessage({ id: 'reisetid.begrunnelse' })}
            content={<span className="whitespace-pre-wrap">{vurdering.begrunnelse}</span>}
            indentContent
          />
          <AssessedBy ident={vurdering.vurdertAv} date={vurdering?.vurdertTidspunkt} />
        </Box>
      )}
    </DetailView>
  );
};

export default ReisetidFerdigVisning;
