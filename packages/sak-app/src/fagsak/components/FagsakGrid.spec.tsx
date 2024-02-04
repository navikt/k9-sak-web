import { render } from '@testing-library/react';
import React from 'react';
import FagsakGrid from './FagsakGrid';

describe('<FagsakGrid>', () => {
  it('skal vise fagsakgrid med underkomponenter', () => {
    const { container } = render(
      <FagsakGrid
        behandlingContent={<div id="behandlingContent" />}
        profileAndNavigationContent={<div id="profileContent" />}
        supportContent={() => <div id="supportContent" />}
        visittkortContent={() => <div id="visittkort" />}
      />,
    );

    expect(container.querySelector('#behandlingContent')).toBeInTheDocument();
    expect(container.querySelector('#profileContent')).toBeInTheDocument();
    expect(container.querySelector('#supportContent')).toBeInTheDocument();
    expect(container.querySelector('#visittkort')).toBeInTheDocument();
  });
});
