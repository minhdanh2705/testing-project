// cypress/e2e/pages/products/ProductListPage.ts

export class ProductListPage {
  visit() {
    cy.visit("/products");   // chỉnh lại route đúng với app của bạn
  }

  // Table / list
  rows() {
    return cy.get('[data-test="product-row"]');
  }

  rowByName(name: string) {
    return this.rows().contains(name).parent(); // tuỳ cấu trúc table
  }

  // Buttons / actions
  createButton() {
    return cy.get('[data-test="product-create-button"]');
  }

  editButtonFor(name: string) {
    return this.rowByName(name).find('[data-test="product-edit-button"]');
  }

  deleteButtonFor(name: string) {
    return this.rowByName(name).find('[data-test="product-delete-button"]');
  }

  confirmDeleteButton() {
    return cy.get('[data-test="confirm-delete-button"]');
  }

  // Search / filter
  searchInput() {
    return cy.get('[data-test="product-search-input"]');
  }

  search(name: string) {
    this.searchInput().clear().type(name);
  }
}
