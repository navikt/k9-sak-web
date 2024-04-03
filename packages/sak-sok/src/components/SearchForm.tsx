import { Button, Heading } from '@navikt/ds-react';
import { Column, Row } from 'nav-frontend-grid';
import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps, formValueSelector, reduxForm } from 'redux-form';

import advarselIcon from '@fpsak-frontend/assets/images/advarsel.svg';
import { InputField } from '@fpsak-frontend/form';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidSaksnummerOrFodselsnummerFormat } from '@fpsak-frontend/utils';

import styles from './searchForm.module.css';

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
    <Heading size="small" level="2">
      {intl.formatMessage({ id: 'Search.SearchFagsakOrPerson' })}
    </Heading>
    <VerticalSpacer eightPx />
    <div className="flex gap-3">
      <InputField
        name="searchString"
        parse={(s = '') => s.trim()}
        label={intl.formatMessage({ id: 'Search.SaksnummerOrPersonId' })}
        size="medium"
      />
      <Button
        className={styles.button}
        loading={searchStarted}
        disabled={isButtonDisabled(searchStarted, searchString)}
      >
        <FormattedMessage id="Search.Search" />
      </Button>
    </div>
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
