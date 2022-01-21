import { FilterFilled } from '@navikt/ds-icons';
import classNames from 'classnames';
import Chevron from 'nav-frontend-chevron';
import { Checkbox } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import styles from './vurderingDokumentfilter.less';
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

function ChevronWithText({ chevronDirection, onClick, text }: ChevronWithTextProps): JSX.Element {
    return (
        <button type="button" className={styles.chevronDropdown__toggleButton} onClick={onClick}>
            <Element className={styles.chevronDropdown__toggleButton__text}>{text}</Element>
            <Chevron type={chevronDirection} />
        </button>
    );
}

function VurderingDokumentfilter({ text, filters, onFilterChange }: VurderingDokumentfilterProps): JSX.Element {
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
                            <ChevronWithText
                                chevronDirection={chevronDirection}
                                onClick={() => setOpen(!open)}
                                text={text}
                            />
                            <FilterFilled className={listeErFiltrert ? '' : styles.chevronDropdown__hidden} />
                            <div className={styles.chevronDropdown__dropdown__checkbox}>
                                {filterListe.map(({ label, attributtNavn }) => (
                                    <Checkbox
                                        key={attributtNavn}
                                        label={label}
                                        checked={filters.includes(attributtNavn)}
                                        onChange={() => onFilterChange(attributtNavn)}
                                    />
                                ))}
                            </div>
                        </span>
                    </div>
                </OutsideClickHandler>
            )}
        </div>
    );
}

export default VurderingDokumentfilter;
