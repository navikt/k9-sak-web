import Kjønnkode from '@k9-sak-web/types/src/Kjønnkode';

interface Person {
  navn: {
    fornavn: string;
    mellomavn?: string;
    etternavn: string;
  };
  kjønn: Kjønnkode;
}

export default Person;
