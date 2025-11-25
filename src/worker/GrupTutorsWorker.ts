// The worker is a self-contained environment.
// We cannot import services that have dependencies on the main thread's context (like axios instances or the window object).
// Therefore, we replicate the necessary logic here, using the standard fetch API.
export {};

interface Usuari {
  id: number;
  email: string;
  nom: string;
  cognom1: string;
  cognom2: string;
  nomComplet: string;
  nomComplet2: string;
  esAlumne: boolean;
  numExpedient: string;
  grup: string;
  grup2: string;
  grup3: string;
  value: string;
  label: string;
}

// This function is a copy of UsuariService.fromJSONUsuari
function fromJSONUsuari(json: any): Usuari {
  return {
    id: json.idusuari,
    email: json.gsuiteEmail,
    nom: json.gestibNom,
    cognom1: json.gestibCognom1,
    cognom2: json.gestibCognom2,
    nomComplet: json.gsuiteFullName,
    nomComplet2: json.gestibCognom1 + " " + json.gestibCognom2 + ", " + json.gestibNom,
    esAlumne: json.gestibAlumne,
    numExpedient: json.gestibExpedient,
    grup: json.gestibGrup,
    grup2: json.gestibGrup2,
    grup3: json.gestibGrup3,
    value: json.gsuiteEmail,
    label: json.gsuiteFullName + ' <' + json.gsuiteEmail + '>'
  };
}

onmessage = async (event) => {
  const { grup, token, apiUrl } = event.data;

  //The token is obtained from the LocalStorage in the main thread and passed to the worker.
  if (!token) {
    postMessage({ grup, tutors: [] });
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/api/core/usuaris/tutorfct-by-codigrup/${grup.nom}`, {
      headers: {
        "Authorization": 'Bearer ' + token
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const tutors = data.map((usuari: any): Usuari => fromJSONUsuari(usuari))
      .sort((a: Usuari, b: Usuari) => a.nomComplet2.localeCompare(b.nomComplet2));

    postMessage({ grup, tutors });
  } catch (error) {
    console.error(`Error fetching tutors for group ${grup.nom}:`, error);
    postMessage({ grup, tutors: [] }); // Send an empty array on error
  }
};
