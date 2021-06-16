import React, { Fragment, FunctionComponent } from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';

import { DDMMYYYY_DATE_FORMAT, hasValidDate, required } from '@fpsak-frontend/utils';
import { DatepickerField } from '@fpsak-frontend/form';

import { DokumentStatus } from './SoknadsfristVilkarForm';

interface OwnProps {
  dokument: DokumentStatus[];
  isReadOnly: boolean;
}

interface StaticFunctions {
  buildInitialValues?: (dokument: DokumentStatus[]) => any;
  transformValues?: (values: any) => any;
}

const formatDate = dato => moment(dato).format(DDMMYYYY_DATE_FORMAT);

/**
 * VilkarDokument
 *
 * Presentasjonskomponent. Lar den NAV-ansatte skrive inn en begrunnelse før overstyring av vilkår eller beregning.
 */
const VilkarDokument: FunctionComponent<OwnProps> & StaticFunctions = ({ isReadOnly, dokument }) => (
  <>
    <FormattedMessage id="SoknadsfristVilkarForm.Dato" />
    {dokument.map((dok, index) => (
      <Fragment key={dok.journalpostId}>
        <p>
          {dok.type} (journalpostId: {dok.journalpostId}) innsendt {formatDate(dok.innsendingstidspunkt)}
        </p>
        <DatepickerField
          name={`dokument.${index}.dato`}
          // label={{ id: 'SoknadsfristVilkarForm.Dato' }}
          validate={[required, hasValidDate]}
          readOnly={isReadOnly}
        />
      </Fragment>
    ))}
  </>
);

VilkarDokument.buildInitialValues = (dokument: DokumentStatus[]) =>
  dokument.reduce(
    (acc, curr, index) => {
      acc.dokument[index] = { dato: formatDate(curr.innsendingstidspunkt) };
      return acc;
    },
    { dokument: [] },
  );

export default VilkarDokument;
