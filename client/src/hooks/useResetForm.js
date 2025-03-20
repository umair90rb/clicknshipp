import { useEffect } from 'react';

export default function useResetForm(formRef, visible, isRef = true) {
  useEffect(() => {
    if (!visible) {
      if (isRef) {
        formRef.current?.resetForm();
      } else {
        formRef.resetForm();
      }
    }
  }, [visible]);
}
