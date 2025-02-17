import { FormikHelpers, FormikState, FormikValues } from 'formik';

export type CustomFormikProps = {
  validateForm: FormikHelpers<FormikValues>['validateForm'];
  setTouched: FormikHelpers<FormikValues>['setTouched'];
  setFieldValue: FormikHelpers<FormikValues>['setFieldValue'];
  values: FormikState<FormikValues>['values'];
  touched?: FormikState<FormikValues>['touched'];
  errors?: FormikState<FormikValues>['errors'];
};
