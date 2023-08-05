const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2305-ftb-pt-web-pt';
// Use the APIURL variable for fetch requests
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/2305-ftb-pt-web-pt/`;
const players_API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/2305-ftb-pt-web-pt/players`;


const fetchAllPlayers = async () => {
    try {
        const response = await fetch(players_API_URL);
        const players = await response.json();
        //console.log(players.data);
        return players.data;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};


const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${players_API_URL}/${playerId}`);
        const playerData = await response.json();
        console.log("fetch single player", playerData);
        return playerData;

    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};


const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(`${players_API_URL}`, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(playerObj)
        });
        const player = await response.json();
        console.log(player);
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};


const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${players_API_URL}/${playerId}`, {
            method: 'DELETE'
        });
        const deletedPlayer = await response.json();

        console.log(deletedPlayer);
        return deletedPlayer;

        //renderAllPlayers(players);
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};


const renderAllPlayers = async (playerList) => {
    try {
        playerContainer.innerHTML = "";
        playerList.forEach((player) => {
            const playerElement = document.createElement("div");
        playerElement.classList.add("player");
        playerElement.innerHTML = `
        <h2>${player.name}</h2>
        <p>${player.id}</p>
        <p>${player.breed}</p>
        <p>${player.status}</p>
        <img src="${player.imageUrl}" alt="img broken"/>
        <button class="details-button" data-id="${player.id}">See Details</button>
        <button class="delete-button" data-id="${player.id}">Delete</button>
        `;
        playerContainer.appendChild(playerElement);

        //See Details
        const detailsButton = playerElement.querySelector(".details-button");
        detailsButton.addEventListener("click", async (event) => {
            const playerId = event.target.dataset.id;
        try {
            const playerDetails = await fetchSinglePlayer(playerId);
            console.log('Player details:', playerDetails);
            const playerDetailsPage = window.open("", "_blank");
            playerDetailsPage.document.write(`
            <h1>${player.name}</h1>
            <p>ID: ${player.id}</p>
            <p>Breed: ${player.breed}</p>
            <p>Status: ${player.status}</p>
            <img src="${player.imageUrl}" alt="image broken"/>
            <button onclick="window.close()">Close</button>
            `);
        } catch (err) {
            console.error('Error fetching player details:', err);
        }
    });
        //delete button
        const deleteButton = playerElement.querySelector('.delete-button');
        deleteButton.addEventListener('click', async (event) => {
          const playerId = event.target.dataset.id;
          await removePlayer(playerId);
          await init();
        })
    });
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};


const renderSinglePlayer = async (playerId) => {
    try {
        const player = await fetchSinglePlayer(playerId);

        // create new HTML element to display player details
        const playerDetailsElement = document.createElement('div');
        playerDetailsElement.classList.add('player-details');
        playerDetailsElement.innerHTML = `
        <h2>${player.data.player.name}<h2/>
        <p>${player.data.player.id}<p/>
        <p>${player.data.player.breed}<p/>
        <p>${player.data.player.status}<p/>
        
        <button class="close-button">Close</button>
        `;
        playerContainer.appendChild(playerDetailsElement);
        
        //add event listener to close button
        const closeButton = playerDetailsElement.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
        playerDetailsElement.remove();
      });
    } catch (err) {
        console.error('Uh oh, trouble rendering single player details!', err);
    }
}


const renderNewPlayerForm = () => {
    let formHtml = `
    <form>
    <span class='renderPlayer'>
    <label for="title">Name</label>
    <input type="text" id="name" name="title" placeholder="Name">
    <label for="id">ID</label>
    <input type="text" id="id" name="id" placeholder="ID">
    <label for="breed">Breed</label>
    <input type="text" id="breed" name="breed" placeholder="Breed">
    <label for="status">Status</label>
    <input type="text" id="status" name="status" placeholder="Status">
    <label for="image_url">Image URL</label>
    <input type="text" id="image_url" name="image_url" placeholder="Image URL">
    </span>
    <span class='createBorder'>
    <button type="submit">Create</button>
    </span>
    </form>
    `;
    newPlayerFormContainer.innerHTML = formHtml;

    let form = newPlayerFormContainer.querySelector('form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        let name = document.getElementById('name').value;
        let id = document.getElementById('id').value;
        let breed = document.getElementById('breed').value;
        let status = document.getElementById('status').value;
        let imageUrl = document.getElementById('image_url').value;

        let playerData = {name: name, id: id, breed: breed, status: status, imageUrl: imageUrl};

        await addNewPlayer(playerData);

        const data = await fetchAllPlayers();
        console.log(data.players);
        renderAllPlayers(data.players);
    });
}

function renderPlayer() {
    const name = document.querySelector('name');
    name.style.fontSize = '23rem';
}

const init = async () => {
    const data = await fetchAllPlayers();
    renderAllPlayers(data.players);
    renderNewPlayerForm();
}

init();