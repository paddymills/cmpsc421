import Link from "next/link";
import styles from "./index.module.css";

const pokeApi = "https://pokeapi.co/api/v2/pokemon";
const perFetch = 10000;
const pageNum = 0;

export async function getStaticProps() {
  const url = `${pokeApi}?limit=${perFetch}&offset=${pageNum}`;
  const res = await fetch(url);
  const data = await res.json();

  return { props: { data } };
}

export default function Home({ data }) {
  const links = data.results.map((poke, index) => (
    <li className={styles.item} key={index}>
      <Link
        className={styles.link}
        href={poke.url.replace(pokeApi, "/monsters")}
      >
        {poke.name}
      </Link>
    </li>
  ));

  return (
    <>
      <h1>Pokemon Directory</h1>
      <ul className={styles.list}>{links}</ul>
    </>
  );
}
