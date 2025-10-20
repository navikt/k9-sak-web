type RelatertFagsak = Readonly<{
  relaterteSøkere: {
    saksnummer: string;
    søkerIdent: string;
    søkerNavn: string;
    åpenBehandling: boolean;
  }[];
}>;

export default RelatertFagsak;
