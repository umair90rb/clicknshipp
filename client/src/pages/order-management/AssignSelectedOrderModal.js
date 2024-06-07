import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CenterCircularLoader from 'components/CenterCircularLoader';
import { fetchFilteredUsers } from 'store/slices/user/fetchUser';
import { Modal, Box, Grid, Button, FormControlLabel, FormGroup, Checkbox, Typography } from '@mui/material';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import { fetchAssignOrders } from 'store/slices/order/fetchOrder';
import { setMessage } from 'store/slices/util/utilSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

export default function AssignSelectedOrderModal({ visible, onClose, selectedRows }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [assignee, setAssignee] = useState([]);
  const [toAssign, setToAssign] = useState([]);

  const getAssignee = () => {
    setLoading(true);
    return dispatch(fetchFilteredUsers({ body: { permissions: [PERMISSIONS.PERMISSION_ASSIGN_ORDERS] } })).then(({ type, payload }) => {
      if (type === 'users/filtered/fetch/fulfilled') {
        setAssignee(payload.data.users.map((user) => ({ id: user.id, email: user.email, name: user.name })));
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
        onClose();
        return;
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

  useEffect(() => {
    if (visible) {
      getAssignee();
    }
  }, [visible]);

  if (loading) {
    return <CenterCircularLoader />;
  }

  return (
    <Modal open={visible} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Typography>Assign {selectedRows?.length > 0 ? selectedRows?.length : ''} orders to </Typography>
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
      </Box>
    </Modal>
  );
}
