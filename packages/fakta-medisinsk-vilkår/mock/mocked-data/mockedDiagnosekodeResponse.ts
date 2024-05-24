import LinkRel from '../../src/constants/LinkRel';
import { mockUrlPrepend } from '../constants';

export default {
  diagnosekoder: ['A001', 'B04'],
  links: [
    {
      rel: LinkRel.ENDRE_DIAGNOSEKODER,
      type: 'POST',
      href: `${mockUrlPrepend}/mock/endre-diagnosekoder`,
      behandlingUuid: 'HER_ER_BEHANDLINGSID',
      versjon: null,
    },
  ],
};
