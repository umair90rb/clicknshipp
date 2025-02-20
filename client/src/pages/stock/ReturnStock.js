import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomDialog from 'components/CustomDialog';

export default function ReturnStock({ visible, onClose }) {
  const dispatch = useDispatch();
  const [bom, setBOM] = useState({
    loading: true,
    error: null,
    rows: []
  });

  return <CustomDialog visible={visible} onClose={onClose} maxWidth="lg" dividers={false} title="Add Return" enableBackdrop></CustomDialog>;
}
