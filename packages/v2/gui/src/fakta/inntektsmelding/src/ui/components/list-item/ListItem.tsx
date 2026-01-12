import type { JSX, ReactNode } from 'react';

interface ListItemProps {
  firstColumnRenderer: () => ReactNode;
  secondColumnRenderer: () => ReactNode;
}

const ListItem = ({ firstColumnRenderer, secondColumnRenderer }: ListItemProps): JSX.Element => (
  <div className="flex">
    <div className="basis-[35%]">{firstColumnRenderer()}</div>
    <div>{secondColumnRenderer()}</div>
  </div>
);

export default ListItem;
