import { isValidDate, visningsdato } from '@k9-sak-web/utils';

const formaterDato = (dato: string) => (isValidDate(dato) ? visningsdato(dato) : '-');

export default formaterDato;
