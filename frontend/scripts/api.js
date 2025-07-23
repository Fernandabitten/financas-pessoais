const isLocal =
  ["localhost", "127.0.0.1"].includes(window.location.hostname) ||
  window.location.hostname.startsWith("192.168.");

export const BASE_API_URL = isLocal
  ? `http://${window.location.hostname}:3000`
  : "https://financas-pessoais-eyy5.onrender.com/";

export async function fetchComErro(
  url,
  options = {},
  mensagemErro = "Erro na requisição"
) {
  try {
    const res = await fetch(url, options);

    if (res.status === 401) {
      window.location.href = "login.html";
      return;
    }

    if (!res.ok) {
      throw new Error(`${mensagemErro}: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    alert(mensagemErro);
    return null;
  }
}
