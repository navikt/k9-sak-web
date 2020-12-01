import styled from 'styled-components';

const StyledColumn = styled.td<{ width?: string }>`${({ width }) => width && `width: ${width};`}`;

export default StyledColumn;
