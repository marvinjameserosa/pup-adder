import Image from "next/image";
import styles from "./page.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      {/* Logo */}
      <div className={styles.logo}>
        <Image src="/favicon.ico" alt="PUP Gather" width={30} height={30}/>
      </div>

      {/* Navigation Buttons */}
      <nav className={styles.nav}>
        <button className={styles.navButton}>
          <Image src="/icons/discover.png" alt="Discover" width={20} height={20} />
          Discover
        </button>
        <button className={styles.navButton}>
          <Image src="/icons/events.png" alt="Events" width={20} height={20} />
          Events
        </button>
      </nav>

      {/* Utility Buttons (Search and Notifications next to each other) */}
      <div className={styles.utilityButtons}>
        <button className={styles.iconButton}>
          <Image src="/icons/notification.png" alt="Notifications" width={20} height={20} />
        </button>
        <button className={styles.iconButton}>
          <Image src="/icons/search.png" alt="Search" width={20} height={20} />
        </button>
        <button className={styles.createEventButton}>Create Event</button>
        <button className={styles.profileButton}>
          <Image src="/icons/profile.png" alt="Profile" width={40} height={40} className={styles.profileImage} layout="Intrinsic" />
        </button>
      </div>
    </header>
  );
}
