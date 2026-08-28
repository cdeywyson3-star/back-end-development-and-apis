export function authorizeModification(req, res, next) {
  const user = req.user;
  const ownAccount = user && user.role === "child" &&
    String(req.params.userId) === String(user.id);
  if (!user || (user.role !== "parent" && !ownAccount)) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
}
export default authorizeModification;