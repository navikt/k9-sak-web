import { useMemo, useState } from 'react';

import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Button, Modal, Select } from '@navikt/ds-react';
import { calcDays, periodFormat, TIDENES_ENDE } from '@navikt/ft-utils';

import { type TilkommetAktivitetValues } from '../../types/FordelBeregningsgrunnlagPanelValues';
import { type Periode, PeriodesplittDatoValg } from './PeriodesplittDatoValg';

import styles from './periodesplittModal.module.css';

type Props = {
  fields: TilkommetAktivitetValues[];
  forhåndsvisPeriodesplitt: (nyFom: string) => Periode[];
  utførPeriodesplitt: (nyFom: string) => void;
  skalViseModal: boolean;
  lukkModal: () => void;
};

const periodeInneholderFlereVirkedager = (periode: Periode): boolean => {
  if (!periode) {
    return false;
  }
  if (periode.tom === TIDENES_ENDE) {
    return true;
  }
  return calcDays(periode.fom, periode.tom, true) > 1;
};

const lagPerioderFraFields = (fields: TilkommetAktivitetValues[]): Periode[] =>
  fields.map(field => ({ fom: field.fom, tom: field.tom }));

export const PeriodesplittModal = ({
  fields,
  forhåndsvisPeriodesplitt,
  utførPeriodesplitt,
  skalViseModal,
  lukkModal,
}: Props) => {
  const [valgtSplittdato, setValgtSplittdato] = useState<string | undefined>(undefined);
  const [valgtPeriode, setValgtPeriode] = useState<Periode | undefined>(undefined);

  const perioder = useMemo(() => lagPerioderFraFields(fields), [fields]);

  const splittPeriode = () => {
    if (valgtSplittdato && valgtPeriode) {
      utførPeriodesplitt(valgtSplittdato);
      lukkModal();
    }
  };

  const endreValgtPeriode = (event: any) => {
    const val = event.target.value;
    const valg = perioder.find(p => p.fom === val);
    if (valg) {
      setValgtPeriode(valg);
    } else {
      setValgtPeriode(undefined);
    }
  };

  const periodeKanSplittes = valgtPeriode && periodeInneholderFlereVirkedager(valgtPeriode);
  if (!skalViseModal) {
    return null;
  }

  return (
    <Modal width="500px" open={skalViseModal} onClose={lukkModal} aria-label="Del opp periode">
      <Modal.Header>Del opp periode</Modal.Header>
      <Modal.Body>
        <div>
          <Select label="Hvilken periode ønsker du å dele opp?" onChange={endreValgtPeriode} size="small">
            <option value={undefined}>Velg periode</option>
            {perioder.map(periode => (
              <option key={periode.fom} value={periode.fom}>
                {periodFormat(periode.fom, periode.tom)}
              </option>
            ))}
          </Select>
        </div>
        <VerticalSpacer sixteenPx />
        {periodeKanSplittes && (
          <FlexContainer>
            <FlexRow className={styles.datoRad}>
              <PeriodesplittDatoValg
                forhåndsvisPeriodesplitt={forhåndsvisPeriodesplitt}
                periode={valgtPeriode}
                setValgtDato={setValgtSplittdato}
              />
            </FlexRow>
          </FlexContainer>
        )}
      </Modal.Body>
      <Modal.Footer>
        <FlexContainer>
          <FlexRow className={styles.footerRad}>
            <FlexColumn>
              <Button
                size="small"
                variant="primary"
                onClick={splittPeriode}
                disabled={!valgtSplittdato}
                autoFocus
                type="button"
              >
                Del opp periode
              </Button>
            </FlexColumn>
            <FlexColumn>
              <Button size="small" variant="secondary" onClick={lukkModal} autoFocus type="button">
                Avbryt
              </Button>
            </FlexColumn>
          </FlexRow>
        </FlexContainer>
      </Modal.Footer>
    </Modal>
  );
};
