import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';

interface CircleOppfyltIkonProps {
  fontSize?: number | string;
}

export const CircleOppfyltIkon = ({ fontSize = 24 }: CircleOppfyltIkonProps) => (
  <CheckmarkCircleFillIcon fontSize={fontSize} style={{ color: 'var(--ax-bg-success-strong)' }} />
);
