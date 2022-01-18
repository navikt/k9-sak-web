import classNames from 'classnames';
import Chevron from 'nav-frontend-chevron';
import { Checkbox } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import React, { useEffect, useRef, useState } from 'react';
import styles from './behandlingFilter.less';

interface ChevronWithTextProps {
  chevronDirection: 'opp' | 'ned';
  onClick: () => void;
  text: string;
}
interface BehandlingfilterProps {
  text: string;
  activeFilters: string[];
  filters: { label: string; value: string }[];
  onFilterChange: (value: string) => void;
}

function ChevronWithText({ chevronDirection, onClick, text }: ChevronWithTextProps): JSX.Element {
  return (
    <button type="button" className={styles.chevronDropdown__toggleButton} onClick={onClick}>
      <Element className={styles.chevronDropdown__toggleButton__text}>{text}</Element>
      <Chevron type={chevronDirection} />
    </button>
  );
}

function BehandlingFilter({ text, filters, activeFilters, onFilterChange }: BehandlingfilterProps): JSX.Element {
  const wrapperRef = useRef(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef, open]);

  const chevronDirection = open ? 'opp' : 'ned';
  return (
    <div ref={wrapperRef}>
      <div className={classNames(styles.chevronDropdown, open && styles.chevronDropdown__hidden)}>
        <ChevronWithText chevronDirection={chevronDirection} onClick={() => setOpen(!open)} text={text} />
      </div>
      {open && (
        <div className={styles.chevronDropdown__dropdown}>
          <span className={classNames(styles.chevronDropdown)}>
            <ChevronWithText chevronDirection={chevronDirection} onClick={() => setOpen(!open)} text="Lukk" />
            <div className={styles.chevronDropdown__dropdown__checkbox}>
              {filters.map(({ label, value }) => (
                <Checkbox
                  key={value}
                  label={label}
                  checked={activeFilters.includes(value)}
                  onChange={() => onFilterChange(value)}
                />
              ))}
            </div>
          </span>
        </div>
      )}
    </div>
  );
}

export default BehandlingFilter;
