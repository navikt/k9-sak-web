import { Box, Label } from '@navikt/ds-react';
import type { ReactNode } from 'react';

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
      <Box.New
        marginBlock="4 0"
        padding="4"
        borderWidth="1"
        borderRadius="medium"
        className={`${className} ${error ? 'border-[#ba3a26] border-2 border-solid' : ''}`}
      >
        {children}
      </Box.New>
    )}
  </>
);

interface OwnPropsFaktaGruppe {
  merknaderFraBeslutter?: {
    notAccepted?: boolean;
  };
  children: ReactNode;
  title?: string;
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
  title = '',
  children,
  withoutBorder = false,
  className = '',
}: OwnPropsFaktaGruppe) => {
  const error = !!(merknaderFraBeslutter && merknaderFraBeslutter.notAccepted);
  return (
    <Wrapper withoutBorder={withoutBorder && !error} error={error} className={className}>
      {title && (
        <div>
          <Label size="small" as="p">
            {title}
          </Label>
          <div className="mt-5" />
        </div>
      )}
      {children}
    </Wrapper>
  );
};

export default FaktaGruppe;
