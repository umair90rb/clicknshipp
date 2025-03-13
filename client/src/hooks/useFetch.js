import React from 'react';
import { useDispatch } from 'react-redux';

export default function useFetch(cb, body) {
  const dispatch = useDispatch();
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    dispatch(cb(body))
      .then(({ type, payload }) => {
        if (/fulfilled/g.test(type)) {
          setData(payload?.data);
          setError(null);
          setLoading(false);
        } else {
          setData(null);
          setError(payload?.data || 'Error in fetching!');
          setLoading(false);
        }
      })
      .catch((error) => {
        setData(null);
        setError(error);
        setLoading(false);
      });
  }, [body]);

  return { data, loading, error };
}
