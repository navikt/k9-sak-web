import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import Ikon from 'nav-frontend-ikoner-assets';
import React, { useState } from 'react';

import DokumentLink from './DokumentLink';
import styles from './dokumenterIVurderingen.module.css';
import FilterList from './filter-list/FilterList';

const DokumenterIVurderingen = ({ dokumenter, onChange, onBlur, error, valgteDokumenter }) => {
  const [visAlleDokumenter, setVisAlleDokumenter] = useState(false);
  const [dokumentFilter, setDokumentFilter] = useState([]);

  const getDokumenterSomSkalVises = () => {
    const filtrerteDokumenter = dokumenter.filter(dokument => {
      if (!dokumentFilter.length) {
        return true;
      }
      return dokumentFilter.some(filter => dokument[filter] === true);
    });

    return filtrerteDokumenter.filter((dokument, index) => {
      if (dokumentFilter.length === 0) {
        if (dokumenter.length < 6) {
          return true;
        }
        if (!visAlleDokumenter && index > 4) {
          return false;
        }
      }
      return true;
    });
  };

  const vurderingDokumentfilterOptions = [
    { label: 'Tidligere brukte dokumenter', attributtNavn: 'bruktTilMinstEnVurdering' },
    { label: 'Dokument fra annen part', attributtNavn: 'annenPartErKilde' },
  ];

  const updateDokumentFilter = valgtFilter => {
    if (dokumentFilter.includes(valgtFilter)) {
      if (dokumentFilter.length === 1) {
        setVisAlleDokumenter(false);
      }
      setDokumentFilter(dokumentFilter.filter(v => v !== valgtFilter));
    } else {
      setDokumentFilter(dokumentFilter.concat([valgtFilter]));
      setVisAlleDokumenter(true);
    }
  };

  const visFlereDokumenterKnapp = () => {
    if (dokumentFilter.length > 0) {
      return false;
    }
    if (dokumenter.length < 6) {
      return false;
    }
    return true;
  };
  return (
    <CheckboxGroup
      legend="Hvilke dokumenter er brukt i vurderingen av opplæring?"
      size="small"
      onChange={onChange}
      onBlur={onBlur}
      error={error}
    >
      <div className={styles.filterContainer}>
        <FilterList
          text="Filter"
          activeFilters={dokumentFilter}
          filterOptions={vurderingDokumentfilterOptions}
          onFilterChange={updateDokumentFilter}
        />
      </div>
      {dokumentFilter.length > 0 && (
        <div className={styles.filterKnappContainer}>
          {dokumentFilter.map(filter => {
            const { label } = vurderingDokumentfilterOptions.find(option => option.attributtNavn === filter);
            return (
              <button
                key={label}
                onClick={() => updateDokumentFilter(filter)}
                type="button"
                className={styles.fjernFilterKnapp}
              >
                {label}
                <Ikon kind="x" />
              </button>
            );
          })}
        </div>
      )}
      {getDokumenterSomSkalVises().map(dokument => (
        <Checkbox key={dokument.id} size="small" value={dokument.id} checked={valgteDokumenter.includes(dokument.id)}>
          <DokumentLink dokument={dokument} />
        </Checkbox>
      ))}
      {visFlereDokumenterKnapp() && (
        <button
          className={styles.visDokumenterKnapp}
          onClick={() => setVisAlleDokumenter(!visAlleDokumenter)}
          type="button"
        >
          {visAlleDokumenter ? `Vis færre dokumenter` : `Vis alle dokumenter (${dokumenter.length})`}
        </button>
      )}
    </CheckboxGroup>
  );
};

export default DokumenterIVurderingen;
