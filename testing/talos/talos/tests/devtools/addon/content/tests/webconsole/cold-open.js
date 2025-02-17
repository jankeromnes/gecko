/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const { openToolboxAndLog, closeToolbox, testSetup,
        testTeardown, SIMPLE_URL } = require("../head");

module.exports = async function() {
  await testSetup(SIMPLE_URL);
  await openToolboxAndLog("cold.webconsole", "webconsole");
  await closeToolbox();
  await testTeardown();
};
