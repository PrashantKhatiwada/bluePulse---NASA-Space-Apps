export async function loadData() {
  const res = await fetch('/sample_ocean.json');
  return await res.json();
}