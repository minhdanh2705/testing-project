// cypress/e2e/pages/LoginPage.ts
export class LoginPage {
  visit() {
    cy.visit("/login");
  }

  emailInput() {
    return cy.get('[data-test="login-email"]');       // chỉnh theo code của bạn
  }

  passwordInput() {
    return cy.get('[data-test="login-password"]');
  }

  submitButton() {
    return cy.get('[data-test="login-submit"]');
  }

  rememberMeCheckbox() {
    return cy.get('[data-test="login-remember"]');
  }

  showPasswordButton() {
    return cy.get('[data-test="toggle-password"]');
  }

  errorMessage() {
    return cy.get('[data-test="login-error"]');
  }

  validationMessage(field: "email" | "password") {
    return cy.get(`[data-test="login-${field}-error"]`);
  }

  fillForm(email: string, password: string) {
    this.emailInput().clear().type(email);
    this.passwordInput().clear().type(password);
  }

  submit() {
    this.submitButton().click();
  }
}
