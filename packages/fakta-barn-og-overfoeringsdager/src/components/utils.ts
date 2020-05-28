import { visningsdato, isValidDate } from '@fpsak-frontend/utils';

const formaterDato = (dato: string) => (isValidDate(dato) ? visningsdato(dato) : '-');

export default formaterDato;
