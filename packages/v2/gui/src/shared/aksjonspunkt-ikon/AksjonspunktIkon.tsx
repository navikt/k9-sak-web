import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';

type OwnProps = {
  size?: 'small' | 'medium' | 'large';
};

const AksjonspunktIkon = ({ size = 'medium' }: OwnProps) => {
  const fontSize = (function () {
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
  })();
  return <ExclamationmarkTriangleFillIcon style={{ color: 'var(--a-icon-warning)' }} fontSize={fontSize} />;
};

export default AksjonspunktIkon;
