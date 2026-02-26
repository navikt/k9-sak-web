import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { isValidDate } from '@k9-sak-web/lib/dateUtils/dateUtils.js';

const formaterDato = (dato: string) => (isValidDate(dato) ? formatDate(dato) : '-');

export default formaterDato;
