import { useMemo, useState } from 'react';

import { Button, Modal, Select, VStack } from '@navikt/ds-react';
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
        <VStack gap="4">
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
          {periodeKanSplittes && (
            <div className={styles.datoRad}>
              <PeriodesplittDatoValg
                forhåndsvisPeriodesplitt={forhåndsvisPeriodesplitt}
                periode={valgtPeriode}
                setValgtDato={setValgtSplittdato}
              />
            </div>
          )}
        </VStack>
      </Modal.Body>
      <Modal.Footer>
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

        <Button size="small" variant="secondary" onClick={lukkModal} autoFocus type="button">
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
