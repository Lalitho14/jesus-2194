import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Login from "./LoginPage";

const { login_mock, toast_add_mock } = vi.hoisted(() => ({
  login_mock: vi.fn(),
  toast_add_mock: vi.fn(),
}));

vi.mock("@/auth/AuthProvider", () => ({
  useAuth: () => ({ login: login_mock }),
}));

vi.mock("@/components/ui/toast", () => ({
  toast: { add: toast_add_mock },
}));

function render_login() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<h1>Dashboard</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

async function fill_login_form(email = "player@example.com", password = "valid-password") {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Email:"), email);
  await user.type(screen.getByLabelText("Password:"), password);
  return user;
}

describe("Login page", () => {
  beforeEach(() => {
    login_mock.mockReset();
    toast_add_mock.mockReset();
  });

  afterEach(() => cleanup());

  it("authenticates and navigates to the dashboard", async () => {
    render_login();
    const user = await fill_login_form();
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(login_mock).toHaveBeenCalledWith({
      email: "player@example.com",
      password: "valid-password",
    });
    expect(toast_add_mock).toHaveBeenCalledWith({
      type: "success",
      title: "Login successfully",
      description: "Welcome back!",
    });
    expect(await screen.findByRole("heading", { name: "Dashboard" })).toBeTruthy();
  });

  it("shows validation errors without calling auth for invalid input", async () => {
    render_login();
    const user = await fill_login_form("player@example.com", "short");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText(/8/)).toBeTruthy();
    expect(login_mock).not.toHaveBeenCalled();
  });

  it("shows the authentication error and stays on the login page", async () => {
    login_mock.mockRejectedValue(new Error("Invalid credentials"));
    render_login();
    const user = await fill_login_form();
    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(toast_add_mock).toHaveBeenCalledWith({
        type: "error",
        title: "Error",
        description: "Invalid credentials",
      });
    });
    expect(screen.getByText("Welcome back!")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Dashboard" })).toBeNull();
  });
});