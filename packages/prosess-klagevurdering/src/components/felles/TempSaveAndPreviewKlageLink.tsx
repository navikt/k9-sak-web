import classNames from 'classnames';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';

import styles from './tempsaveAndPreviewKlageLink.module.css';

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

const getBrevData = (tekst: string) => ({
  dokumentdata: tekst && { fritekst: tekst },
  dokumentMal: dokumentMalType.UTLED,
});

interface OwnProps {
  formValues: any;
  saveKlage: (params: any) => Promise<any>;
  aksjonspunktCode: string;
  readOnly: boolean;
  previewCallback: (brevData: any) => void;
  hasFinishedSaveKlage: boolean;
  resetSaveKlage: () => void;
}

export const TempSaveAndPreviewKlageLink = ({
  formValues,
  saveKlage,
  aksjonspunktCode,
  readOnly,
  previewCallback,
}: Partial<OwnProps>) => {
  const tempSave = event => {
    saveKlage(transformValues(formValues, aksjonspunktCode)).then(() =>
      previewCallback(getBrevData(formValues.fritekstTilBrev)),
    );
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
          data-testid="previewLink"
        >
          <FormattedMessage id="Klage.ResolveKlage.TempSaveAndPreviewButton" />
        </a>
      )}
    </div>
  );
};

export default TempSaveAndPreviewKlageLink;
