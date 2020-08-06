import styled from 'styled-components';

interface HrProps {
  marginTopPx: number;
  marginBottomPx: number;
}

const Hr = styled.hr<HrProps>`
  margin-bottom: ${({ marginBottomPx }) => `${marginBottomPx}px;`};
  margin-top: ${({ marginTopPx }) => `${marginTopPx}px;`};
`;

export default Hr;
