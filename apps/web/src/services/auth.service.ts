const url = "http://localhost:3033/api/auth";

export async function login(formData: { email: string; password: string }) {
  try {
    const response = await fetch(`${url}/login`, {
      method: "POST",
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
    const response = await fetch(`${url}/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    return {
      message: error.message,
    };
  }
}
