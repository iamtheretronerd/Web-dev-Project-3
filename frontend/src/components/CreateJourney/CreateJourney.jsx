import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/createJourney.module.css";

// Use the VITE_API_URL from the frontend .env. Fallback to localhost in development.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * CreateJourney component
 *
 * This page allows a logged-in user to create a new learning journey. The
 * user selects a skill, experience level, optional time commitment and a
 * personal goal. Upon submission, the data is sent to the backend to create
 * a new document in the "gameData" collection. The inserted document ID is
 * then used to redirect the user to the game screen (handled by the
 * game page implemented elsewhere).
 *
 * Props:
 * - user: the current logged-in user object (must contain _id or id)
 */
function CreateJourney({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    skill: "",
    level: "Beginner",
    timeCommitment: "15 mins/day",
    goal: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Update form data when user types/selects
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Determine the user's identifier. Login responses include _id, but
      // Fall back to id if present.
      const userId = user?._id || user?.id || user?.userId || null;
      if (!userId) {
        throw new Error(
          "Unable to determine your user ID. Please log out and log back in.",
        );
      }
      const response = await fetch(`${API_URL}/api/gameData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId.toString(),
          skill: formData.skill,
          level: formData.level,
          timeCommitment: formData.timeCommitment,
          goal: formData.goal,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create journey");
      }
      if (data.success) {
        // Navigate to the game screen with the new gameData ID. The game
        // component will read the ID from the query string and load the
        // corresponding data.
        navigate(`/game?id=${data.gameDataId}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create Your Journey</h2>
        <p className={styles.subtitle}>
          Define your starting point and we will generate quests for you
        </p>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="skill">Skill</label>
            <select
              id="skill"
              name="skill"
              value={formData.skill}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select a skill
              </option>
              <option value="Cooking">Cooking</option>
              <option value="Public Speaking">Public Speaking</option>
              <option value="Memory Training">Memory Training</option>
              <option value="DIY Crafts">DIY Crafts</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="level">Experience Level</label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="timeCommitment">Time Commitment</label>
            <select
              id="timeCommitment"
              name="timeCommitment"
              value={formData.timeCommitment}
              onChange={handleChange}
            >
              <option value="15 mins/day">15 mins/day</option>
              <option value="30 mins/day">30 mins/day</option>
              <option value="1 hour/day">1 hour/day</option>
              <option value="2 hours/week">2 hours/week</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="goal">Personal Goal</label>
            <input
              type="text"
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="E.g. Cook 5 healthy meals"
            />
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Creating..." : "Start Journey"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateJourney;
