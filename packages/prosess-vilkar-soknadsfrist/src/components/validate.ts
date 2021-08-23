import { isRequiredMessage } from '@fpsak-frontend/utils';

const validate = (
  values: { avklarteKrav: any; erVilkarOk: boolean; avslagCode: string } = {
    avklarteKrav: [],
    erVilkarOk: false,
    avslagCode: '',
  },
) => {
  const errors: {
    avklarteKrav?: Array<{
      erVilkarOk?: string | { id: string }[];
      begrunnelse?: string | { id: string }[];
    }>;
    erVilkarOk?: string | { id: string }[];
    avslagCode?: string | { id: string }[];
  } = {};

  if (Array.isArray(values.avklarteKrav)) {
    values.avklarteKrav.forEach((krav, index) => {
      if (typeof krav.erVilkarOk === 'undefined') {
        if (!errors.avklarteKrav) {
          errors.avklarteKrav = [];
        }

        if (!errors.avklarteKrav[index]) {
          errors.avklarteKrav[index] = {};
        }

        errors.avklarteKrav[index].erVilkarOk = isRequiredMessage();
      }
      if (!krav.begrunnelse || krav.begrunnelse.length < 3 || krav.begrunnelse.length >= 1500) {
        if (!errors.avklarteKrav) {
          errors.avklarteKrav = [];
        }

        if (!errors.avklarteKrav[index]) {
          errors.avklarteKrav[index] = {};
        }

        errors.avklarteKrav[index].begrunnelse = isRequiredMessage();
      }
    });
  }

  return errors;
};

export default validate;
