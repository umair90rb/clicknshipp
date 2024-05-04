import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CenterCircularLoader from 'components/CenterCircularLoader';
import { fetchUsersWithPermission } from 'store/slices/user/fetchUser';
import { Grid, Button, FormControlLabel, FormGroup, Checkbox, Typography } from '@mui/material';
import { permissions } from 'constants/roleAndPermissions';
import { fetchAssignOrders } from 'store/slices/order/fetchOrder';
import { setMessage } from 'store/slices/util/utilSlice';

export default function AssignOrderModal({ selectedRows, hideModal }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [assignee, setAssignee] = useState([]);
  const [toAssign, setToAssign] = useState([]);

  const getAssignee = () => {
    setLoading(true);
    return dispatch(fetchUsersWithPermission({ body: { permissions: [permissions.assignOrders] } })).then(({ type, payload }) => {
      if (type === 'usersWithPermissions/fetch/fulfilled') {
        setAssignee(payload.data.users);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };

  const assignOrders = () => {
    setAssigning(true);
    return dispatch(fetchAssignOrders({ body: { agentIds: toAssign, orderIds: selectedRows } })).then(({ type, payload, error }) => {
      if (type === 'assign/orders/fetch/fulfilled') {
        setAssigning(false);
        dispatch(setMessage({ type: 'success', message: payload.message }));
        return hideModal();
      }
      setAssigning(false);
      return dispatch(setMessage({ type: 'error', message: error.message || 'Something goes wrong!' }));
    });
  };

  const handleChange = (event) => {
    if (event.target.checked) {
      setToAssign((toAssign) => [...toAssign, Number(event.target.name)]);
    } else {
      setToAssign((toAssign) => toAssign.filter((a) => a !== Number(event.target.name)));
    }
  };

  useLayoutEffect(() => {
    getAssignee();
  }, []);

  if (loading) {
    return <CenterCircularLoader />;
  }

  return (
    <div>
      <Typography>Assign {selectedRows.length > 0 ? selectedRows.length : ''} orders to </Typography>
      <FormGroup>
        {assignee.map((a, index) => (
          <FormControlLabel
            key={index}
            control={<Checkbox checked={toAssign.includes(a.id)} onChange={handleChange} name={a.id} />}
            label={`${a.name} (${a.email})`}
          />
        ))}
      </FormGroup>
      <Grid container sx={{ flexGrow: 1 }}>
        <Grid xs display="flex" justifyContent="center" alignItems="center">
          <Button onClick={assignOrders} disabled={!toAssign.length || assigning} sx={{ flexGrow: 1 }} variant="contained">
            Assign
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
