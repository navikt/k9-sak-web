import styled from 'styled-components';

const StyledColumn = styled.td<{ koronaperiode?: boolean; first?: boolean }>`
  border-bottom: 1px solid ${({ koronaperiode }) => (koronaperiode ? '#FFA733' : '#b7b1a9')};
  line-height: 1.42857143;
  padding: 8px 8px 8px 8px;
  text-align: left;
  vertical-align: top;
  position: relative;

  ${({ koronaperiode, first }) =>
    koronaperiode &&
    first &&
    `
    &:before {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 15px 0 0 15px;
      border-color: transparent transparent transparent #FFA733;
      bottom: 0;
      left: 0;
    }
  `}
`;

export default StyledColumn;
