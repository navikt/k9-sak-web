import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';

type OwnProps = {
  size?: 'small' | 'medium' | 'large';
};

const getFontSizeForSize = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return '18px';
    case 'medium':
      return '20px';
    case 'large':
      return '22px';
    default:
      return '18px';
  }
};

const AksjonspunktIkon = ({ size = 'medium' }: OwnProps) => {
  const fontSize = getFontSizeForSize(size);
  return <ExclamationmarkTriangleFillIcon style={{ color: 'var(--ax-text-warning-decoration)' }} fontSize={fontSize} />;
};

export default AksjonspunktIkon;
