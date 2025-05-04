import styles from "./page.module.css";

const pokeApi = "https://pokeapi.co/api/v2/pokemon";

async function getMonster(id) {
  const url = `${pokeApi}/${id}`;
  const data = await fetch(url);
  return data.json();
}

const MonsterPage = async ({ params }) => {
  const { id } = await params;
  const data = await getMonster(id);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.id}>{data.id}</span>
        {data.name}
      </h1>
      <img src={data.sprites.other.dream_world.front_default} alt={data.name} />
      <h2>About</h2>
      <table className={styles.tbl}>
        <tbody>
          <tr>
            <td className={styles.data}>abilities</td>
            <td className={styles.data}>
              {data.abilities.map((x) => x.ability.name).join(", ")}
            </td>
          </tr>
          <tr>
            <td className={styles.data}>types</td>
            <td className={styles.data}>
              {data.types.map((x) => x.type.name).join(", ")}
            </td>
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
              <td className={styles.data}>{stat.stat.name}</td>
              <td className={styles.data}>{stat.base_stat}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr width="100%" />
      <h2>Moves</h2>
      <ul>
        {data.moves.map((m, index) => (
          <li className={styles.data} key={index}>
            {m.move.name.replace("-", " ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MonsterPage;
