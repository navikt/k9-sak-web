import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import { Link } from '@navikt/ds-react';
import type { JSX } from 'react';
import useContainerContext from '../../../context/useContainerContext';
import type { DokumentOpplysninger } from '../../../types/ContainerContract';
import type { Status } from '../../../types/KompletthetData';
import ArbeidsgiverTekst from '../arbeidsgiver-tekst/ArbeidsgiverTekst';
import ListItem from '../list-item/ListItem';

interface MottattContentProps {
  dokumentLink: string;
}

const MottattContent = ({ dokumentLink }: MottattContentProps) => (
  <div className="flex items-start">
    <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--ax-bg-success-strong)' }} />
    <div>
      <span className="ml-2">Mottatt</span>
      <Link className="ml-4" href={dokumentLink} target="_blank">
        Vis inntektsmelding
      </Link>
    </div>
  </div>
);

interface InntektsmeldingMottattItemProps {
  status: Status;
}

const finnDokumentLink = (dokumenter: DokumentOpplysninger[], journalpostId: string): DokumentOpplysninger | undefined =>
  dokumenter.find(dokument => dokument.journalpostId === journalpostId);

const InntektsmeldingMottattItem = ({ status }: InntektsmeldingMottattItemProps): JSX.Element => {
  const { dokumenter } = useContainerContext();
  const dokumentLink = finnDokumentLink(dokumenter ?? [], status.journalpostId)?.href;
  const firstColumnRenderer = () => <ArbeidsgiverTekst arbeidsgiver={status.arbeidsgiver} />;
  const secondColumnRenderer = () => <MottattContent dokumentLink={dokumentLink ?? '#'} />;
  return <ListItem firstColumnRenderer={firstColumnRenderer} secondColumnRenderer={secondColumnRenderer} />;
};

export default InntektsmeldingMottattItem;
