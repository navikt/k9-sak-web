import { FilterFilled, ChevronDownCircle, ChevronUpCircle } from '@navikt/ds-icons';
import Chevron from 'nav-frontend-chevron';
import { Checkbox, BodyShort } from '@navikt/ds-react';
import classNames from 'classnames';
import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import styles from './filterList.modules.css';

interface ChevronWithTextProps {
  chevronDirection: 'opp' | 'ned';
  onClick: () => void;
  text: string;
}
interface FilterListProps {
  text: string;
  activeFilters: string[];
  filterOptions: {
    label: string;
    attributtNavn: string;
  }[];
  onFilterChange: (value: string) => void;
}

const ChevronWithText = ({ chevronDirection, onClick, text }: ChevronWithTextProps): JSX.Element => (
  <button type="button" className={styles.chevronDropdown__toggleButton} onClick={onClick}>
    <BodyShort className={styles.chevronDropdown__toggleButton__text}>{text}</BodyShort>
    <Chevron type={chevronDirection} />
  </button>
);

const FilterList = ({ text, activeFilters, onFilterChange, filterOptions }: FilterListProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const chevronDirection = open ? 'opp' : 'ned';
  const filterListe = filterOptions;
  const listeErFiltrert = activeFilters.length > 0;
  return (
    <div className={styles.vurderingDokumentfilter}>
      <span className={classNames(styles.chevronDropdown, open && styles.chevronDropdown__hidden)}>
        <ChevronWithText chevronDirection={chevronDirection} onClick={() => setOpen(!open)} text={text} />
        <FilterFilled
          className={listeErFiltrert ? '' : styles.chevronDropdown__hidden}
          onResize={undefined}
          onResizeCapture={undefined}
        />
      </span>
      {open && (
        <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
          <div className={styles.chevronDropdown__dropdown}>
            <span className={classNames(styles.chevronDropdown)}>
              <ChevronWithText chevronDirection={chevronDirection} onClick={() => setOpen(!open)} text={text} />
              <FilterFilled
                className={listeErFiltrert ? '' : styles.chevronDropdown__hidden}
                onResize={undefined}
                onResizeCapture={undefined}
              />
              <div className={styles.chevronDropdown__dropdown__checkbox}>
                {filterListe.map(({ label, attributtNavn }) => (
                  <Checkbox
                    key={attributtNavn}
                    size="small"
                    checked={activeFilters.includes(attributtNavn)}
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

export default FilterList;
