export default async function MonsterPage({ params }) {
  const { id } = await params;
  return (
    <div>
      <h1>Monster Page: {id}</h1>
    </div>
  );
}
