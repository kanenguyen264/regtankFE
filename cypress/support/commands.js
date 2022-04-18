import "cypress-localstorage-commands";
import { ERROR_ACTION, WAIT_FOR_ACTION } from "redux-wait-for-action";
import {
  AUTH_ACTION_LOGIN,
  AUTH_ACTION_LOGIN_ERROR,
  AUTH_ACTION_LOGIN_SUCCESS
} from "@protego/sdk/consts/actions";

const AuthActionLogin = ({ username, password, rememberMe }) => {
  return {
    type: AUTH_ACTION_LOGIN,
    username,
    password,
    rememberMe,
    [WAIT_FOR_ACTION]: ({ type }) => type === AUTH_ACTION_LOGIN_SUCCESS,
    [ERROR_ACTION]: AUTH_ACTION_LOGIN_ERROR
  };
};

Cypress.Commands.add("getCy", (selector, ...args) => {
  return cy.get(`[data-cy=${selector}]`, ...args);
});

Cypress.Commands.add(
  "login",
  (email = "admin@regtank.com", password = "Islandpeak2020") => {
    cy.clearLocalStorageSnapshot();
    cy.visit("/signin");
    cy.window()
      .its("store")
      .invoke(
        "dispatch",
        AuthActionLogin({ username: email, password, rememberMe: false })
      );
    return cy
      .location("pathname", { timeout: 15000 })
      .should("eq", "/app/dashboard");
  }
);

Cypress.Commands.add("toggleCustomTableRow", (index, ignoreToggle = false) => {
  return cy
    .getCy("customTable-row")
    .eq(index)
    .within(() => {
      !ignoreToggle && cy.getCy("customTable-rowCheck").check();
    })
    .then(($el) =>
      cy
        .wrap($el)
        .find("[data-cy=id]")
        .then(($id) => $id.text())
    );
});
