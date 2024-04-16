import { fetchEndpoint } from "./servercalls.js";

document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting

    // Get the values from the form fields
    const jsonBody = {
        "displayName": document.getElementById('name').value,
        "email": document.getElementById('email').value,
        "password": document.getElementById('password').value
    };

    // Do something with the form data (e.g., send it to a server)
    fetchEndpoint("",jsonBody)
    .then(response => {
        alert("User Registered");
    })
    .catch(error => {
        // Handle error if fetching data fails
        console.error('Error:', error);
    });

    // Reset the form fields (optional)
    document.getElementById('registration-form').reset();
});


// Delete all child elements on an object
function deleteRows(leaderboardContainer) {
    // Loop while not empty
    while (leaderboardContainer.firstChild) {
        // Delete the first child
        leaderboardContainer.removeChild(leaderboardContainer.firstChild);
    }
}

// TODO: Refactor
function createUserRow(record,leaderboardContainer) {
    // Create a new user row
    let row = document.createElement("tr");

    // Create entries for the table
    let rank = document.createElement("td");
    let name = document.createElement("td");
    let endlessScore = document.createElement("td");
    let roundScore = document.createElement("td");
    let time = document.createElement("td");

    // Set rank to zero
    rank.textContent = 0;

    // Get record information
    name.textContent = record.name;
    endlessScore.textContent = record.endlessScore;
    roundScore.textContent = record.roundScore;
    time.textContent = record.time;

    // Append the elements
    row.appendChild(rank);
    row.appendChild(name);
    row.appendChild(endlessScore);
    row.appendChild(roundScore);
    row.appendChild(time);

    // Put in leaderboard table
    leaderboardContainer.appendChild(row);
}

document.getElementById('search').addEventListener('submit', function(event) {
    // Prevent the form from submitting
    event.preventDefault();

    // Get the user input
    const name = document.getElementById('player-name').value;
    const leaderboardContainer = document.getElementById("leaderboard-rows");

    // Check that the name is not empty
    if(name.length > 0) {
        // Get the values from the form fields
        const jsonBody = {
            "name": name,
        };

        // Do something with the form data (e.g., send it to a server)
        fetchEndpoint("",jsonBody)
        .then(response => {
            // Get rid of all child elements
            deleteRows(leaderboardContainer);
            // Create the user a row
            createUserRow(response.Record[0],leaderboardContainer);
        })
        .catch(error => {
            // Handle error if fetching data fails
            console.error('Error:', error);
        });
    }

    // Reset the form fields (optional)
    document.getElementById('registration-form').reset();
});