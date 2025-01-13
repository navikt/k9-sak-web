import xImg from '@fpsak-frontend/assets/images/x.svg';
import { Image } from '@fpsak-frontend/shared-components';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, Checkbox, CheckboxGroup } from '@navikt/ds-react';
import classNames from 'classnames';
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
  <Button
    variant="tertiary"
    iconPosition="right"
    icon={chevronDirection === 'opp' ? <ChevronUpIcon /> : <ChevronDownIcon />}
    type="button"
    onClick={onClick}
  >
    {text}
  </Button>
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
              <CheckboxGroup
                legend={<FormattedMessage id="Behandlingspunkt.BehandlingFilter.CheckboxLegend" />}
                size="small"
              >
                {[...filters].sort(sortFilters).map(({ label, value }) => {
                  if (value === automatiskBehandling) {
                    return (
                      <Checkbox
                        className={styles.automaticCheckbox}
                        checked={activeFilters.includes(automatiskBehandling)}
                        onChange={() => onFilterChange(automatiskBehandling)}
                        key={value}
                      >
                        {label}
                      </Checkbox>
                    );
                  }
                  return (
                    <Checkbox
                      key={value}
                      checked={activeFilters.includes(value)}
                      onChange={() => onFilterChange(value)}
                    >
                      {label}
                    </Checkbox>
                  );
                })}
              </CheckboxGroup>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BehandlingFilter;
