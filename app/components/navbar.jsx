import Link from "next/link";
import styles from "./navbar.module.css";

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link className={styles.page} href="/">
        Home
      </Link>
      <Link className={styles.page} href="/monsters">
        Monsters
      </Link>
      <Link className={styles.page} href="/nothing">
        Nothing
      </Link>
    </nav>
  );
}

export default Navbar;
