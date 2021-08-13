type RelatertFagsak = Readonly<{
  relaterteSøkere: {
    saksnummer: string;
    søkerIdent: string;
    søkerNavn: string;
  }[];
}>;

export default RelatertFagsak;
