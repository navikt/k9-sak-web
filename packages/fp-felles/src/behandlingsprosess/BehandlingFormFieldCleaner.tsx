import { getBehandlingFormName } from '@fpsak-frontend/form/src/behandlingForm';
import React, { Component, ReactNode, ReactNodeArray } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { change as reduxChange } from 'redux-form';
import { createSelector } from 'reselect';

const findAllNames = children =>
  children
    ? React.Children.map(children, child => {
        let all = [];
        if (child && child.props && child.props.children) {
          all = findAllNames(child.props.children);
        }
        if (child && child.props && child.props.name) {
          all.push(child.props.name);
        }
        return all;
      })
    : [];

/**
 * BehandlingFormFieldCleaner
 *
 * Denne komponenten sørger for å fjerne redux-form feltverdier fra state når felt-komponenten blir fjernet fra DOM.
 * Strengene i fieldNames-prop må matche name-attributten i feltet som skal fjernes fra state.
 *
 * * Eksempel:
 * ```html
 * <BehandlingFormFieldCleaner formName={TEST_FORM} fieldNames={['fomDato']}>{children}</BehandlingFormFieldCleaner>
 * ```
 */

interface BehandlingFormFieldCleanerProps {
  behandlingId: number;
  behandlingVersjon: number;
  formName: string;
  fieldNames: string[];
  children: ReactNodeArray | ReactNode;
}

interface BehandlingFormFieldCleanerStateFromState {
  behandlingFormName: string;
  reduxChange: (formName: string, fieldName: string, value: any) => void;
}

export class BehandlingFormFieldCleaner extends Component<
  BehandlingFormFieldCleanerProps & BehandlingFormFieldCleanerStateFromState
> {
  shouldComponentUpdate(nextProps: BehandlingFormFieldCleanerProps) {
    const { children } = this.props;
    const oldNames = findAllNames(children);
    const newNames = findAllNames(nextProps.children);

    const diff1 = oldNames.every(k => newNames.includes(k));
    const diff2 = newNames.every(k => oldNames.includes(k));
    return !diff1 || !diff2;
  }

  componentDidUpdate() {
    const { behandlingFormName, children, fieldNames, reduxChange: reduxFormChange } = this.props;
    const doNotRemoveFieldNames = findAllNames(children);

    fieldNames
      .filter(fieldName => !doNotRemoveFieldNames.includes(fieldName))
      .forEach(fieldName => {
        reduxFormChange(behandlingFormName, fieldName, null);
      });
  }

  render() {
    const { children } = this.props;
    return <>{children}</>;
  }
}

const getCompleteFormName = createSelector(
  [
    (ownProps: BehandlingFormFieldCleanerProps) => ownProps.formName,
    ownProps => ownProps.behandlingId,
    ownProps => ownProps.behandlingVersjon,
  ],
  (formName, behandlingId, versjon) => {
    return getBehandlingFormName(behandlingId, versjon, formName);
  },
);

const mapStateToProps = (state, ownProps) => ({
  behandlingFormName: getCompleteFormName(ownProps),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      reduxChange,
    },
    dispatch,
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(BehandlingFormFieldCleaner);
