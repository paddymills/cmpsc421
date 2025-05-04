import styles from "./monsters.module.css";
import { getStaticProps as getPages } from "../index";

const pokeApi = "https://pokeapi.co/api/v2/pokemon";

export async function getStaticPaths() {
  const url = `${pokeApi}?limit=10000&offset=0`;
  const res = await fetch(url);
  const data = await res.json();

  const paths = data.results.map((page) => ({
    params: {
      id: page.url.replace(pokeApi, "").replaceAll("/", ""),
    },
  }));
  console.log(paths);

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const url = `${pokeApi}/${params.id}`;
  const res = await fetch(url);
  const fullData = await res.json();

  const { id, name, base_experience, height } = fullData;
  const data = {
    id,
    name,
    base_experience,
    height,
    img: fullData.sprites.other.dream_world.front_default,
    abilities: fullData.abilities.map((x) => x.ability.name).join(", "),
    types: fullData.types.map((x) => x.type.name).join(", "),
    stats: fullData.stats.map((stat) => ({
      name: stat.stat.name,
      base: stat.base_stat,
    })),
    moves: fullData.moves.map((move) => move.move.name.replace("-", " ")),
  };

  return { props: { data } };
}

const MonsterPage = ({ data }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.id}>{data.id}</span>
        {data.name}
      </h1>
      <img src={data.img} alt={data.name} />
      <h2>About</h2>
      <table className={styles.tbl}>
        <tbody>
          <tr>
            <td className={styles.data}>abilities</td>
            <td className={styles.data}>{data.abilities}</td>
          </tr>
          <tr>
            <td className={styles.data}>types</td>
            <td className={styles.data}>{data.types}</td>
          </tr>
          <tr>
            <td className={styles.data}>base experience</td>
            <td className={styles.data}>{data.base_experience}</td>
          </tr>
          <tr>
            <td className={styles.data}>height</td>
            <td className={styles.data}>{data.height}</td>
          </tr>
        </tbody>
      </table>
      <hr width="100%" />
      <h2>Stats</h2>
      <table className={styles.tbl}>
        <tbody>
          {data.stats.map((stat, index) => (
            <tr key={index}>
              <td className={styles.data}>{stat.name}</td>
              <td className={styles.data}>{stat.base}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr width="100%" />
      <h2>Moves</h2>
      <ul>
        {data.moves.map((m, index) => (
          <li className={styles.data} key={index}>
            {m}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MonsterPage;
