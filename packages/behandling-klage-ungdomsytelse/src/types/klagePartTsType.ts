type KlagePart = Readonly<{
  identifikasjon: {
    id: string;
    type: string;
  };
  rolleType: string;
}>;

export default KlagePart;
