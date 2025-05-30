import { RadioGroupPanelRHF, TextAreaRHF } from '@fpsak-frontend/form';
import { FormWithButtons } from '@k9-sak-web/gui/shared/formWithButtons/FormWithButtons.js';
import React, { useContext, type JSX } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { RettVedDød } from '../../../types/RettVedDød';
import RettVedDødUtfallType from '../../../types/RettVedDødType';
import required from '../../../validators/required';
import ContainerContext from '../../context/ContainerContext';

export enum FieldName {
  RETT_VED_DØD_TYPE = 'rettVedDødType',
  VURDERING = 'vurdering',
}

interface RettVedDødFormState {
  [FieldName.VURDERING]: string;
  [FieldName.RETT_VED_DØD_TYPE]: RettVedDødUtfallType;
}

interface RettVedDødFormProps {
  rettVedDød?: RettVedDød;
  onCancelClick: () => void;
}

const RettVedDødForm = ({ rettVedDød, onCancelClick }: RettVedDødFormProps): JSX.Element => {
  const formMethods = useForm({
    defaultValues: {
      [FieldName.VURDERING]: rettVedDød?.vurdering,
      [FieldName.RETT_VED_DØD_TYPE]: rettVedDød?.rettVedDødType,
    },
  });
  const { readOnly, onFinished } = useContext(ContainerContext);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (formState: RettVedDødFormState) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2.5 * 1000);
    const { vurdering, rettVedDødType } = formState;
    onFinished({ vurdering, rettVedDødType });
  };

  return (
    <div className="mt-8">
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <FormProvider {...formMethods}>
        <FormWithButtons
          onSubmit={formMethods.handleSubmit(handleSubmit)}
          buttonLabel="Bekreft og fortsett"
          cancelButtonDisabled={isSubmitting}
          submitButtonDisabled={isSubmitting}
          shouldShowSubmitButton={!readOnly}
          onAvbryt={onCancelClick}
          smallButtons
        >
          <div className="hide-legend">
            <RadioGroupPanelRHF
              question="Vurder hvor lang periode søker har rett på pleiepenger ved barnets død."
              radios={[
                {
                  value: RettVedDødUtfallType.RETT_6_UKER,
                  label:
                    'Søker har mottatt pleiepenger i mindre enn 3 år og har rett på 30 dager (6 uker) med pleiepenger jf § 9-10, fjerde ledd, første punktum.',
                },
                {
                  value: RettVedDødUtfallType.RETT_12_UKER,
                  label:
                    'Søker har mottatt 100 % pleiepenger i 3 år eller mer og har rett på 3 måneder med pleiepenger jf § 9-10, fjerde ledd, andre punktum. ',
                },
              ]}
              name={FieldName.RETT_VED_DØD_TYPE}
              validators={{ required }}
              disabled={readOnly}
            />
          </div>
          <div className="mt-3 max-w-xl">
            <TextAreaRHF label="Vurdering" name={FieldName.VURDERING} validators={{ required }} disabled={readOnly} />
          </div>
        </FormWithButtons>
      </FormProvider>
    </div>
  );
};

export default RettVedDødForm;
