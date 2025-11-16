import { ProductListPage } from "./pages/products/ProductListPage";
import { ProductFormPage } from "./pages/products/ProductFormPage";

const listPage = new ProductListPage();
const formPage = new ProductFormPage();

describe("Product - Create / Edit / Delete", () => {
  it("Create product successfully", () => {
    listPage.visit();
    listPage.createButton().click();

    formPage.fillForm({
      name: "Coca Cola",
      price: 15000,
      quantity: 10,
      description: "Nước ngọt có gas",
    });
    formPage.submit();

    // quay lại list, kiểm tra có sản phẩm mới
    listPage.rowByName("Coca Cola").should("exist");
  });
});
