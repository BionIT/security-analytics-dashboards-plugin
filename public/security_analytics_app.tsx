/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoreStart, AppMountParameters } from 'opensearch-dashboards/public';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import { ServicesContext } from './services';
import { DarkModeContext } from './components/DarkMode';
import Main from './pages/Main';
import { CoreServicesContext } from './components/core_services';
import './app.scss';
import DetectorsService from './services/DetectorService';
import IndexService from './services/IndexService';
import { BrowserServices } from './models/interfaces';

export function renderApp(coreStart: CoreStart, params: AppMountParameters, landingPage: string) {
  const http = coreStart.http;

  const detectorsService = new DetectorsService(http);
  const indexService = new IndexService(http);
  const services: BrowserServices = {
    detectorsService,
    indexService,
  };

  const isDarkMode = coreStart.uiSettings.get('theme:darkMode') || false;

  ReactDOM.render(
    <Router>
      <Route
        render={(props) => (
          <DarkModeContext.Provider value={isDarkMode}>
            <ServicesContext.Provider value={services}>
              <CoreServicesContext.Provider value={coreStart}>
                <Main {...props} landingPage={landingPage} />
              </CoreServicesContext.Provider>
            </ServicesContext.Provider>
          </DarkModeContext.Provider>
        )}
      />
    </Router>,
    params.element
  );
  return () => ReactDOM.unmountComponentAtNode(params.element);
}
