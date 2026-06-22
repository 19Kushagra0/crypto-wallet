import Link from "next/link";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>Aura</div>

        <div className={styles.navLinks}>
          <Link className={styles.link} href="#">
            Security
          </Link>
          <Link className={styles.link} href="#">
            Privacy
          </Link>
          <Link className={styles.link} href="#">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
