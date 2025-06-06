import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button } from '@navikt/ds-react';
import { type JSX } from 'react';

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

interface BehandlingfilterProps {
  text: string;
  aktiveFilter: string[];
  filters: FilterType[];
  onFilterChange: (value: string) => void;
}

const BehandlingFilter = ({ text, filters, aktiveFilter, onFilterChange }: BehandlingfilterProps): JSX.Element => (
  <ActionMenu>
    <ActionMenu.Trigger>
      <Button
        className="-mt-[9px]"
        variant="secondary-neutral"
        icon={<ChevronDownIcon aria-hidden />}
        iconPosition="right"
      >
        {text}
      </Button>
    </ActionMenu.Trigger>
    <ActionMenu.Content>
      {filters.toSorted(sortFilters).map(({ label, value }) => {
        if (value === automatiskBehandling) {
          return (
            <ActionMenu.CheckboxItem
              checked={aktiveFilter.includes(automatiskBehandling)}
              onCheckedChange={() => onFilterChange(automatiskBehandling)}
              key={value}
            >
              {label}
            </ActionMenu.CheckboxItem>
          );
        }
        return (
          <ActionMenu.CheckboxItem
            key={value}
            checked={aktiveFilter.includes(value)}
            onCheckedChange={() => onFilterChange(value)}
          >
            {label}
          </ActionMenu.CheckboxItem>
        );
      })}
    </ActionMenu.Content>
  </ActionMenu>
);

export default BehandlingFilter;
