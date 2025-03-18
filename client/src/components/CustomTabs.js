import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

export default function CustomTabs({ tabs = [], ...rest }) {
  const [tab, setTab] = React.useState(0);
  const handleOnChange = React.useCallback((e, value) => {
    setTab(value);
  }, []);
  return (
    <>
      <Tabs value={tab} onChange={handleOnChange} {...rest}>
        {tabs.map(({ label }, i) => (
          <Tab label={label} key={i} value={i} />
        ))}
      </Tabs>
      {tabs.map(({ children }, i) => (
        <CustomTabPanel value={tab} index={i} key={i}>
          {children}
        </CustomTabPanel>
      ))}
    </>
  );
}
