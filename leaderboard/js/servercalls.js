export function fetchEndpoint(url, bodyData) {
  return fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .catch(error => {
      console.error('Error fetching data:', error);
      throw error; // Rethrow the error to the caller
  });
}
