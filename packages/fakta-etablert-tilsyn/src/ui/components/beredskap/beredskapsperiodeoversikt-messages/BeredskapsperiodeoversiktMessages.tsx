import { Alert, Box } from '@navikt/ds-react';
import BeredskapType from '../../../../types/BeredskapType';
import { getStringMedPerioder } from '../../../../util/periodUtils';

interface BeredskapsperiodeoversiktMessagesProps {
  beredskapData: BeredskapType;
}

const BeredskapsperiodeoversiktMessages = ({ beredskapData }: BeredskapsperiodeoversiktMessagesProps) => {
  if (!beredskapData.harPerioder()) {
    return <p>Søker har ikke oppgitt at det er behov for beredskap.</p>;
  }
  if (beredskapData.harPerioderTilVurdering()) {
    const perioderTilVurdering = beredskapData.finnPerioderTilVurdering().map(({ periode }) => periode);
    return (
      <Box.New marginBlock="0 6">
        <Alert size="small" variant="warning">
          {`Vurder behov for beredskap i ${getStringMedPerioder(perioderTilVurdering)}.`}
        </Alert>
      </Box.New>
    );
  }
  return null;
};

export default BeredskapsperiodeoversiktMessages;
