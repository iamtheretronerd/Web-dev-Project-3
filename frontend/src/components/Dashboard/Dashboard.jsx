import styles from "../../styles/dashboard.module.css";
import { useNavigate } from "react-router-dom";

function Dashboard({ user }) {
  const navigate = useNavigate();

  const handleCreateClick = () => {
    navigate("/create");
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <div className={styles.userSection}>
          {user?.profileImage && (
            <img
              src={user.profileImage}
              alt={user.name}
              className={styles.avatar}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
          <div>
            <h2 className={styles.greeting}>Welcome back, {user?.name}</h2>
            <p className={styles.subtitle}>What skill will you master today?</p>
          </div>
        </div>
      </div>

      {/* Main Action Area */}
      <div className={styles.mainContent}>
        <div className={styles.emptyState}>
          <h3 className={styles.emptyTitle}>Start Your First Journey</h3>
          <p className={styles.emptyText}>
            Choose a skill and begin your personalized learning path
          </p>
          <button
            className={styles.createButton}
            type="button"
            onClick={handleCreateClick}
          >
            Create New Journey
          </button>
        </div>

        <div className={styles.journeyGrid}></div>
      </div>
    </div>
  );
}

export default Dashboard;
