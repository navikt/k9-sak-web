export type ProsessBehandling = Readonly<{
  id: number;
  uuid: string;
  versjon: number;
  type: Readonly<{ kode: string }>;
}>;
