import { DATA_PLANS, NETWORKS, detectNetwork } from "./catalog";
import { formatPhone, naira } from "./format";
import type { AssistantMessage, Transaction } from "./types";

export type AssistantReply = {
  message: Omit<AssistantMessage, "id">;
  filledForm?: { network: string; recipient: string; planId: string } | null;
};

function extractPhone(text: string) {
  const match = text.match(/0\d{10}|\d{11}/);
  return match ? match[0] : null;
}

function extractAmount(text: string) {
  const match = text.match(/(?:₦|ngn|n)\s?([\d,]{3,})/i);
  if (match) return Number(match[1].replace(/,/g, ""));
  return null;
}

function extractSize(text: string) {
  const match = text.match(/(\d+(?:\.\d+)?)\s?gb/i);
  return match ? `${match[1]}GB` : null;
}

export function respond(
  text: string,
  context: { balance: number; transactions: Transaction[] }
): AssistantReply {
  const lower = text.toLowerCase();
  const phone = extractPhone(lower);
  const size = extractSize(lower);
  const amount = extractAmount(lower);

  // Data purchase
  if (lower.includes("data") || size) {
    const network = phone ? detectNetwork(phone) : NETWORKS[0];
    const name = network?.name ?? "MTN";
    const matches = DATA_PLANS.filter(
      (p) => p.network === (network?.id ?? "mtn") && (!size || p.size === size)
    );
    const short = matches.find((p) => p.validity.includes("7 days")) ?? matches[0];
    const long =
      matches.find((p) => p.validity.includes("30 days")) ?? matches[1] ?? short;

    if (!short || !long) {
      return {
        message: {
          role: "assistant",
          text: `I could not find a ${size ?? ""} plan on ${name}. Try a different size.`,
          toolCalls: ["read: plans"],
        },
      };
    }

    const recipient = phone ? formatPhone(phone) : "your line";
    return {
      filledForm: phone
        ? { network: network?.id ?? "mtn", recipient, planId: long.id }
        : null,
      message: {
        role: "assistant",
        text: `That number is ${name}. Two ${long.size} plans exist: ${naira(short.price).replace(".00", "")} for ${short.validity}, ${naira(long.price).replace(".00", "")} for ${long.validity}. I have filled the form with the ${long.validity} plan — change it, or confirm.`,
        toolCalls: ["read: plans", "read: balance", "fill: form"],
        chips: [
          `${short.validity} · ${naira(short.price).replace(".00", "")}`,
          `${long.validity} · ${naira(long.price).replace(".00", "")}`,
        ],
        approval: phone
          ? {
              title: `${name} ${long.size} data`,
              amount: long.price,
              lines: [
                { label: "Plan", value: `${name} ${long.size} · ${long.validity}` },
                { label: "Recipient", value: recipient },
                { label: "Balance after", value: naira(context.balance - long.price) },
              ],
            }
          : undefined,
      },
    };
  }

  // Airtime purchase
  if (lower.includes("airtime") || (amount && phone)) {
    const network = phone ? detectNetwork(phone) : null;
    const name = network?.name ?? "MTN";
    const value = amount ?? 500;
    const recipient = phone ? formatPhone(phone) : "0801 234 5678";
    return {
      message: {
        role: "assistant",
        text: `${naira(value)} of ${name} airtime for ${recipient}. Confirm below and I will send it.`,
        toolCalls: ["read: recipients", "read: balance", "fill: form"],
        approval: {
          title: `${name} Airtime`,
          amount: value,
          lines: [
            { label: "Product", value: `${name} Airtime` },
            { label: "Recipient", value: recipient },
            { label: "Balance after", value: naira(context.balance - value) },
          ],
        },
      },
    };
  }

  // Spend question
  if (lower.includes("spend") || lower.includes("spent")) {
    const scope = lower.includes("data")
      ? "data"
      : lower.includes("airtime")
        ? "airtime"
        : null;
    const rows = context.transactions.filter(
      (t) => t.amount < 0 && t.status === "success" && (!scope || t.service === scope)
    );
    const total = rows.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return {
      message: {
        role: "assistant",
        text: `You spent ${naira(total)} on ${scope ?? "everything"} this month across ${rows.length} transaction${rows.length === 1 ? "" : "s"}.`,
        toolCalls: ["read: history"],
      },
    };
  }

  // Balance
  if (lower.includes("balance")) {
    return {
      message: {
        role: "assistant",
        text: `Your wallet balance is ${naira(context.balance)}.`,
        toolCalls: ["read: balance"],
      },
    };
  }

  return {
    message: {
      role: "assistant",
      text: "I can buy airtime and data, pay electricity and cable, and answer questions about your spending. Tell me the number and what you want and I will fill the form.",
    },
  };
}

export const THINKING_LABEL = "Checking provider availability";
