import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { formValueSelector, InjectedFormProps, reduxForm } from 'redux-form';

import advarselIcon from '@fpsak-frontend/assets/images/advarsel.svg';
import { InputField } from '@fpsak-frontend/form';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidSaksnummerOrFodselsnummerFormat } from '@fpsak-frontend/utils';

import styles from './searchForm.css';

const isButtonDisabled = (searchStarted: boolean, searchString?: string): boolean =>
  !!(searchStarted || searchString.length < 1);

interface PureOwnProps {
  searchStarted: boolean;
  searchResultAccessDenied?: {
    feilmelding: string;
  };
}

interface MappedOwnProps {
  searchString?: string;
}

/**
 * SearchForm
 *
 * Presentasjonskomponent. Definerer søkefelt og tilhørende søkeknapp.
 */
export const SearchForm = ({
  intl,
  searchString = '',
  searchStarted,
  searchResultAccessDenied,
  ...formProps
}: PureOwnProps & MappedOwnProps & WrappedComponentProps & InjectedFormProps) => (
  <form className={styles.container} onSubmit={formProps.handleSubmit}>
    <Undertittel>{intl.formatMessage({ id: 'Search.SearchFagsakOrPerson' })}</Undertittel>
    <VerticalSpacer eightPx />
    <Row>
      <Column xs="7">
        <InputField
          name="searchString"
          parse={(s = '') => s.trim()}
          label={intl.formatMessage({ id: 'Search.SaksnummerOrPersonId' })}
          bredde="L"
        />
      </Column>
      <Column xs="5">
        <Hovedknapp
          mini
          className={styles.button}
          spinner={searchStarted}
          disabled={isButtonDisabled(searchStarted, searchString)}
        >
          <FormattedMessage id="Search.Search" />
        </Hovedknapp>
      </Column>
    </Row>
    {searchResultAccessDenied && (
      <Row>
        <Column xs="12">
          <Image className={styles.advarselIcon} src={advarselIcon} />
          <FormattedMessage id={searchResultAccessDenied.feilmelding} />
        </Column>
      </Row>
    )}
  </form>
);

const validate = values => {
  const errors = { searchString: undefined };
  errors.searchString = hasValidSaksnummerOrFodselsnummerFormat(values.searchString);
  return errors;
};

const mapStateToProps = (state): MappedOwnProps => ({
  searchString: formValueSelector('SearchForm')(state, 'searchString'),
});

export default connect(mapStateToProps)(
  reduxForm({
    form: 'SearchForm',
    validate,
  })(injectIntl(SearchForm)),
);
