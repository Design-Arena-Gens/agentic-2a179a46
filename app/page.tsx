"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Role = "assistant" | "user";

interface ChatMessage {
  id: number;
  role: Role;
  content: string;
  timestamp: string;
}

const serviceSuggestions = [
  "Pension / Life Certificate (DLC, Sparsh)",
  "Samman / Sambhal Card registration",
  "Banking, Aadhaar, Pan, Passport Services",
  "PM schemes, bill payment, recharge sahayata",
];

const initialAssistantMessage =
  "Namaste! Main VIKAS AI Assistant hoon. Kripya apna naam aur prashna likhiye taki main aapki madad kar saku. धन्यवाद! 🙏 Aapka apna VIKAS CSC – Vikas ke sath aapke vikas ki baat.";

function formatTime(date: Date) {
  return date
    .toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
}

function normalizeName(rawName: string) {
  const cleaned = rawName.trim();
  if (!cleaned) {
    return null;
  }
  const lower = cleaned.toLowerCase();
  if (["sir", "madam", "ji", "friend", "dost"].includes(lower)) {
    return null;
  }
  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

type DetectedIntent =
  | { type: "pension" }
  | { type: "samman" }
  | { type: "banking" }
  | { type: "aadhaar" }
  | { type: "pan" }
  | { type: "passport" }
  | { type: "pm" }
  | { type: "bill" }
  | { type: "greeting" }
  | { type: "general" }
  | { type: "unclear" };

function detectIntent(message: string): DetectedIntent {
  const text = message.toLowerCase();
  if (!text.trim() || text.split(/\s+/).length < 3) {
    return { type: "unclear" };
  }
  if (
    text.includes("pension") ||
    text.includes("life certificate") ||
    text.includes("jeevan") ||
    text.includes("dlc") ||
    text.includes("sparsh")
  ) {
    return { type: "pension" };
  }
  if (text.includes("samman") || text.includes("sambhal")) {
    return { type: "samman" };
  }
  if (
    text.includes("bank") ||
    text.includes("withdraw") ||
    text.includes("deposit") ||
    text.includes("account")
  ) {
    return { type: "banking" };
  }
  if (text.includes("aadhaar") || text.includes("aadhar") || text.includes("update card")) {
    return { type: "aadhaar" };
  }
  if (text.includes("pan")) {
    return { type: "pan" };
  }
  if (text.includes("passport")) {
    return { type: "passport" };
  }
  if (
    text.includes("pm ") ||
    text.includes("yojana") ||
    text.includes("scheme") ||
    text.includes("pm kisan") ||
    text.includes("pmay")
  ) {
    return { type: "pm" };
  }
  if (
    text.includes("bill") ||
    text.includes("recharge") ||
    text.includes("electricity") ||
    text.includes("bijli")
  ) {
    return { type: "bill" };
  }
  if (text.includes("hello") || text.includes("namaste") || text.includes("hi ")) {
    return { type: "greeting" };
  }
  return { type: "general" };
}

function buildSteps(intent: DetectedIntent): string[] {
  switch (intent.type) {
    case "pension":
      return [
        "1. Aadhaar se linked mobile number aur bank passbook taiyaar rakhiye.",
        "2. Humare center par aakar biometric ya OTP se Digital Life Certificate bana sakte hain.",
        "3. Agar aap SPARSH pensioner hain to PPO number, bank account aur ID card bhi lekar aaiye.",
        "4. Certificate banne ke baad hum turant acknowledgement slip denge aur status SMS se share karenge.",
      ];
    case "samman":
      return [
        "1. Adhikarik ID proof, address proof aur recent passport size photo lekar aaiye.",
        "2. Hum online form bhar kar aapko Samman / Sambhal Card registration process samjhayenge.",
        "3. Verification ke baad card print ya digital copy aapko turant uplabdh karayenge.",
      ];
    case "banking":
      return [
        "1. Banking seva ke liye Aadhaar linked mobile aur original ID proof jaruri hai.",
        "2. Cash withdrawal, deposit, balance enquiry ya mini statement humare micro-ATM se turant ho jata hai.",
        "3. Aapko sirf finger biometric dena hota hai, baki process hum sambhalte hain.",
      ];
    case "aadhaar":
      return [
        "1. Aadhaar update ke liye original Aadhaar card aur support documents lekar aaiye.",
        "2. Hum demographic update, mobile/email linking, aur PVC card print turant kar dete hain.",
        "3. Biometric update 5+ saal ke bachchon aur older adults ke liye bhi uplabdh hai.",
      ];
    case "pan":
      return [
        "1. PAN banwane ke liye Aadhaar card, mobile number aur email ID taiyaar rakhiye.",
        "2. Hum form bhar kar e-KYC complete karenge, jis se aapka PAN jaldi issue ho jayega.",
        "3. Physical card ya e-PAN download karne tak hum aapko update dete rahenge.",
      ];
    case "passport":
      return [
        "1. Passport seva ke liye Aadhaar, residence proof aur date of birth proof lekar aaiye.",
        "2. Hum online form bhar kar appointment slot book kar denge.",
        "3. Payment receipt aur document checklist aapko wahi par mil jayegi.",
      ];
    case "pm":
      return [
        "1. PM yojana ke liye pehle scheme ke eligibility documents verify karte hain.",
        "2. Form submission se lekar status tracking tak hum aapko har kadam par guide karte hain.",
        "3. Aapke document scan karke secure upload kiya jata hai, slip turant milti hai.",
      ];
    case "bill":
      return [
        "1. Bijli, pani, gas, DTH ya mobile number ka bill detail share kijiye.",
        "2. Hum turant bill fetch karke aapko exact amount batate hain.",
        "3. Online payment complete hone par digital receipt aapko SMS ya WhatsApp se milti hai.",
      ];
    case "greeting":
      return [
        "1. Kripya bataye ki kis seva ya samasya me aapko madad chahiye.",
        "2. Main har kadam par simple Hinglish me aapko guide karunga.",
      ];
    case "general":
      return [
        "1. Aap jo seva chahte hain uska short detail share kijiye.",
        "2. Main document requirement aur process ko step by step samjhaunga.",
        "3. Kisi bhi confusion me aap turant puch sakte hain.",
      ];
    case "unclear":
    default:
      return [];
  }
}

function getFollowUpQuestion(intent: DetectedIntent) {
  if (intent.type === "unclear") {
    return "Kripya apni seva ya sawal ko thoda aur detail me bataiye?";
  }
  return null;
}

function personalizeGreeting(name: string | null, greeted: boolean) {
  if (greeted) {
    return null;
  }
  if (name) {
    return `Namaste ${name} ji! Main VIKAS AI Assistant hoon.`;
  }
  return "Namaste dost! Main VIKAS AI Assistant hoon.";
}

function buildServiceSuggestionLines(intent: DetectedIntent) {
  const lines = ["Hamari upyogi sevaen jo aap consider kar sakte hain:"];
  let highlighted: string | null = null;
  switch (intent.type) {
    case "pension":
      highlighted = "Pension / Life Certificate (DLC, Sparsh) ke liye vishesh sahayata uplabdh hai.";
      break;
    case "samman":
      highlighted = "Samman / Sambhal Card banwane me hum pura support dete hain.";
      break;
    case "banking":
      highlighted = "Banking seva jaise cash withdrawal, deposit aur balance enquiry turant hoti hai.";
      break;
    case "aadhaar":
      highlighted = "Aadhaar update, PVC print aur mobile linking humare center par asaan hai.";
      break;
    case "pan":
      highlighted = "PAN card apply karna ya reprint karna hum turant process karte hain.";
      break;
    case "passport":
      highlighted = "Passport appointment booking aur document checklist ka pura support milta hai.";
      break;
    case "pm":
      highlighted = "PM schemes ke liye end-to-end registration aur status tracking provided hai.";
      break;
    case "bill":
      highlighted = "Bill payment aur recharge seva se turant digital receipt milti hai.";
      break;
    default:
      highlighted = null;
  }
  if (highlighted) {
    lines.push(highlighted);
  }
  for (const suggestion of serviceSuggestions) {
    lines.push(`• ${suggestion}`);
  }
  return lines;
}

function generateAssistantResponse(
  userMessage: string,
  rawName: string,
  hasPersonalGreeting: boolean
) {
  const name = normalizeName(rawName);
  const intent = detectIntent(userMessage);
  const greetingLine = personalizeGreeting(name, hasPersonalGreeting);
  const steps = buildSteps(intent);
  const followUp = getFollowUpQuestion(intent);
  const services = buildServiceSuggestionLines(intent);
  const lines: string[] = [];

  if (greetingLine) {
    lines.push(greetingLine);
  }
  if (intent.type !== "unclear") {
    lines.push("Main aapke prashn ko samajh raha hoon. Neeche simple steps follow kijiye:");
  }
  if (steps.length > 0) {
    lines.push(...steps);
  }
  if (intent.type === "unclear") {
    lines.push("Main aapki sahayata ke liye taiyaar hoon.");
  }
  if (followUp) {
    lines.push(followUp);
  }
  lines.push(...services);
  lines.push("धन्यवाद! 🙏 Aapka apna VIKAS CSC – Vikas ke sath aapke vikas ki baat.");

  return { response: lines.join(" "), greeted: Boolean(greetingLine) || hasPersonalGreeting };
}

export default function HomePage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [hasGreetedByName, setHasGreetedByName] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      content: initialAssistantMessage,
      timestamp: formatTime(new Date()),
    },
  ]);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setError("Kripya apna sawal likhiye.");
      return;
    }
    setError(null);

    const messageId = Date.now();
    const userEntry: ChatMessage = {
      id: messageId,
      role: "user",
      content: trimmedMessage,
      timestamp: formatTime(new Date()),
    };

    const { response, greeted } = generateAssistantResponse(
      trimmedMessage,
      name,
      hasGreetedByName
    );

    const assistantEntry: ChatMessage = {
      id: messageId + 1,
      role: "assistant",
      content: response,
      timestamp: formatTime(new Date()),
    };

    setMessages((prev) => [...prev, userEntry, assistantEntry]);
    setHasGreetedByName(greeted);
    setMessage("");
  };

  const headerGreeting = useMemo(() => {
    const normalized = normalizeName(name);
    if (normalized) {
      return `Swagat hai ${normalized} ji!`;
    }
    return "Swagat hai! Aapka apna VIKAS CSC.";
  }, [name]);

  return (
    <main>
      <header
        style={{
          padding: "24px 32px",
          borderBottom: "1px solid #e2e8f0",
          background: "linear-gradient(120deg, #0ea5e9 0%, #6366f1 100%)",
          color: "#f8fafc",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ fontSize: "1.75rem", fontWeight: 700 }}>{headerGreeting}</div>
          <p style={{ margin: 0, fontSize: "1rem", maxWidth: "720px", lineHeight: 1.5 }}>
            VIKAS CSC – Fastrac Digital Service Provider me aapko pension, banking, Aadhaar,
            government yojana aur bill payment ki poorna sahayata milti hai. Main aapko simple
            Hinglish me har kadam samjhaunga.
          </p>
        </div>
      </header>
      <section
        style={{
          flex: 1,
          padding: "24px 32px",
          overflowY: "auto",
          backgroundColor: "#f8fafc",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {messages.map((item) => (
            <article
              key={item.id}
              style={{
                alignSelf: item.role === "user" ? "flex-end" : "flex-start",
                backgroundColor: item.role === "user" ? "#0ea5e9" : "#ffffff",
                color: item.role === "user" ? "#f8fafc" : "#0f172a",
                padding: "16px 20px",
                borderRadius:
                  item.role === "user"
                    ? "20px 20px 4px 20px"
                    : "20px 20px 20px 4px",
                boxShadow: "0 12px 24px rgba(15, 23, 42, 0.12)",
                maxWidth: "80%",
                lineHeight: 1.6,
                whiteSpace: "pre-line",
              }}
            >
              <div style={{ fontSize: "0.85rem", opacity: 0.8, marginBottom: "4px" }}>
                {item.role === "assistant" ? "VIKAS AI Assistant" : "Aap"}
              </div>
              <div style={{ fontSize: "1rem" }}>{item.content}</div>
              <div
                style={{
                  fontSize: "0.75rem",
                  opacity: 0.6,
                  marginTop: "8px",
                  textAlign: "right",
                }}
              >
                {item.timestamp}
              </div>
            </article>
          ))}
          <div ref={endRef} />
        </div>
      </section>
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "24px 32px",
          borderTop: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontWeight: 600, color: "#0f172a" }}>Aapka Naam (optional)</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Jaise: Ramesh Kumar"
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #cbd5f5",
                fontSize: "1rem",
                backgroundColor: "#f1f5f9",
                color: "#0f172a",
              }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontWeight: 600, color: "#0f172a" }}>Aapka Prashn</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Apna sawal ya seva ki detail likhiye..."
              rows={3}
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #cbd5f5",
                fontSize: "1rem",
                resize: "vertical",
                backgroundColor: "#f8fafc",
                color: "#0f172a",
              }}
            />
          </label>
        </div>
        {error ? (
          <div style={{ color: "#dc2626", fontWeight: 600 }}>{error}</div>
        ) : null}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background:
                "linear-gradient(120deg, rgba(14,165,233,1) 0%, rgba(99,102,241,1) 100%)",
              color: "#f8fafc",
              border: "none",
              borderRadius: "9999px",
              padding: "12px 28px",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 12px 24px rgba(14, 165, 233, 0.35)",
            }}
          >
            Message bheje
          </button>
        </div>
      </form>
    </main>
  );
}
