import type { BehandleKlageFormKaFormValues } from '../ka/BehandleKlageFormKaFormValues.js';
import type { SaveKlageParams } from './SaveKlageParams.js';
import { isKlageMedholdÅrsak, KlageMedholdÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/klage/KlageMedholdÅrsak.js';
import { isKlageVurdering, KlageVurdering } from '@k9-sak-web/backend/ungsak/kodeverk/klage/KlageVurdering.js';
import {
  isKlageVurderingOmgjør,
  KlageVurderingOmgjør,
} from '@k9-sak-web/backend/ungsak/kodeverk/klage/KlageVurderingOmgjør.js';

export const formValuesToSaveValues = (
  values: BehandleKlageFormKaFormValues,
  aksjonspunktCode: string,
): SaveKlageParams => {
  let klageMedholdArsak: KlageMedholdÅrsak | undefined;
  if (
    values.klageVurdering == KlageVurdering.MEDHOLD_I_KLAGE ||
    values.klageVurdering == KlageVurdering.OPPHEVE_YTELSESVEDTAK
  ) {
    if (values.klageMedholdArsak == null || isKlageMedholdÅrsak(values.klageMedholdArsak)) {
      klageMedholdArsak = values.klageMedholdArsak ?? undefined;
    } else {
      throw new Error(`Ugyldig KlageMedholdÅrsak verdi: ${values.klageMedholdArsak}`);
    }
  }
  let klageVurderingOmgjoer: KlageVurderingOmgjør | undefined;
  if (values.klageVurdering === KlageVurdering.MEDHOLD_I_KLAGE) {
    if (values.klageVurderingOmgjoer == null || isKlageVurderingOmgjør(values.klageVurderingOmgjoer)) {
      klageVurderingOmgjoer = values.klageVurderingOmgjoer ?? undefined;
    } else {
      throw new Error(`Ugyldig KlageVurderingOmgjør verdi: ${values.klageVurderingOmgjoer}`);
    }
  }
  let klageVurdering: KlageVurdering | undefined;
  if (values.klageVurdering == null || isKlageVurdering(values.klageVurdering)) {
    klageVurdering = values.klageVurdering;
  } else {
    throw new Error(`Ugyldig KlageVurdering verdi: ${values.klageVurdering}`);
  }
  return {
    fritekstTilBrev: values.fritekstTilBrev,
    begrunnelse: values.begrunnelse,
    kode: aksjonspunktCode,
    klageMedholdArsak,
    klageVurderingOmgjoer,
    klageVurdering,
  };
};
