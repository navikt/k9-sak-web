export type KodeverkObject = Readonly<{
  kode: string;
  kodeverk: string;
  navn: string;
}>;

export type KodeverkV2 = KodeverkObject | string;
