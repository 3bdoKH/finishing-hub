import { useState, useCallback } from "react";
import useApi from "./useApi";

/**
 * A custom hook to handle form state and submission
 *
 * @param {Object} initialValues - Initial form values
 * @param {Function} submitCallback - Function to call on form submit
 * @returns {Object} - { values, handleChange, handleSubmit, loading, error, success }
 */
const useForm = (initialValues = {}, submitCallback) => {
  const [values, setValues] = useState(initialValues);
  const [success, setSuccess] = useState(false);
  const { loading, error, execute } = useApi(submitCallback);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      try {
        await execute(values);
        setSuccess(true);
        resetForm();

        // Reset success after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);

        return true;
      } catch (err) {
        return false;
      }
    },
    [execute, resetForm, values]
  );

  return {
    values,
    setValues,
    handleChange,
    handleSubmit,
    resetForm,
    loading,
    error,
    success,
  };
};

export default useForm;
