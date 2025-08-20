import { Alert, Box } from '@navikt/ds-react';
import NattevåkType from '../../../../types/NattevåkType';
import { getStringMedPerioder } from '../../../../util/periodUtils';

interface NattevåksperiodeoversiktMessagesProps {
  nattevåkData: NattevåkType;
}

const NattevåksperiodeoversiktMessages = ({ nattevåkData }: NattevåksperiodeoversiktMessagesProps) => {
  if (!nattevåkData.harPerioder()) {
    return <p>Søker har ikke oppgitt at det er behov for nattevåk.</p>;
  }
  if (nattevåkData.harPerioderTilVurdering()) {
    const perioderTilVurdering = nattevåkData.finnPerioderTilVurdering().map(({ periode }) => periode);
    return (
      <Box.New marginBlock="0 6">
        <Alert size="small" variant="warning">
          {`Vurder behov for nattevåk i ${getStringMedPerioder(perioderTilVurdering)}.`}
        </Alert>
      </Box.New>
    );
  }
  return null;
};

export default NattevåksperiodeoversiktMessages;
