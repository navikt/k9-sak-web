import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { FilterFilled } from '@navikt/ds-icons';
import { Button, Checkbox } from '@navikt/ds-react';
import classNames from 'classnames';
import React, { useState, type JSX } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import styles from './filterList.module.css';

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
  <Button
    type="button"
    onClick={onClick}
    icon={chevronDirection === 'opp' ? <ChevronUpIcon /> : <ChevronDownIcon />}
    iconPosition="right"
    variant="tertiary"
  >
    {text}
  </Button>
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
