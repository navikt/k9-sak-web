import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent, useEffect, useState } from 'react';
import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
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
  return {
    dokumentdata: tekst && { fritekst: tekst },
    dokumentMal: dokumentMalType.UTLED,
  };
};

interface OwnProps {
  formValues: any;
  lagreKlageVurdering: (params: any) => void;
  aksjonspunktCode: string;
  readOnly: boolean;
  previewCallback: (brevData: any) => void;
  hasFinishedSaveKlage: boolean;
  resetSaveKlage: () => void;
}

const useForhaandsvise = (
  readOnly: boolean,
  hasFinishedSaveKlage: boolean,
  previewCallback: (data) => void,
  formValues: any,
  resetSaveKlage: () => void,
) => {
  const [skalForhaandsvise, setSkalForhaandsvise] = useState(false);
  useEffect(() => {
    if (!readOnly && hasFinishedSaveKlage && skalForhaandsvise) {
      previewCallback(getBrevData(formValues.fritekstTilBrev));
      setSkalForhaandsvise(false);
      resetSaveKlage();
    }
  }, [skalForhaandsvise, hasFinishedSaveKlage, readOnly, formValues.fritekstTilBrev, previewCallback, resetSaveKlage]);

  return setSkalForhaandsvise;
};

export const TempSaveAndPreviewKlageLink: FunctionComponent<OwnProps> = ({
  formValues,
  lagreKlageVurdering,
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

  const tempSave = event => {
    lagreKlageVurdering(transformValues(formValues, aksjonspunktCode));
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
          <FormattedMessage id="Klage.ResolveKlage.TempSaveAndPreviewButton" />
        </a>
      )}
    </div>
  );
};

export default TempSaveAndPreviewKlageLink;
