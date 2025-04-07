import CustomButton from './CustomButton';

export default function GridButton({ text = '', onClick = () => {}, Icon = null, size = 'small', ...rest }) {
  return <CustomButton variant="" text={text} onClick={onClick} size={size} startIcon={Icon && <Icon />} {...rest} />;
}
