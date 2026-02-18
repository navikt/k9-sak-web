import { DatepickerRHF, RadioGroupPanelRHF } from '@fpsak-frontend/form';
import { dateConstants } from '@fpsak-frontend/utils';
import { DetailView } from '@k9-sak-web/gui/shared/detailView/DetailView.js';
import { FormWithButtons } from '@k9-sak-web/gui/shared/formWithButtons/FormWithButtons.js';
import { Box } from '@navikt/ds-react';
import React, { type JSX } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import LinkRel from '../../../constants/LinkRel';
import { Dokumenttype } from '../../../types/Dokument';
import StrukturerDokumentFormProps from '../../../types/StrukturerDokumentFormProps';
import {
  StrukturerDokumentFormFieldName as FieldName,
  StrukturerDokumentFormState,
} from '../../../types/StrukturerDokumentFormState';
import { lagStrukturertDokument } from '../../../util/dokumentUtils';
import { findLinkByRel } from '../../../util/linkUtils';
import ContainerContext from '../../context/ContainerContext';
import { dateIsNotInTheFuture, required } from '../../form/validators';
import DokumentKnapp from '../dokument-knapp/DokumentKnapp';
import DuplikatRadiobuttons from '../duplikat-radiobuttons/DuplikatRadiobuttons';

const StrukturerDokumentOpplaeringspengerForm = ({
  dokument,
  onSubmit,
  editMode,
  isSubmitting,
  strukturerteDokumenter,
}: StrukturerDokumentFormProps): JSX.Element => {
  const { readOnly } = React.useContext(ContainerContext);

  const formMethods = useForm<StrukturerDokumentFormState>({
    defaultValues: editMode && {
      [FieldName.INNEHOLDER_MEDISINSKE_OPPLYSNINGER]: dokument.type,
      [FieldName.DATERT]: dokument.datert,
    },
  });

  const dokumentLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, dokument.links);

  const lagNyttStrukturertDokument = (formState: StrukturerDokumentFormState) => {
    onSubmit(lagStrukturertDokument(formState, dokument));
  };

  const buttonLabel = editMode === true ? 'Oppdater' : 'Bekreft';

  return (
    <DetailView title="Om dokumentet">
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <FormProvider {...formMethods}>
        <FormWithButtons
          buttonLabel={buttonLabel}
          onSubmit={formMethods.handleSubmit(lagNyttStrukturertDokument)}
          submitButtonDisabled={isSubmitting}
          shouldShowSubmitButton={!readOnly}
          smallButtons
        >
          <Box.New marginBlock="8 0">
            <DokumentKnapp href={dokumentLink.href} />
          </Box.New>
          <Box.New marginBlock="8 0">
            <RadioGroupPanelRHF
              name={FieldName.INNEHOLDER_MEDISINSKE_OPPLYSNINGER}
              disabled={readOnly}
              question="Inneholder dokumentet medisinske opplysninger eller dokumentasjon av opplæring?"
              radios={[
                {
                  label: 'Ja, legeerklæring fra lege eller helseinstitusjon',
                  value: Dokumenttype.LEGEERKLÆRING_ANNEN,
                },
                {
                  label: 'Ja, dokumentasjon av opplæring',
                  value: Dokumenttype.DOKUMENTASJON_AV_OPPLÆRING,
                },
                {
                  label: 'Ja, både legeerklæring og dokumentasjon av opplæring',
                  value: Dokumenttype.LEGEERKLÆRING_MED_DOKUMENTASJON_AV_OPPLÆRING,
                },
                {
                  label: 'Nei, dokumentet inneholder ikke medisinske opplysninger eller dokumentasjon av opplæring',
                  value: Dokumenttype.MANGLER_MEDISINSKE_OPPLYSNINGER,
                },
              ]}
              validators={{ required }}
            />
          </Box.New>
          <Box.New marginBlock="8 0">
            <DatepickerRHF
              name={FieldName.DATERT}
              disabled={readOnly}
              label="Hvilken dato er dokumentet datert?"
              defaultValue=""
              validators={{ required, dateIsNotInTheFuture }}
              toDate={dateConstants.today.toDate()}
              inputId="datertField"
            />
          </Box.New>
          <DuplikatRadiobuttons dokument={dokument} strukturerteDokumenter={strukturerteDokumenter} />
        </FormWithButtons>
      </FormProvider>
    </DetailView>
  );
};

export default StrukturerDokumentOpplaeringspengerForm;
