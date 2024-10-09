export type FeilutbetalingAarsak = {
  hendelseTyper: {
    hendelseType: string;
    hendelseUndertyper: string[];
  }[];
  ytelseType: string; // #Kodeverk denne står ikke i proptypes, men fra koden ser det ut som den skal være her
};
