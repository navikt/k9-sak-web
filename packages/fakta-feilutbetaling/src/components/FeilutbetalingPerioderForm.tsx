import { SelectField, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';
import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { Table } from '@navikt/ds-react';
import moment from 'moment';
import { connect } from 'react-redux';
import { FeilutbetalingAarsak } from './feilutbetalingAarsak';
import { BehandlingFaktaPeriode } from './feilutbetalingFakta';
import styles from './feilutbetalingPerioderTable.module.css';

const getHendelseUndertyper = (årsakNavn, årsaker) => {
  const årsak = årsaker.find(a => a.hendelseType.kode === årsakNavn);
  return årsak && årsak.hendelseUndertyper.length > 0 ? årsak.hendelseUndertyper : null;
};

interface FeilutbetalingPerioderFormImplProps {
  periode: BehandlingFaktaPeriode;
  årsaker: FeilutbetalingAarsak['hendelseTyper'];
  årsak: string | null;
  elementId: number;
  readOnly: boolean;
  onChangeÅrsak: (event: React.ChangeEvent<HTMLSelectElement>, elementId: number, årsak: string) => void;
  onChangeUnderÅrsak: (event: React.ChangeEvent<HTMLSelectElement>, elementId: number, årsak: string) => void;
}

export const FeilutbetalingPerioderFormImpl = ({
  periode,
  årsak = null,
  elementId,
  årsaker,
  readOnly,
  onChangeÅrsak,
  onChangeUnderÅrsak,
}: FeilutbetalingPerioderFormImplProps) => {
  const hendelseUndertyper = getHendelseUndertyper(årsak, årsaker);
  return (
    <Table.Row shadeOnHover={false}>
      <Table.DataCell>
        {`${moment(periode.fom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(periode.tom).format(DDMMYYYY_DATE_FORMAT)}`}
      </Table.DataCell>
      <Table.DataCell>
        <SelectField
          name={`perioder.${elementId}.årsak`}
          selectValues={årsaker.map(a => (
            <option key={a.hendelseType.kode} value={a.hendelseType.kode}>
              {a.hendelseType.navn}
            </option>
          ))}
          validate={[required]}
          disabled={readOnly}
          onChange={event => onChangeÅrsak(event, elementId, årsak)}
          bredde="m"
          label=""
        />
        {hendelseUndertyper && (
          <SelectField
            name={`perioder.${elementId}.${årsak}.underÅrsak`}
            selectValues={hendelseUndertyper.map(a => (
              <option key={a.kode} value={a.kode}>
                {a.navn}
              </option>
            ))}
            validate={[required]}
            disabled={readOnly}
            onChange={event => onChangeUnderÅrsak(event, elementId, årsak)}
            bredde="m"
            label=""
          />
        )}
      </Table.DataCell>
      <Table.DataCell className={styles.redText}>{periode.belop}</Table.DataCell>
    </Table.Row>
  );
};

interface OwnProps {
  formName: string;
  behandlingId: number;
  behandlingVersjon: number;
  elementId: number;
}

const mapStateToProps = (state, ownProps: OwnProps) => ({
  årsak: behandlingFormValueSelector(
    ownProps.formName,
    ownProps.behandlingId,
    ownProps.behandlingVersjon,
  )(state, `perioder.${ownProps.elementId}.årsak`),
});

const FeilutbetalingPerioderForm = connect(mapStateToProps)(FeilutbetalingPerioderFormImpl);
export default FeilutbetalingPerioderForm;
