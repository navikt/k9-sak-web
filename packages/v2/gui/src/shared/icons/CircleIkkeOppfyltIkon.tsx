import { XMarkOctagonFillIcon } from '@navikt/aksel-icons';

interface CircleIkkeOppfyltIkonProps {
  fontSize?: number | string;
}

export const CircleIkkeOppfyltIkon = ({ fontSize = 24 }: CircleIkkeOppfyltIkonProps) => (
  <XMarkOctagonFillIcon fontSize={fontSize} style={{ color: 'var(--ax-bg-danger-strong)' }} />
);
