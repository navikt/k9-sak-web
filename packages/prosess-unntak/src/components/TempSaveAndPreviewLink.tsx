import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useEffect, useState } from 'react';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import unntakApi from '@k9-sak-web/behandling-unntak/src/data/unntakBehandlingApi';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from './tempsaveAndPreviewLink.less';

const transformValues = (values: any, aksjonspunktCode: string) => ({
  fritekstTilBrev: values.fritekstTilBrev,
  begrunnelse: values.begrunnelse,
  kode: aksjonspunktCode,
});

const getBrevData = (tekst: string) => {
  return {
    dokumentdata: tekst && { fritekst: tekst },
    dokumentMal: dokumentMalType.UTLED
  };
};

interface OwnProps {
  formValues: any;
  saveKlage: (params: any) => void;
  aksjonspunktCode: string;
  readOnly: boolean;
  previewCallback: (brevData: any) => void;
  hasFinishedUnntakUnntak: boolean;
  resetSaveUnntak: () => void;
}

const useForhaandsvise = (
  readOnly: boolean,
  hasFinishedUnntakUnntak: boolean,
  previewCallback: (data) => void,
  formValues: any,
  resetSaveUnntak: () => void,
) => {
  const [skalForhaandsvise, setSkalForhaandsvise] = useState(false);
  useEffect(() => {
    if (!readOnly && hasFinishedUnntakUnntak && skalForhaandsvise) {
      previewCallback(getBrevData(formValues.fritekstTilBrev));
      setSkalForhaandsvise(false);
      resetSaveUnntak();
    }
  }, [
    skalForhaandsvise,
    hasFinishedUnntakUnntak,
    readOnly,
    formValues.fritekstTilBrev,
    previewCallback,
    resetSaveUnntak,
  ]);

  return setSkalForhaandsvise;
};

export const TempSaveAndPreviewKlageLink: FunctionComponent<OwnProps> = ({
  formValues,
  saveKlage,
  aksjonspunktCode,
  readOnly,
  previewCallback,
  hasFinishedUnntak,
  resetSaveUnntak,
}) => {
  const setSkalForhaandsvise = useForhaandsvise(
    readOnly,
    hasFinishedUnntak,
    previewCallback,
    formValues,
    resetSaveUnntak,
  );

  const tempSave = event => {
    saveKlage(transformValues(formValues, aksjonspunktCode));
    setSkalForhaandsvise(true);
    event.preventDefault();
  };

  return (
    <div>
      {!readOnly && (
        <a
          href=""
          onClick={tempSave}
          onKeyDown={e => (e.keyCode === 13 ? tempSave(e) : null)}
          className={classNames(styles.previewLink, 'lenke lenke--frittstaende')}
        >
          <FormattedMessage id="Unntak.TempSaveAndPreviewButton" />
        </a>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  hasFinishedUnntak: !!unntakApi.SAVE_KLAGE_VURDERING.getRestApiFinished()(state),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({ resetSaveUnntak: unntakApi.SAVE_KLAGE_VURDERING.resetRestApi() }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TempSaveAndPreviewKlageLink);
