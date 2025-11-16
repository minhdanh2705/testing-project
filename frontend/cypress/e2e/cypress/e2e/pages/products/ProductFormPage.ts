// cypress/e2e/pages/products/ProductFormPage.ts

export class ProductFormPage {
  nameInput() {
    return cy.get('[data-test="product-name-input"]');
  }

  priceInput() {
    return cy.get('[data-test="product-price-input"]');
  }

  quantityInput() {
    return cy.get('[data-test="product-quantity-input"]');
  }

  descriptionInput() {
    return cy.get('[data-test="product-description-input"]');
  }

  submitButton() {
    return cy.get('[data-test="product-submit-button"]');
  }

  cancelButton() {
    return cy.get('[data-test="product-cancel-button"]');
  }

  validationMessage(field: "name" | "price" | "quantity") {
    return cy.get(`[data-test="product-${field}-error"]`);
  }

  fillForm(data: {
    name?: string;
    price?: string | number;
    quantity?: string | number;
    description?: string;
  }) {
    if (data.name !== undefined) {
      this.nameInput().clear().type(String(data.name));
    }
    if (data.price !== undefined) {
      this.priceInput().clear().type(String(data.price));
    }
    if (data.quantity !== undefined) {
      this.quantityInput().clear().type(String(data.quantity));
    }
    if (data.description !== undefined) {
      this.descriptionInput().clear().type(String(data.description));
    }
  }

  submit() {
    this.submitButton().click();
  }
}
