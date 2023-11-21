import { prettifyDateString } from '@navikt/k9-fe-date-utils';
import { RadioGroupPanel } from '@navikt/k9-fe-form-utils';
import { Box, Margin } from '@navikt/ft-plattform-komponenter';
import { Link } from '@navikt/ds-react';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import LinkRel from '../../../constants/LinkRel';
import Dokument, { dokumentLabel } from '../../../types/Dokument';
import { StrukturerDokumentFormFieldName as FieldName } from '../../../types/StrukturerDokumentFormState';
import { findLinkByRel } from '../../../util/linkUtils';
import ContainerContext from '../../context/ContainerContext';
import { required } from '../../form/validators';
import { ikkeDuplikatValue } from '../strukturer-dokument-form/StrukturerDokumentForm';

interface DuplikatRadiobuttonsProps {
  dokument: Dokument;
  strukturerteDokumenter: Dokument[];
}

const DuplikatRadiobuttons = ({ dokument, strukturerteDokumenter }: DuplikatRadiobuttonsProps): JSX.Element => {
  const { readOnly } = React.useContext(ContainerContext);
  const formMethods = useFormContext();
  const { watch } = formMethods;
  const dokumenttype = watch(FieldName.INNEHOLDER_MEDISINSKE_OPPLYSNINGER);
  const dokumentDatert = watch(FieldName.DATERT);

  const potensielleDuplikater = strukturerteDokumenter.filter(
    ({ datert, type, id, duplikatAvId }) =>
      datert === dokumentDatert && type === dokumenttype && id !== dokument.id && duplikatAvId == null,
  );

  const harPotensielleDuplikater = potensielleDuplikater.length > 0;
  const getDuplikatRadios = () => {
    const radios = potensielleDuplikater.map(potensiellDuplikat => {
      const dokumentLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, potensiellDuplikat.links);
      return {
        label: (
          <Link href={dokumentLink.href} target="_blank">
            {`${dokumentLabel[potensiellDuplikat.type]} - ${prettifyDateString(potensiellDuplikat.datert)}`}
          </Link>
        ),
        value: potensiellDuplikat.id,
      };
    });
    radios.push({ label: <span>Dokumentet er ikke et duplikat</span>, value: ikkeDuplikatValue });
    return radios;
  };

  if (!harPotensielleDuplikater) {
    return null;
  }

  return (
    <Box marginTop={Margin.xLarge}>
      <RadioGroupPanel
        name={FieldName.DUPLIKAT_AV_ID}
        disabled={readOnly}
        question={
          <>
            Det finnes ett eller flere dokumenter datert til samme dato.
            <br />
            Velg om dette dokumentet er et duplikat av ett av følgende dokumenter:
          </>
        }
        radios={getDuplikatRadios()}
        validators={{ required }}
      />
    </Box>
  );
};

export default DuplikatRadiobuttons;
