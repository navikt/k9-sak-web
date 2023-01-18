import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import { GjennomgaaOpplaeringVurdering, Vurderingsresultat } from '@k9-sak-web/types';
import {
  Box,
  Margin,
  DetailView,
  LabelledContent,
  LinkButton,
  AssessedBy,
  BasicList,
} from '@navikt/ft-plattform-komponenter';
import { Calender } from '@navikt/ds-icons';
import {
  FaktaOpplaeringContext,
  FaktaOpplaeringContextTypes,
} from '@k9-sak-web/behandling-opplaeringspenger/src/panelDefinisjoner/faktaPaneler/OpplaeringFaktaPanelDef';
import styles from './GjennomgaaOpplaeringFerdigVisning.modules.css';
import DokumentLink from '../components/DokumentLink';

interface OwnProps {
  vurdering: GjennomgaaOpplaeringVurdering;
  rediger: () => void;
}

const GjennomgaaOpplaeringFerdigVisning = ({ vurdering, rediger }: OwnProps) => {
  const { readOnly, sykdomDokumenter, saksbehandlere } =
    useContext<FaktaOpplaeringContextTypes>(FaktaOpplaeringContext);
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
      <Box marginTop={Margin.medium}>
        <LabelledContent
          label="Hvilke dokumenter er brukt i vurderingen om gjennomført opplæring??"
          content={
            <Box marginTop={Margin.medium}>
              <BasicList
                elements={sykdomDokumenter
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
      <Box marginTop={Margin.xLarge}>
        <LabelledContent
          label={intl.formatMessage({ id: 'opplaering.vurdering.label' })}
          content={vurdering.begrunnelse}
          indentContent
        />
        <AssessedBy name={saksbehandlere[vurdering.endretAv] || vurdering.endretAv} date={vurdering?.endretTidspunkt} />
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
