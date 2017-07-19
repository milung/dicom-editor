import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import AppContainer from './containers/app-container';

import './index.css';

console.log(("str1,str2,str3,str4".match(/,/g) || []).length);

injectTapEventPlugin();

ReactDOM.render(
  <AppContainer />,
  document.getElementById('root')
);
