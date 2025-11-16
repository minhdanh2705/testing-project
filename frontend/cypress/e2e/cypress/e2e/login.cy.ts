// cypress/e2e/login.cy.ts
import { LoginPage } from "./pages/LoginPage";

const loginPage = new LoginPage();

describe("E2E - Login flow", () => {
  beforeEach(() => {
    // Luôn bắt đầu tại trang login
    loginPage.visit();

    // Clear storage mỗi test
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.window().then((w) => {
      w.sessionStorage.clear();
    });
  });

  // a) Test complete login flow (1 điểm)
  it("a) Complete login flow with valid credentials", () => {
    // Giả lập API login thành công (nếu bạn muốn dùng mock)
    cy.intercept("POST", "**/api/auth/login", {
      statusCode: 200,
      body: {
        token: "fake-jwt-token",
        user: { email: "user@test.com" },
      },
    }).as("loginRequest");

    loginPage.fillForm("user@test.com", "Password123");
    loginPage.rememberMeCheckbox().check(); // ví dụ có ô remember me
    loginPage.submit();

    // chờ API
    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);

    // kiểm tra chuyển trang sau login
    cy.url().should("include", "/home"); // hoặc /dashboard tuỳ app

    // kiểm tra token được lưu (ví dụ lưu ở localStorage)
    cy.window().then((w) => {
      const token = w.localStorage.getItem("token");
      expect(token).to.eq("fake-jwt-token");
    });

    // kiểm tra UI sau khi login
    cy.get("[data-test='home-welcome']").should("contain", "Chào mừng");
  });

  // b) Test validation messages (0.5 điểm)
  it("b1) Hiển thị lỗi khi để trống email & password", () => {
    loginPage.submit();

    loginPage
      .validationMessage("email")
      .should("be.visible")
      .and("contain", "Email là bắt buộc");
    loginPage
      .validationMessage("password")
      .should("be.visible")
      .and("contain", "Mật khẩu là bắt buộc");
  });

  it("b2) Hiển thị lỗi khi email không hợp lệ", () => {
    loginPage.fillForm("sai-dinh-dang", "Password123");
    loginPage.submit();

    loginPage
      .validationMessage("email")
      .should("be.visible")
      .and("contain", "Email không hợp lệ");
  });

  it("b3) Hiển thị lỗi khi mật khẩu quá ngắn", () => {
    loginPage.fillForm("user@test.com", "123");
    loginPage.submit();

    loginPage
      .validationMessage("password")
      .should("be.visible")
      .and("contain", "Mật khẩu tối thiểu");
  });

  // c) Test success/error flows (0.5 điểm)
  it("c1) Login thành công", () => {
    cy.intercept("POST", "**/api/auth/login", {
      statusCode: 200,
      body: { token: "success-token" },
    }).as("loginSuccess");

    loginPage.fillForm("user@test.com", "Password123");
    loginPage.submit();

    cy.wait("@loginSuccess");
    cy.url().should("include", "/home");
  });

  it("c2) Login sai mật khẩu -> hiển thị thông báo lỗi", () => {
    cy.intercept("POST", "**/api/auth/login", {
      statusCode: 401,
      body: { message: "Email hoặc mật khẩu không đúng" },
    }).as("loginError");

    loginPage.fillForm("user@test.com", "wrong-pass");
    loginPage.submit();

    cy.wait("@loginError");

    loginPage
      .errorMessage()
      .should("be.visible")
      .and("contain", "Email hoặc mật khẩu không đúng");
  });

  // d) Test UI elements interactions (0.5 điểm)
  it("d1) Nút show/hide password hoạt động đúng", () => {
    loginPage.passwordInput().type("Password123");

    // default là password
    loginPage.passwordInput().should("have.attr", "type", "password");

    // click icon show password
    loginPage.showPasswordButton().click();
    loginPage.passwordInput().should("have.attr", "type", "text");

    // click lần nữa để ẩn
    loginPage.showPasswordButton().click();
    loginPage.passwordInput().should("have.attr", "type", "password");
  });

  it("d2) Remember me ảnh hưởng nơi lưu token", () => {
    // khi tick remember -> lưu localStorage
    cy.intercept("POST", "**/api/auth/login", {
      statusCode: 200,
      body: { token: "remember-token" },
    }).as("loginRemember");

    loginPage.fillForm("user@test.com", "Password123");
    loginPage.rememberMeCheckbox().check();
    loginPage.submit();

    cy.wait("@loginRemember");

    cy.window().then((w) => {
      expect(w.localStorage.getItem("token")).to.eq("remember-token");
      expect(w.sessionStorage.getItem("token")).to.be.null;
    });
  });

  it("d3) Button bị disable khi đang submit", () => {
    cy.intercept("POST", "**/api/auth/login", (req) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ status : 200, body: { token: "t" } }), 1500);
      });
    }).as("slowLogin");

    loginPage.fillForm("user@test.com", "Password123");
    loginPage.submit();

    loginPage.submitButton().should("be.disabled");
    cy.wait("@slowLogin");
    loginPage.submitButton().should("not.be.disabled");
  });
});
