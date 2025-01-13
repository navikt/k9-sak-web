import React from 'react';
import ListItem from '../list-item/ListItem';

const firstColumnRenderer = () => <b>Arbeidsgiver</b>;
const secondColumnRenderer = () => <b>Status inntektsmelding</b>;

const InntektsmeldingListeHeading = (): JSX.Element => (
  <ListItem firstColumnRenderer={firstColumnRenderer} secondColumnRenderer={secondColumnRenderer} />
);

export default InntektsmeldingListeHeading;
