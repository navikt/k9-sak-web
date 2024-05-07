import xImg from '@fpsak-frontend/assets/images/x.svg';
import { Image } from '@fpsak-frontend/shared-components';
import { Label } from '@navikt/ds-react';
import classNames from 'classnames';
import Chevron from 'nav-frontend-chevron';
import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema';
import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './behandlingFilter.module.css';

interface FilterType {
  value: string;
  label: string;
}

export const automatiskBehandling = 'automatiskBehandling';

const sortFilters = (filterA: FilterType, filterB: FilterType) => {
  if (filterA.value === automatiskBehandling) {
    return 1;
  }
  if (filterB.value === automatiskBehandling) {
    return -1;
  }
  return 0;
};

interface ChevronWithTextProps {
  chevronDirection: 'opp' | 'ned';
  onClick: () => void;
  text: string;
}
interface BehandlingfilterProps {
  text: string;
  activeFilters: string[];
  filters: FilterType[];
  onFilterChange: (value: string) => void;
}

const ChevronWithText = ({ chevronDirection, onClick, text }: ChevronWithTextProps): JSX.Element => (
  <button type="button" className={styles.chevronDropdown__toggleButton} onClick={onClick}>
    <Label size="small" as="p" className={styles.chevronDropdown__toggleButton__text}>
      {text}
    </Label>
    <Chevron type={chevronDirection} />
  </button>
);

const BehandlingFilter = ({ text, filters, activeFilters, onFilterChange }: BehandlingfilterProps): JSX.Element => {
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
          <div className={classNames(styles.chevronDropdown)}>
            <button className={styles.closeButton} type="button" onClick={() => setOpen(!open)}>
              <span>
                <FormattedMessage id="Behandlingspunkt.BehandlingFilter.Lukk" />
              </span>
              <Image src={xImg} />
            </button>
            <div className={styles.chevronDropdown__dropdown__checkbox}>
              <CheckboxGruppe legend={<FormattedMessage id="Behandlingspunkt.BehandlingFilter.CheckboxLegend" />}>
                {[...filters].sort(sortFilters).map(({ label, value }) => {
                  if (value === automatiskBehandling) {
                    return (
                      <Checkbox
                        className={styles.automaticCheckbox}
                        label={label}
                        checked={activeFilters.includes(automatiskBehandling)}
                        onChange={() => onFilterChange(automatiskBehandling)}
                        key={value}
                      />
                    );
                  }
                  return (
                    <Checkbox
                      key={value}
                      label={label}
                      checked={activeFilters.includes(value)}
                      onChange={() => onFilterChange(value)}
                    />
                  );
                })}
              </CheckboxGruppe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BehandlingFilter;
