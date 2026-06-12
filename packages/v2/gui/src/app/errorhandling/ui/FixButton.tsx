import type { ErrorFixAction } from "./ErrorFixAction.ts";
import type { FC } from "react";
import { Button } from "@navikt/ds-react";

export type FixButtonProps = Readonly<{
  fixAction: ErrorFixAction
}>

export const FixButton: FC<FixButtonProps> = ({fixAction: {label, icon, href, callback}}) => {
  const variableProps = callback != null ? {onClick: callback} as const : {href, as: "a"} as const
  return <Button variant="primary" data-color="neutral" size="small" icon={icon} iconPosition="right" {...variableProps}>{label}</Button>
}
