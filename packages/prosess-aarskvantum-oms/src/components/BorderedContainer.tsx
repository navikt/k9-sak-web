import React, { ReactNode, FunctionComponent } from 'react';
import styled from 'styled-components';

const Border = styled.div`
  padding: 1em;
  border: 1px solid #78706a;
  min-width: 700px;
`;

const Heading = styled.div`
  margin-bottom: 1em;
  img {
    height: 28px;
    width: 28px;
    margin-right: 0.5em;
  }
`;

interface BorderedContainerProps {
  children: ReactNode;
  heading: string | ReactNode;
}

const BorderedContainer: FunctionComponent<BorderedContainerProps> = ({ children, heading }) => (
  <Border>
    <Heading>{heading}</Heading>
    {children}
  </Border>
);

export default BorderedContainer;
