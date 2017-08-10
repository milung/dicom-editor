import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import AppContainer from './containers/app-container';

import './index.css';

injectTapEventPlugin();

/**
 * Serves for registration of service worker. Pwa is not working in developer mode
 * but it is fully working in production mode.
 */
if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function (registration: ServiceWorkerRegistration) {
        // tslint:disable-next-line:no-console
        console.log('Registration succeeded. Scope is ' + registration.scope);
      }).catch(function (err: Error) {
        // tslint:disable-next-line:no-console
        console.log('Registration failed with ' + err);
      });
  }
}

ReactDOM.render(
  <AppContainer />,
  document.getElementById('root')
);
