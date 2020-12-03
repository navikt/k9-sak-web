function isTrue(value: any): boolean {
  let parsed = '';

  try {
    parsed = JSON.parse(value);
  } catch (err) {
    parsed = value;
  }

  return `${parsed}`.toLowerCase() === 'true';
}

const featureToggle: { [index: string]: boolean } = {
  UNNTAKSBEHANDLING: isTrue(process.env.UNNTAKSBEHANDLING),
  DOKUMENTDATA: isTrue(process.env.DOKUMENTDATA),
  VARSELTEKST: isTrue(process.env.VARSELTEKST),
};

export default featureToggle;
