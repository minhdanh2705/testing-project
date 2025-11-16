import { ProductListPage } from "./pages/products/ProductListPage";
import { ProductFormPage } from "./pages/"

const listPage = new ProductListPage();
const formPage = new ProductFormPage();

const baseProducts = [
  { id: 1, name: "Coca Cola", price: 15000, quantity: 10 },
  { id: 2, name: "Pepsi", price: 14000, quantity: 20 },
];

describe("Product - E2E CRUD Scenarios", () => {
  beforeEach(() => {
    // mock API get products để luôn có data ổn định
    cy.intercept("GET", "**/api/products", {
      statusCode: 200,
      body: baseProducts,
    }).as("getProducts");

    listPage.visit();
    cy.wait("@getProducts");
  });

  // a) Test Create product flow (0.5 điểm)
  it("a) Create product flow", () => {
    listPage.createButton().click();

    cy.intercept("POST", "**/api/products", (req) => {
      expect(req.body.name).to.eq("Sting Dâu");
      req.reply({
        statusCode: 201,
        body: { id: 3, name: "Sting Dâu", price: 12000, quantity: 30 },
      });
    }).as("createProduct");

    formPage.fillForm({
      name: "Sting Dâu",
      price: 12000,
      quantity: 30,
      description: "Nước tăng lực vị dâu",
    });
    formPage.submit();

    cy.wait("@createProduct");

    // quay lại list → kiểm tra row mới xuất hiện
    listPage.rowByName("Sting Dâu").should("exist");
  });

  // b) Test Read/List products (0.5 điểm)
  it("b) Read/List products", () => {
    // đã load data ở beforeEach
    listPage.rows().should("have.length", baseProducts.length);
    listPage.rowByName("Coca Cola").should("exist");
    listPage.rowByName("Pepsi").should("exist");
  });

  // c) Test Update product (0.5 điểm)
  it("c) Update product", () => {
    listPage.editButtonFor("Coca Cola").click();

    cy.intercept("PUT", "**/api/products/1", (req) => {
      expect(req.body.price).to.eq(18000);
      req.reply({
        statusCode: 200,
        body: { id: 1, name: "Coca Cola", price: 18000, quantity: 10 },
      });
    }).as("updateProduct");

    formPage.fillForm({ price: 18000 });
    formPage.submit();

    cy.wait("@updateProduct");

    // kiểm tra UI đã update giá mới
    listPage
      .rowByName("Coca Cola")
      .should("contain", "18000");
  });

  // d) Test Delete product (0.5 điểm)
  it("d) Delete product", () => {
    cy.intercept("DELETE", "**/api/products/2", {
      statusCode: 204,
    }).as("deleteProduct");

    listPage.deleteButtonFor("Pepsi").click();
    listPage.confirmDeleteButton().click();

    cy.wait("@deleteProduct");

    listPage.rowByName("Pepsi").should("not.exist");
  });

  // e) Test Search/Filter functionality (0.5 điểm)
  it("e) Search / Filter products", () => {
    // gõ 'coca' → chỉ còn hàng Coca Cola
    listPage.search("coca");

    listPage.rows().should("have.length", 1);
    listPage.rowByName("Coca Cola").should("exist");
    listPage.rowByName("Pepsi").should("not.exist");
  });
});
