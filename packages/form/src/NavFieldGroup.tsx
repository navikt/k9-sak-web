import { SkjemaGruppe } from 'nav-frontend-skjema';
import React, { ReactNode, ReactNodeArray } from 'react';
import { Field } from 'redux-form';
import renderNavField from './renderNavField';

const renderNavSkjemaGruppeWithError = renderNavField(({ title, feil, getChildren, className }) => (
  <SkjemaGruppe description={title} feil={feil} className={className}>
    {getChildren()}
  </SkjemaGruppe>
));

interface NavFieldGroupProps {
  errorMessageName?: string;
  errorMessage?: string | ReactNode;
  title?: string;
  children: ReactNodeArray | ReactNode;
  className?: string;
}

const NavFieldGroup = ({ errorMessageName, errorMessage, title, children, className }: NavFieldGroupProps) => {
  if (!errorMessageName) {
    return (
      <SkjemaGruppe description={title} className={className} feil={errorMessage}>
        {children}
      </SkjemaGruppe>
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

NavFieldGroup.defaultProps = {
  errorMessageName: null,
  errorMessage: null,
  title: '',
  className: '',
};

export default NavFieldGroup;
