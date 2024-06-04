import { Fieldset } from '@navikt/ds-react';
import React, { ReactNode, ReactNodeArray } from 'react';
import { Field } from 'redux-form';
import renderNavField from './renderNavField';

const renderNavSkjemaGruppeWithError = renderNavField(({ title, feil, getChildren, className }) => (
  <Fieldset legend={title} hideLegend description={title} error={feil} className={className}>
    {getChildren()}
  </Fieldset>
));

interface NavFieldGroupProps {
  errorMessageName?: string;
  errorMessage?: string | ReactNode;
  title?: string;
  children: ReactNodeArray | ReactNode;
  className?: string;
}

const NavFieldGroup = ({
  errorMessageName = null,
  errorMessage = null,
  title = '',
  children,
  className = '',
}: NavFieldGroupProps) => {
  if (!errorMessageName) {
    return (
      <Fieldset legend={title} hideLegend description={title} className={className} error={errorMessage}>
        {children}
      </Fieldset>
    );
  }
  return (
    <Field
      name={errorMessageName}
      component={renderNavSkjemaGruppeWithError}
      title={title}
      getChildren={() => children}
      className={className}
    />
  );
};

export default NavFieldGroup;
