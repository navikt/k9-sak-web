import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';

import BorderBox from './BorderBox';
import VerticalSpacer from './VerticalSpacer';

interface OwnPropsWrapper {
  error: boolean;
  children: ReactNode;
  withoutBorder: boolean;
  className: string;
}

const Wrapper = ({ withoutBorder, error, children, className }: OwnPropsWrapper) => (
  // eslint-disable-next-line react/jsx-no-useless-fragment
  <>
    {withoutBorder ? (
      children
    ) : (
      <BorderBox error={error} className={className}>
        {children}
      </BorderBox>
    )}
  </>
);

interface OwnPropsFaktaGruppe {
  merknaderFraBeslutter?: {
    notAccepted?: boolean;
  };
  children: ReactNode;
  titleCode?: string;
  withoutBorder?: boolean;
  className?: string;
}

/**
 * FaktaGruppe
 *
 * Presentasjonskomponent. Grupperingsboks til bruk i faktapaneler, med eller uten ramme. Man kan også spesifisere hvilket aksjonspunkt
 * gruppen hører til, slik at gruppen får rød ramme hvis beslutter har lagt inn merknader.
 */
const FaktaGruppe = ({
  merknaderFraBeslutter,
  titleCode = '',
  children,
  withoutBorder = false,
  className = '',
}: OwnPropsFaktaGruppe) => {
  const error = !!(merknaderFraBeslutter && merknaderFraBeslutter.notAccepted);
  return (
    <Wrapper withoutBorder={withoutBorder && !error} error={error} className={className}>
      {titleCode && (
        <div>
          <Element>
            <FormattedMessage id={titleCode} />
          </Element>
          <VerticalSpacer twentyPx />
        </div>
      )}
      {children}
    </Wrapper>
  );
};

export default FaktaGruppe;
