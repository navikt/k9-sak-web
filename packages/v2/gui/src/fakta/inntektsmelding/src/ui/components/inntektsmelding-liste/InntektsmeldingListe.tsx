import type { JSX, ReactNode } from 'react';
import type { Status } from '../../../types/KompletthetData';
import InntektsmeldingMottattItem from '../inntektsmelding-mottatt-item/InntektsmeldingMottattItem';
import InntektsmeldingAdvarsel from '../inntektsmelding-mangler-item/InntektsmeldingAdvarselItem';

interface PeriodListItemProps {
  status: Status[];
}

interface RenderListItemProps {
  status: Status;
}

const RenderListItem = ({ status }: RenderListItemProps): JSX.Element => {
  const listItem = (children: ReactNode) => (
    <li className="mt-3" key={status.journalpostId}>
      {children}
    </li>
  );
  if (status.status === 'MOTTATT') {
    return listItem(<InntektsmeldingMottattItem status={status} />);
  }

  return listItem(<InntektsmeldingAdvarsel status={status} />);
};

const InntektsmeldingListe = ({ status }: PeriodListItemProps): JSX.Element => (
  <ul className="m-0 list-none p-0">
    {status.map((v, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <RenderListItem key={index} status={v} />
    ))}
  </ul>
);

export default InntektsmeldingListe;
