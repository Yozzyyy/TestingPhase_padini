// The users table has no name column, so derive a display name
// from the email prefix, e.g. "jessica.k@padini.com" -> "Jessica K"
export function displayName(user) {
  if (!user?.email) return "Staff Member";
  return user.email
    .split("@")[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export function initials(user) {
  return displayName(user)
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
