onmessage = async (event) => {
  const dataWorker = event.data;
  const codi =dataWorker.grup;
  const token = dataWorker.token;
  const response = await fetch(process.env.API + '/api/core/usuaris/tutorfct-by-codigrup/'+codi, {
    headers: {
      "Authorization": 'Bearer ' + token
    }
  });
  const data = await response.json();

  const tutorsFCT = data.map((json)=>{
    return {
      id: json.idusuari,
      email: json.gsuiteEmail,
      nomComplet: json.gsuiteFullName,
      nomComplet2: json.gestibCognom1 + " " + json.gestibCognom2 + ", " + json.gestibNom,
      esAlumne: json.gestibAlumne,
      numExpedient: json.gestibExpedient,
      grup: json.gestibGrup,
      grup2: json.gestibGrup2,
      grup3: json.gestibGrup3,
      value: json.gsuiteEmail,
      label: json.gsuiteFullName + ' <'+json.gsuiteEmail+'>'
    }
  }).sort((a,b)=>a.nomComplet2.localeCompare(b.nomComplet2));



  postMessage(tutorsFCT);
}
