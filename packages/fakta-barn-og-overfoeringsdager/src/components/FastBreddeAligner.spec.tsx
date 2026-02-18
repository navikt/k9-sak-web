import React from 'react';
import { render, screen } from '@testing-library/react';
import FastBreddeAligner from './FastBreddeAligner';

it('renders all columns with given content', () => {
  const content1 = 'kolonne_1';
  const content2 = 'kolonne_2';
  const kolonner = [
    {
      width: '100px',
      id: '1',
      content: content1,
    },
    {
      width: '200px',
      id: '2',
      content: content2,
    },
  ];

  render(<FastBreddeAligner kolonner={kolonner} />);

  const renderedContent1 = screen.getByText(content1);
  const renderedContent2 = screen.getByText(content2);

  expect(renderedContent1).toBeInTheDocument();
  expect(renderedContent2).toBeInTheDocument();
});
