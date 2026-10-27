import { Collapse, Expand, FilterFilled } from '@navikt/ds-icons';
import { Button, Checkbox, Label, VStack } from '@navikt/ds-react';
import classNames from 'classnames';
import { useState, type JSX } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { Dokumenttype, dokumentLabel } from '../../../types/Dokument';
import styles from './dokumentfilter.module.css';

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
  alleRelevanteDokumentTyper: Array<Dokumenttype>;
}

const ChevronWithText = ({ chevronDirection, onClick, text }: ChevronWithTextProps): JSX.Element => (
  <Button
    size="small"
    variant="tertiary"
    className={styles.chevronDropdown__toggleButton}
    onClick={onClick}
    icon={chevronDirection === 'ned' ? <Expand /> : <Collapse />}
    iconPosition="right"
  >
    <Label size="small" className={styles.chevronDropdown__toggleButton__text}>
      {text}
    </Label>
  </Button>
);

const Dokumentfilter = ({
  text,
  className,
  filters,
  onFilterChange: filtrerDokumenttype,
  alleRelevanteDokumentTyper,
}: DokumentfilterProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const chevronDirection = open ? 'opp' : 'ned';
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
              <ChevronWithText chevronDirection={chevronDirection} onClick={() => setOpen(!open)} text={text} />
              <FilterFilled className={listeErFiltrert ? '' : styles.chevronDropdown__hidden} />

              <VStack gap="space-16" marginBlock="space-8 space-0">
                {alleRelevanteDokumentTyper.map(type => (
                  <Checkbox
                    key={type}
                    size="small"
                    checked={filters.includes(type)}
                    onChange={() => filtrerDokumenttype(type)}
                  >
                    {dokumentLabel[type]}
                  </Checkbox>
                ))}
              </VStack>
            </span>
          </div>
        </OutsideClickHandler>
      )}
    </div>
  );
};

export default Dokumentfilter;
