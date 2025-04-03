import {
  FaktaOpplaeringContext,
  FaktaOpplaeringContextTypes,
} from '@k9-sak-web/behandling-opplaeringspenger/src/FaktaOpplaeringContext';
import { LabelledContent } from '@k9-sak-web/gui/shared/labelledContent/LabelledContent.js';
import { GjennomgaaOpplaeringVurdering, Vurderingsresultat } from '@k9-sak-web/types';
import { Calender } from '@navikt/ds-icons';
import { Box, Button } from '@navikt/ds-react';
import { AssessedBy, BasicList, DetailView } from '@navikt/ft-plattform-komponenter';
import { useContext } from 'react';
import { useIntl } from 'react-intl';
import DokumentLink from '../components/DokumentLink';
import styles from './GjennomgaaOpplaeringFerdigVisning.module.css';

interface OwnProps {
  vurdering: GjennomgaaOpplaeringVurdering;
  rediger: () => void;
}

const GjennomgaaOpplaeringFerdigVisning = ({ vurdering, rediger }: OwnProps) => {
  const { readOnly, opplaeringDokumenter } = useContext<FaktaOpplaeringContextTypes>(FaktaOpplaeringContext);
  const intl = useIntl();

  return (
    <DetailView
      title="Vurdering av opplæring"
      // eslint-disable-next-line react/jsx-no-useless-fragment
      contentAfterTitleRenderer={() =>
        !readOnly ? (
          <Button variant="tertiary" size="xsmall" onClick={rediger} className={styles.endreLink}>
            Endre vurdering
          </Button>
        ) : null
      }
    >
      <div>
        <Calender />
        <span>{vurdering.opplæring.prettifyPeriod()}</span>
      </div>
      <Box marginBlock="4 0">
        <LabelledContent
          label="Hvilke dokumenter er brukt i vurderingen om gjennomført opplæring??"
          content={
            <Box marginBlock="4 0">
              <BasicList
                elements={opplaeringDokumenter
                  .map(dokument => ({ ...dokument, benyttet: vurdering?.tilknyttedeDokumenter?.includes(dokument.id) }))
                  .filter(({ benyttet }) => benyttet)
                  .map(dokument => (
                    <DokumentLink dokument={dokument} visDokumentIkon />
                  ))}
              />
            </Box>
          }
        />
      </Box>
      <Box marginBlock="8 0">
        <LabelledContent
          label={intl.formatMessage({ id: 'opplaering.vurdering.label' })}
          content={<span className="whitespace-pre-wrap">{vurdering.begrunnelse}</span>}
          indentContent
        />
        <AssessedBy ident={vurdering.vurdertAv} date={vurdering?.vurdertTidspunkt} />
      </Box>
      <Box marginBlock="8 0">
        <LabelledContent
          label={intl.formatMessage({ id: 'opplaering.gjennomfoertOpplaering.label' })}
          content={[Vurderingsresultat.GODKJENT].includes(vurdering.resultat) ? 'Ja' : 'Nei'}
        />
      </Box>
      <Box marginBlock="8 0">
        <LabelledContent
          label={intl.formatMessage({ id: 'opplaering.perioder.label' })}
          content={vurdering.opplæring.prettifyPeriod()}
        />
      </Box>
    </DetailView>
  );
};

export default GjennomgaaOpplaeringFerdigVisning;
