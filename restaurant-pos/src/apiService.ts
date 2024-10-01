import { MenuItem } from "./types";

const API_BASE_URL = "http://localhost:3000"; // Replace with your actual API URL

export async function fetchMenuItems(): Promise<MenuItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/menu`);
    if (!response.ok) {
      throw new Error("Failed to fetch menu items");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching menu items:", error);
    throw error;
  }
}

export async function processPayment(
  orderId: number,
  amount: number
): Promise<{ success: boolean; transactionId: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/process-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId, amount }),
    });
    if (!response.ok) {
      throw new Error("Payment processing failed");
    }
    return await response.json();
  } catch (error) {
    console.error("Error processing payment:", error);
    throw error;
  }
}
