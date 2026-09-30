import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Signup from "./RegisterPage";

const { signup_mock, toast_add_mock } = vi.hoisted(() => ({
  signup_mock: vi.fn(),
  toast_add_mock: vi.fn(),
}));

vi.mock("@/services/auth.service", () => ({
  signup: signup_mock,
}));

vi.mock("@/components/ui/toast", () => ({
  toast: { add: toast_add_mock },
}));

function render_signup() {
  return render(
    <MemoryRouter initialEntries={["/sign-up"]}>
      <Routes>
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/" element={<h1>Login page</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

async function fill_signup_form(
  password = "correct-password",
  confirm_password = password,
) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Name:"), "Test Player");
  await user.type(screen.getByLabelText("Email:"), "player@example.com");
  await user.type(screen.getByLabelText("Password:"), password);
  await user.type(screen.getByLabelText("Confirm password:"), confirm_password);
  return user;
}

describe("Register page", () => {
  beforeEach(() => {
    signup_mock.mockReset();
    toast_add_mock.mockReset();
  });

  afterEach(() => cleanup());

  it("registers and navigates to the login page", async () => {
    signup_mock.mockResolvedValue({ message: "Account created" });
    render_signup();
    const user = await fill_signup_form();
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    expect(signup_mock).toHaveBeenCalledWith({
      name: "Test Player",
      email: "player@example.com",
      password: "correct-password",
      confirm_password: "correct-password",
    });
    expect(toast_add_mock).toHaveBeenCalledWith({
      type: "success",
      title: "Success!",
      description: "Account created",
    });
    expect(await screen.findByRole("heading", { name: "Login page" })).toBeTruthy();
  });

  it("shows a validation error when passwords do not match", async () => {
    render_signup();
    const user = await fill_signup_form("correct-password", "different-password");
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    expect(await screen.findByText(/Passwords must be equals/)).toBeTruthy();
    expect(signup_mock).not.toHaveBeenCalled();
  });

  it("shows the signup error and stays on the registration page", async () => {
    signup_mock.mockRejectedValue(new Error("Email already registered"));
    render_signup();
    const user = await fill_signup_form();
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() => {
      expect(toast_add_mock).toHaveBeenCalledWith({
        type: "error",
        title: "Error",
        description: "Email already registered",
      });
    });
    expect(screen.getByText("Welcome!")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Login page" })).toBeNull();
  });
});
