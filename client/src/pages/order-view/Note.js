import { Typography, Card, CardContent } from '@mui/material';

export default function Note({ note, remarks, chanel, user }) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }}>Note: {note || 'None'}</Typography>
        <Typography sx={{ fontSize: 14 }}>Remarks: {remarks || 'None'}</Typography>
        <Typography sx={{ fontSize: 14 }}>Chanel/Store: {(chanel && 'name' in chanel && chanel.name) || ''}</Typography>
        <Typography sx={{ fontSize: 14 }}>Agent: {(user && 'name' in user && user.name) || ''}</Typography>
      </CardContent>
    </Card>
  );
}
