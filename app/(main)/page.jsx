import Link from "next/link";
import styles from "./page.module.css";

const pokeApi = "https://pokeapi.co/api/v2/pokemon";
const perFetch = 10000;
const pageNum = 0;

async function getData() {
  const url = `${pokeApi}?limit=${perFetch}&offset=${pageNum}`;
  const data = await fetch(url);
  return data.json();
}

const Home = async () => {
  const data = await getData();
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
};

export default Home;
