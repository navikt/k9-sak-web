import classNames from "classnames";
import {FormattedMessage} from "react-intl";
import React from "react";
import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import dokumentMalType from "@fpsak-frontend/kodeverk/src/dokumentMalType";
import klageApi from "@fpsak-frontend/behandling-klage/src/data/klageBehandlingApi";
import {connect} from "react-redux";
import styles from "./tempsaveAndPreviewKlageLink.less";


const transformValues = (values, aksjonspunktCode) => ({
  klageMedholdArsak: (values.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE
    || values.klageVurdering === klageVurderingType.OPPHEVE_YTELSESVEDTAK) ? values.klageMedholdArsak : null,
  klageVurderingOmgjoer: values.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE ? values.klageVurderingOmgjoer : null,
  klageVurdering: values.klageVurdering,
  fritekstTilBrev: values.fritekstTilBrev,
  begrunnelse: values.begrunnelse,
  kode: aksjonspunktCode,
});

const getBrevData = (tekst) => {
  return {
    fritekst: tekst || '',
    dokumentMal: dokumentMalType.UTLED_KLAGE,
  };
};


interface OwnProps {
  formValues;
  saveKlage: (params: {}) => undefined;
  aksjonspunktCode: string;
  readOnly: boolean;
  previewCallback: (brevData: {}) => undefined;
  hasFinishedSaveKlage: boolean;
  hasStartedSaveKlage: boolean;
}

interface StateProps {
  skalForhaandsvise: boolean
}


export class TempsaveAndPreviewKlageLink extends React.Component<OwnProps, StateProps> {
  constructor(props) {
    super(props);
    this.state = {
      skalForhaandsvise: false
    }
  }

  tempSave = (event) => {
    const {saveKlage, formValues, aksjonspunktCode} = this.props;
    saveKlage(transformValues(formValues, aksjonspunktCode));
    this.setState({skalForhaandsvise: true});
    event.preventDefault();
  };

  forhåndsvisKlage = () => {
    const {previewCallback, formValues} = this.props;
    previewCallback(getBrevData(formValues.fritekstTilBrev));
    this.setState({skalForhaandsvise: false})
  };


  render() {
    const {
      readOnly,
      hasFinishedSaveKlage,
      hasStartedSaveKlage
    } = this.props;

    const {skalForhaandsvise} = this.state;

    return (
      <div> {!readOnly && (
        <a
          href=""
          onClick={(e) => {
            this.tempSave(e);
          }}
          onKeyDown={(e) => (e.keyCode === 13 ? this.tempSave(e) : null)}
          className={classNames(styles.previewLink, 'lenke lenke--frittstaende')}
        >
          <FormattedMessage id="Klage.ResolveKlage.TempSaveAndPreviewButton"/>
        </a>)
      }
        {!readOnly && !hasStartedSaveKlage && hasFinishedSaveKlage && skalForhaandsvise && this.forhåndsvisKlage()}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  hasFinishedSaveKlage: !!klageApi.SAVE_KLAGE_VURDERING.getRestApiFinished()(state),
  hasStartedSaveKlage: !!klageApi.SAVE_KLAGE_VURDERING.getRestApiStarted()(state),
});

export default connect(mapStateToProps)(TempsaveAndPreviewKlageLink);
