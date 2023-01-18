import {
  Box,
  Margin,
  DetailView,
  LabelledContent,
  LinkButton,
  AssessedBy,
  BasicList,
} from '@navikt/ft-plattform-komponenter';
import React, { useContext } from 'react';
import { NoedvendighetVurdering, Vurderingsresultat } from '@k9-sak-web/types';
import { Calender } from '@navikt/ds-icons';
import { FaktaOpplaeringContext } from '@k9-sak-web/behandling-opplaeringspenger/src/panelDefinisjoner/faktaPaneler/OpplaeringFaktaPanelDef';
import { useIntl } from 'react-intl';
import styles from './noedvendighetFerdigVisning.modules.css';
import DokumentLink from '../components/DokumentLink';

interface OwnProps {
  vurdering: NoedvendighetVurdering;
  rediger: () => void;
}

const NoedvendighetFerdigVisning = ({ vurdering, rediger }: OwnProps) => {
  const { readOnly, sykdomDokumenter } = useContext(FaktaOpplaeringContext);
  const intl = useIntl();

  return (
    <DetailView
      title="Vurdering av nødvendighet"
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
      <Box marginTop={Margin.medium}>
        <LabelledContent
          label="Hvilke dokumenter er brukt i vurderingen om gjennomført opplæring?"
          content={
            <Box marginTop={Margin.medium}>
              <BasicList
                elements={sykdomDokumenter
                  .map(dokument => ({ ...dokument, benyttet: vurdering.tilknyttedeDokumenter.includes(dokument.id) }))
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
