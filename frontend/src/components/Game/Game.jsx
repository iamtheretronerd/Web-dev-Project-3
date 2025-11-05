import { useSearchParams } from "react-router-dom";
import styles from "../../styles/game.module.css";

/**
 * Game component
 *
 * This is a temporary placeholder for the game screen. It reads the journey ID
 * from the query string and displays it. The actual game implementation will
 * replace this component in the future.
 */
function Game() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Game Screen</h2>
        <p>
          This is a placeholder for the game screen. Journey ID: {id || "N/A"}
        </p>
      </div>
    </div>
  );
}

export default Game;
