import type { Template } from '@k9-sak-web/backend/k9formidling/models/Template.js';

export interface Brevmaler {
  [index: string]: Template;
}

export default Brevmaler;
