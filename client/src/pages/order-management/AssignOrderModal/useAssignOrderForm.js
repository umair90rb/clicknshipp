import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function useAssignOrderForm() {
  const assignOrderForm = useFormik({
    initialValues: {
      brand: null,
      chanel: null,
      users: [],
      type: '',
      orders: [],
      assignee: []
    },
    validationSchema: Yup.object().shape({
      brand: Yup.mixed()
        .test('is-number-or-string', 'Must be a number or a string!', (value) => typeof value === 'number' || typeof value === 'string')
        .required('Please select brand!'),
      chanel: Yup.mixed()
        .test('is-number-or-string', 'Must be a number or a string!', (value) => typeof value === 'number' || typeof value === 'string')
        .required('Please select chanel!'),
      type: Yup.string().required('Please select orders type that need to assign/reassign!'),
      users: Yup.array()
        .of(
          Yup.mixed().test(
            'is-number-or-string',
            'Must be a number or a string!',
            (value) => typeof value === 'number' || typeof value === 'string'
          )
        )
        .min(1, 'Please select at least one agent!'),
      orders: Yup.array().of(Yup.number()).min(1, 'Please add at least one order to be assigned!'),
      assignee: Yup.array()
        .of(
          Yup.mixed().test(
            'is-number-or-string',
            'Must be a number or a string!',
            (value) => typeof value === 'number' || typeof value === 'string'
          )
        )
        .min(1, 'Please add at least one agent to assign order!')
    }),
    onSubmit: (values) => {
      console.log(values, 'values');
    }
  });

  return assignOrderForm;
}
