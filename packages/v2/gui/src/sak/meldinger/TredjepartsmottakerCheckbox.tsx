import { BodyShort, Checkbox, HStack, Link, Spacer } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';

export interface TredjepartsmottakerCheckboxProps {
  readonly checked: boolean;
  onChange(checked: boolean): void;
  readonly disabled: boolean;
}

export const TredjepartsmottakerCheckbox = ({ checked, onChange, disabled }: TredjepartsmottakerCheckboxProps) => (
  <HStack gap="1">
    <Checkbox checked={checked} onChange={() => onChange(!checked)} size="small" disabled={disabled}>
      Send til tredjepart
    </Checkbox>
    <Spacer />
    {checked ? (
      <Link href="https://w2.brreg.no/enhet/sok" target="_blank" referrerPolicy="no-referrer">
        <BodyShort size="small">
          Søk på brreg.no <ExternalLinkIcon />
        </BodyShort>
      </Link>
    ) : null}
  </HStack>
);
