function fetchEndpoint(url, bodyData) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("Got Response:", data);
        return data;
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
}
