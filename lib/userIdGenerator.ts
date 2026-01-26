import { uniqueNamesGenerator, adjectives, names, colors } from "unique-names-generator";

export function generateUserIdFromUuid(): string {
  const id = uniqueNamesGenerator({
    dictionaries: [adjectives, names, colors],
    separator: "-",
    style: "lowerCase",
  });
  return id;
}

export function getUserId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const stored = localStorage.getItem("prizedpic_user_id");
  if (stored) {
    return stored;
  }

  const newId = generateUserIdFromUuid();
  localStorage.setItem("prizedpic_user_id", newId);
  return newId;
}
