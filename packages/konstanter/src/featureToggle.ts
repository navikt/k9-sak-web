function isTrue(value: any): boolean {
  return `${value}`.toLowerCase() === 'true';
}

const featureToggle: { [index: string]: boolean } = {
  UNNTAKSBEHANDLING: isTrue(process.env.UNNTAKSBEHANDLING),
  DOKUMENTDATA: isTrue(process.env.DOKUMENTDATA),
  VARSELTEKST: isTrue(process.env.VARSELTEKST),
};

export default featureToggle;
