const createUserUrl = "http://127.0.0.1:5001/laststeps-f7991/us-central1/GetUserRecord";

fetch(createUserUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    "name": "test"
  })
})
.then(response => {
  return response.json();
})
.then(data => {
  console.log('Got records:', data);
})
.catch(error => {
  console.error(error);
});