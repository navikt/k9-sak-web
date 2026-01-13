import type { JSX, ReactNode } from 'react';

interface ListItemProps {
  firstColumn: ReactNode;
  secondColumn: ReactNode;
}

const ListItem = ({ firstColumn, secondColumn }: ListItemProps): JSX.Element => (
  <div className="flex">
    <div className="basis-[35%]">{firstColumn}</div>
    <div>{secondColumn}</div>
  </div>
);

export default ListItem;
