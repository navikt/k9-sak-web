import React from 'react';

import { ExternalLink } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';

import { useHref, useLocation } from 'react-router-dom';

type ÅpneSakINyttVinduProps = {
  variant?: 'tertiary' | 'secondary' | 'primary';
  icon?: React.ReactNode;
  size?: 'small' | 'medium' | 'xsmall';
  value?: string;
  iconPosition?: 'left' | 'right';
  overridePath?: string;
  target?: string;
  disabled?: boolean;
};

const ÅpneSakINyttVindu: React.FC<ÅpneSakINyttVinduProps> = ({
  variant = 'tertiary',
  icon = <ExternalLink aria-hidden />,
  size = 'small',
  value = 'Åpne sak i ny fane',
  iconPosition = 'left',
  target = '_blank',
  overridePath,
  disabled,
}) => {
  const { pathname } = useLocation();
  const href = useHref(pathname);

  const handleClick = () => {
    if (pathname.length > 0) {
      window.open(overridePath || href, target);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      icon={icon}
      size={size}
      iconPosition={iconPosition}
      disabled={disabled === undefined ? pathname.length < 1 : disabled}
    >
      {value}
    </Button>
  );
};

export default ÅpneSakINyttVindu;
