function isTrue(str) {
  return `${str}`.toLowerCase() === 'true';
}

const featureToggle = {
  UNNTAKSBEHANDLING: isTrue(process.env.UNNTAKSBEHANDLING),
  DOKUMENTDATA: isTrue(process.env.DOKUMENTDATA),
  VARSELTEKST: isTrue(process.env.VARSELTEKST),
};

export default featureToggle;
