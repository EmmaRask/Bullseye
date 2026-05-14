export type SessionResult = "lose" | "replay" | "win";

export function getSessionResult(
  score: number,
  loseLimit: number,
  winLimit: number
): SessionResult {
  if (score < loseLimit) return "lose";
  if (score >= winLimit) return "win";
  return "replay";
}