import { Collapse, Expand, FilterFilled } from '@navikt/ds-icons';
import { Checkbox, Label } from '@navikt/ds-react';
import classNames from 'classnames';
import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import styles from './vurderingDokumentfilter.css';
import vurderingDokumentfilterOptions from './vurderingDokumentfilterOptions';

interface ChevronWithTextProps {
  chevronDirection: 'opp' | 'ned';
  onClick: () => void;
  text: string;
}
interface VurderingDokumentfilterProps {
  text: string;
  filters: string[];
  onFilterChange: (value: string) => void;
}

const ChevronWithText = ({ chevronDirection, onClick, text }: ChevronWithTextProps): JSX.Element => (
  <button type="button" className={styles.chevronDropdown__toggleButton} onClick={onClick}>
    <Label size="small" className={styles.chevronDropdown__toggleButton__text}>
      {text}
    </Label>
    {chevronDirection === 'ned' ? <Expand /> : <Collapse />}
  </button>
);

const VurderingDokumentfilter = ({ text, filters, onFilterChange }: VurderingDokumentfilterProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const chevronDirection = open ? 'opp' : 'ned';
  const filterListe = vurderingDokumentfilterOptions;
  const listeErFiltrert = filters.length > 0;
  return (
    <div className={styles.vurderingDokumentfilter}>
      <span className={classNames(styles.chevronDropdown, open && styles.chevronDropdown__hidden)}>
        <ChevronWithText chevronDirection={chevronDirection} onClick={() => setOpen(!open)} text={text} />
        <FilterFilled className={listeErFiltrert ? '' : styles.chevronDropdown__hidden} />
      </span>
      {open && (
        <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
          <div className={styles.chevronDropdown__dropdown}>
            <span className={classNames(styles.chevronDropdown)}>
              <ChevronWithText chevronDirection={chevronDirection} onClick={() => setOpen(!open)} text={text} />
              <FilterFilled className={listeErFiltrert ? '' : styles.chevronDropdown__hidden} />
              <div className={styles.chevronDropdown__dropdown__checkbox}>
                {filterListe.map(({ label, attributtNavn }) => (
                  <Checkbox
                    key={attributtNavn}
                    checked={filters.includes(attributtNavn)}
                    onChange={() => onFilterChange(attributtNavn)}
                  >
                    {label}
                  </Checkbox>
                ))}
              </div>
            </span>
          </div>
        </OutsideClickHandler>
      )}
    </div>
  );
};

export default VurderingDokumentfilter;
