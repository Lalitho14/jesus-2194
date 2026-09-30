import { fetchWithAuth } from "@/lib/fetchWithAuth";
import type { paymentData } from "@repo/validation";

const url = `${import.meta.env.API_URL}/payment`;

export async function charge(formData: paymentData) {
  try {
    const response = await fetchWithAuth(`${url}/recharge`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
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
