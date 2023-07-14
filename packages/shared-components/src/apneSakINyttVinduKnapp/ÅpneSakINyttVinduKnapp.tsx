import React from 'react';

import { ExternalLink } from '@navikt/ds-icons';
import { Button, ButtonProps } from '@navikt/ds-react';

import { useHref, useLocation } from 'react-router-dom';

type ÅpneSakINyttVinduProps = {
  value?: string;
  overridePath?: string;
  target?: string;
};

const ÅpneSakINyttVindu: React.FC<Omit<ButtonProps, 'children'> & ÅpneSakINyttVinduProps> = ({
  variant = 'tertiary',
  size = 'small',
  disabled,
  loading,
  icon = <ExternalLink aria-hidden />,
  iconPosition,
  value = 'Åpne sak i ny fane',
  overridePath,
  target = '_blank',
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
      loading={loading}
    >
      {value}
    </Button>
  );
};

export default ÅpneSakINyttVindu;
