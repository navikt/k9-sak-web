import { visningsdato, isValidDate } from '@fpsak-frontend/utils';

const formaterDato = dato => (isValidDate(dato) ? visningsdato(dato) : '-');

export default formaterDato;
