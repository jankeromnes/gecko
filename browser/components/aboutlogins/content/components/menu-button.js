/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import ReflectedFluentElement from "chrome://browser/content/aboutlogins/components/reflected-fluent-element.js";

export default class MenuButton extends ReflectedFluentElement {
  connectedCallback() {
    if (this.shadowRoot) {
      return;
    }

    let MenuButtonTemplate = document.querySelector("#menu-button-template");
    this.attachShadow({mode: "open"})
        .appendChild(MenuButtonTemplate.content.cloneNode(true));

    this.reflectFluentStrings();

    if (navigator.platform == "Win32") {
      // We can't add navigator.platform in all cases
      // because some platforms, such as Ubuntu 64-bit,
      // use "Linux x86_64" which is an invalid className.
      this.classList.add(navigator.platform);
    }

    this.shadowRoot.querySelector(".menu-button").addEventListener("click", this);
  }

  static get reflectedFluentIDs() {
    return [
      "button-title",
      "menuitem-import",
      "menuitem-preferences",
    ];
  }

  static get observedAttributes() {
    return MenuButton.reflectedFluentIDs;
  }

  handleSpecialCaseFluentString(attrName) {
    if (attrName != "button-title") {
      return false;
    }

    this.shadowRoot.querySelector(".menu-button").setAttribute("title", this.getAttribute(attrName));
    return true;
  }

  handleEvent(event) {
    switch (event.type) {
      case "click": {
        // Skip the catch-all event listener if it was the menu-button
        // that was clicked on.
        if (event.currentTarget == document.documentElement &&
            event.target == this &&
            event.originalTarget == this.shadowRoot.querySelector(".menu-button")) {
          return;
        }
        let classList = event.originalTarget.classList;
        if (classList.contains("menuitem-import") ||
            classList.contains("menuitem-preferences")) {
          let eventName = event.originalTarget.dataset.eventName;
          document.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
          }));
          this.hideMenu();
          break;
        }
        this.toggleMenu();
        break;
      }
    }
  }

  toggleMenu() {
    let wasHidden = this.shadowRoot.querySelector(".menu").hidden;
    if (wasHidden) {
      this.showMenu();
    } else {
      this.hideMenu();
    }
  }

  hideMenu() {
    this.shadowRoot.querySelector(".menu").hidden = true;
    document.documentElement.removeEventListener("click", this, true);
  }

  showMenu() {
    this.shadowRoot.querySelector(".menu").hidden = false;

    // Add a catch-all event listener to close the menu.
    document.documentElement.addEventListener("click", this, true);
  }
}
customElements.define("menu-button", MenuButton);
