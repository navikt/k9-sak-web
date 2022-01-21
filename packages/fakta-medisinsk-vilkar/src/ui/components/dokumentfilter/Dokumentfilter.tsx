import React, { useState } from 'react';
import { Element } from 'nav-frontend-typografi';
import Chevron from 'nav-frontend-chevron';
import { Checkbox } from 'nav-frontend-skjema';
import classNames from 'classnames';
import { FilterFilled } from '@navikt/ds-icons';
import OutsideClickHandler from 'react-outside-click-handler';
import { Dokumenttype, dokumentLabel } from '../../../types/Dokument';
import styles from './dokumentfilter.less';

interface ChevronWithTextProps {
    chevronDirection: 'opp' | 'ned';
    onClick: () => void;
    text: string;
}
interface DokumentfilterProps {
    text: string;
    className: string;
    filters: Array<Dokumenttype>;
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

function Dokumentfilter({
    text,
    className,
    filters,
    onFilterChange: filtrerDokumenttype,
}: DokumentfilterProps): JSX.Element {
    const [open, setOpen] = useState(false);
    const chevronDirection = open ? 'opp' : 'ned';
    const dokumenttypeListe = [...Object.values(Dokumenttype)];
    const listeErFiltrert = filters.length < 4;
    return (
        <div className={styles.dokumentfilter}>
            <span className={classNames(styles.chevronDropdown, className, open && styles.chevronDropdown__hidden)}>
                <ChevronWithText chevronDirection={chevronDirection} onClick={() => setOpen(!open)} text={text} />
                <FilterFilled className={listeErFiltrert ? '' : styles.chevronDropdown__hidden} />
            </span>
            {open && (
                <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
                    <div className={classNames(styles.chevronDropdown__dropdown, className)}>
                        <span className={classNames(styles.chevronDropdown)}>
                            <ChevronWithText
                                chevronDirection={chevronDirection}
                                onClick={() => setOpen(!open)}
                                text={text}
                            />
                            <FilterFilled className={listeErFiltrert ? '' : styles.chevronDropdown__hidden} />
                            <div className={styles.chevronDropdown__dropdown__checkbox}>
                                {dokumenttypeListe.map((type) => (
                                    <Checkbox
                                        key={type}
                                        label={dokumentLabel[type]}
                                        checked={filters.includes(type)}
                                        onChange={() => filtrerDokumenttype(type)}
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

export default Dokumentfilter;
