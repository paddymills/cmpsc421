import Link from "next/link";
import styles from "./navbar.module.css";

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link className={styles.page} href="/">
        Home
      </Link>
    </nav>
  );
}

export default Navbar;
