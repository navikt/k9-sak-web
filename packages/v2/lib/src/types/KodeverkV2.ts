export type KodeverkV2 = Readonly<
  | {
      kode: string;
      kodeverk: string;
      navn: string;
    }
  | string
>;

export default KodeverkV2;
