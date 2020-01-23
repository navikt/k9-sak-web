// TODO (Anders) legg til i types-pakka når den er i master
interface Dokumentlenke {
  tag: string;
  journalpostId: string;
  dokumentId: string;
  utgått: boolean;
  url: string;
}

export default Dokumentlenke;
