// Copyright (C) 2020 Herobone & Aynril
// 
// This file is part of Lapislar.
// 
// Lapislar is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// Lapislar is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with Lapislar.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react';
import { render } from '@testing-library/react';
import firebase from 'firebase';
import LanguageContainer from '../translations/LanguageContainer';
import { act as domAct } from "react-dom/test-utils";
import config from '../helper/config'
import { unmountComponentAtNode } from 'react-dom';
import AlertProvider from '../Components/Functional/AlertProvider';
import {Alert, Error, Warning} from '../helper/AlertTypes';
import Routed from '../Components/Functional/Routed';

firebase.initializeApp(config);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

let container: HTMLDivElement | null = null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  if (container) unmountComponentAtNode(container);
  container?.remove();
  container = null;
});

test('Renders the App without GAPI', () => {
  const okToCall = jest.fn();

  domAct(() => {
    render(
      <React.StrictMode>
        <LanguageContainer>
          <AlertProvider>
            <Routed changeLanguage={okToCall} currentLocale={"en"} createAlert={okToCall} />
          </AlertProvider>
        </LanguageContainer>
      </React.StrictMode>);
  });
});

test("Renders the Router and looks for Alerts", () => {
  const neverCallThis = jest.fn();
  const alertFN = (type: Alert) => {
    if (type instanceof Warning || type instanceof Error) {
      neverCallThis();
    }
  }

  const okToCall = jest.fn();

  domAct(() => {
    render(
      <LanguageContainer>
        <Routed changeLanguage={okToCall} currentLocale={"en"} createAlert={alertFN} />
      </LanguageContainer>
    );
  });
  expect(neverCallThis).not.toBeCalled();
});
