import { formatDate, isValidDate } from '@fpsak-frontend/utils';

const formaterDato = (dato: string) => (isValidDate(dato) ? formatDate(dato) : '-');

export default formaterDato;
