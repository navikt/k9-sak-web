import InputField from "@fpsak-frontend/form/src/InputField";
import React from "react";

export interface OrgnrInputProps {
  readonly name: string;
  readonly label: string;
  readonly error?: string;
}

const OrgnrInputField = ({name, label, error}: OrgnrInputProps) => {
  const parser = (value?: string): string | undefined =>
    value?.replaceAll(/[^0-9]/g, "");
  const validator = (value?: string) => value?.length !== 9 ? [{id: 'ValidationMessage.InvalidOrganisasjonsnummer'}]: undefined;
  // maxLength is more than 9 to allow users to paste in numbers containing some characters/spaces, and let the parser
  // strip those out, e.g. If a user pastes MVA 123 456 789, the component should accept it and convert it to 123456789.
  return <InputField name={name} label={label} parse={parser} maxLength={19} validate={[validator]} feil={error}/>
}

export default OrgnrInputField;
