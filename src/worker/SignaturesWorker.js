onmessage = async (event) => {
  const dataWorker = event.data;
  const documents = dataWorker.docs;
  const token = dataWorker.token;

  for (const doc of documents) {
    const fetchBucket = await fetch(process.env.API + '/api/core/fitxerbucket/' + doc.fitxer.id, {
      headers: {
        "Authorization": 'Bearer ' + token
      }
    });
    const bucket = await fetchBucket.json();
    if (bucket !== undefined) {
      const names = await fetch(process.env.API + '/api/core/googlestorage/signatures', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          bucket: bucket.bucket,
          nom: bucket.nom,
          path: bucket.path
        })
      });
      doc.fitxer.signants = await names.json();
    }
  }
  postMessage(documents);
}
