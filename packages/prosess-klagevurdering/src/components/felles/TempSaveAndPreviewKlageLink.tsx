import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useEffect, useState } from 'react';
import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import klageApi from '@fpsak-frontend/behandling-klage/src/data/klageBehandlingApi';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from './tempsaveAndPreviewKlageLink.less';

const transformValues = (values: any, aksjonspunktCode: string) => ({
  klageMedholdArsak:
    values.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE ||
    values.klageVurdering === klageVurderingType.OPPHEVE_YTELSESVEDTAK
      ? values.klageMedholdArsak
      : null,
  klageVurderingOmgjoer:
    values.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE ? values.klageVurderingOmgjoer : null,
  klageVurdering: values.klageVurdering,
  fritekstTilBrev: values.fritekstTilBrev,
  begrunnelse: values.begrunnelse,
  kode: aksjonspunktCode,
});

const getBrevData = (tekst: string) => {
  return { fritekst: tekst || '', dokumentMal: dokumentMalType.UTLED_KLAGE };
};

interface OwnProps {
  formValues: any;
  saveKlage: (params: any) => void;
  aksjonspunktCode: string;
  readOnly: boolean;
  previewCallback: (brevData: any) => void;
  hasFinishedSaveKlage: boolean;
  resetSaveKlage: () => void;
}

function useForhaandsvise(
  readOnly: boolean,
  hasFinishedSaveKlage: boolean,
  previewCallback: (data) => void,
  formValues: any,
  resetSaveKlage: () => void,
) {
  const [skalForhaandsvise, setSkalForhaandsvise] = useState(false);
  useEffect(() => {
    if (!readOnly && hasFinishedSaveKlage && skalForhaandsvise) {
      previewCallback(getBrevData(formValues.fritekstTilBrev));
      setSkalForhaandsvise(false);
      resetSaveKlage();
    }
  }, [skalForhaandsvise, hasFinishedSaveKlage]);

  return setSkalForhaandsvise;
}

export const TempSaveAndPreviewKlageLink: FunctionComponent<OwnProps> = ({
  formValues,
  saveKlage,
  aksjonspunktCode,
  readOnly,
  previewCallback,
  hasFinishedSaveKlage,
  resetSaveKlage,
}) => {
  const setSkalForhaandsvise = useForhaandsvise(
    readOnly,
    hasFinishedSaveKlage,
    previewCallback,
    formValues,
    resetSaveKlage,
  );

  function tempSave(event) {
    saveKlage(transformValues(formValues, aksjonspunktCode));
    setSkalForhaandsvise(true);
    event.preventDefault();
  }

  return (
    <div>
      {!readOnly && (
        <a
          href=""
          onClick={tempSave}
          onKeyDown={e => (e.keyCode === 13 ? tempSave(e) : null)}
          className={classNames(styles.previewLink, 'lenke lenke--frittstaende')}
        >
          <FormattedMessage id="Klage.ResolveKlage.TempSaveAndPreviewButton" />
        </a>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  hasFinishedSaveKlage: !!klageApi.SAVE_KLAGE_VURDERING.getRestApiFinished()(state),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({ resetSaveKlage: klageApi.SAVE_KLAGE_VURDERING.resetRestApi() }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TempSaveAndPreviewKlageLink);
