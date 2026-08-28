import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import { getWatchlist, addMovie, updateMovie, deleteMovie } from "../utils/db.js";

const router = Router();

router.get("/:userId", authenticate, (req, res) => {
  const userId = Number(req.params.userId);
  const list = getWatchlist(userId);
  if (list === null) return res.status(404).json({ error: "User not found" });
  res.status(200).json(list);
});

router.post("/:userId/movies", authenticate, authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const movie = addMovie(userId, req.body || {});
  if (!movie) return res.status(404).json({ error: "User not found" });
  res.status(201).json(movie);
});

router.put("/:userId/movies/:movieId", authenticate, authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const movie = updateMovie(userId, Number(req.params.movieId), req.body || {});
  if (!movie) return res.status(404).json({ error: "Movie not found" });
  res.status(200).json(movie);
});

router.delete("/:userId/movies/:movieId", authenticate, authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const removed = deleteMovie(userId, Number(req.params.movieId));
  if (!removed) return res.status(404).json({ error: "Movie not found" });
  res.status(200).json({ message: "Movie deleted" });
});

export default router;