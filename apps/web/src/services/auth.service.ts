import type { loginData, signupData } from "@repo/validation";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const url = `${import.meta.env.API_URL}/auth`;

export async function signup(formData: signupData) {
  try {
    const response = await fetch(`${url}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message ?? "Signup error");

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Server error");
  }
}

export async function login(formData: loginData) {
  try {
    const response = await fetch(`${url}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message ?? "Login error");

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Server error");
  }
}

export async function getUser() {
  try {
    const response = await fetchWithAuth(`${url}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message ?? "Server error");

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Server error");
  }
}

export async function logout() {
  try {
    const response = await fetchWithAuth(`${url}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Server error");

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Server error");
  }
}

export async function refresh_token() {
  try {
    const response = await fetch(`${url}/refresh`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) throw new Error("Server error");

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Server error");
  }
}
