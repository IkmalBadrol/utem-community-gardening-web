document.addEventListener('DOMContentLoaded', function () {
    fetchPrograms();

    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchQuery = searchInput.value;
            fetchPrograms(searchQuery);
            displaySuggestions(searchQuery);
        });
    }

    if (searchButton) {
        searchButton.addEventListener('click', function () {
            const searchQuery = searchInput.value;
            fetchPrograms(searchQuery);
        });
    }
});

function fetchPrograms(searchQuery = '') {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        alert('You need to log in first to view the programs.');
        window.location.href = '../loginUser/loginUser.html'; // Redirect to login page
        return;
    }

    fetch('../../../api/viewAllProgram.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: userId,
            search_query: searchQuery // Include search query in the request
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'Success') {
            displayPrograms(data.programs);
        } else {
            console.error('No programs found');
        }
    })
    .catch(error => console.error('Error fetching programs:', error));
}

function displayPrograms(programs) {
    const programsListContainer = document.getElementById('programs-list-container');
    programsListContainer.innerHTML = ''; // Clear previous results

    programs.forEach(program => {
        const programItem = document.createElement('div');
        programItem.className = 'program-item';

        const status = program.total_participant >= program.participant_limit ? 'Closed' : 'Open';

        programItem.innerHTML = `
            <div class="program-details">
                <h3>${program.name}</h3>
                <p>Date: ${new Date(program.date_time).toLocaleDateString()}</p>
                <p>Time: ${new Date(program.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p>Participants: ${program.total_participant} / ${program.participant_limit}</p>
                <p>Location: ${program.location}</p>
                <p>Details: ${program.program_details}</p>
                <p class="status">Status: ${status}</p>
            </div>
        `;

        if (status === 'Open' && !program.is_registered) {
            const joinButton = document.createElement('button');
            joinButton.className = 'join-button';
            joinButton.textContent = 'Join';
            joinButton.dataset.programId = program.id;

            joinButton.addEventListener('click', () => handleJoinProgram(program.id));
            programItem.appendChild(joinButton);
        } else if (program.is_registered) {
            const joinButton = document.createElement('button');
            joinButton.className = 'join-button';
            joinButton.textContent = 'Joined';
            joinButton.disabled = true;
            programItem.appendChild(joinButton);
        }

        programsListContainer.appendChild(programItem);
    });
}

function displaySuggestions(searchQuery) {
    const suggestionsContainer = document.getElementById('suggestions-container');
    suggestionsContainer.innerHTML = ''; // Clear previous suggestions

    if (searchQuery.trim() === '') {
        return; // No need to show suggestions if the search query is empty
    }

    fetch('http://localhost/utem-community-gardening/api/viewAllProgram.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: sessionStorage.getItem('userId'),
            search_query: searchQuery // Include search query in the request
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'Success') {
            const suggestions = data.programs
                .filter(program => program.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .slice(0, 5); // Show only the first 5 suggestions

            suggestions.forEach(suggestion => {
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'suggestion-item';
                suggestionItem.textContent = suggestion.name;

                suggestionItem.addEventListener('click', () => {
                    const searchInput = document.getElementById('search-input');
                    searchInput.value = suggestion.name;
                    fetchPrograms(suggestion.name);
                    suggestionsContainer.innerHTML = ''; // Clear suggestions after selection
                });

                suggestionsContainer.appendChild(suggestionItem);
            });
        } else {
            console.error('No programs found');
        }
    })
    .catch(error => console.error('Error fetching suggestions:', error));
}

function handleJoinProgram(programId) {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
        alert('You need to log in first to join the program.');
        window.location.href = '../loginUser/loginUser.html';
        return;
    }

    fetch('../../../api/registerProgram.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: userId,
            program_id: programId,
            register_date: new Date().toISOString().slice(0, 10),
            status: 'Registered',
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'Success') {
            alert('You have successfully joined the program!');
            updateProgramStatus(programId);
        } else if (data.message === 'You are already registered for this program') {
            alert(data.message);
        } else {
            alert('Failed to join the program. Please try again later.');
        }
    })
    .catch(error => {
        console.error('Error joining program:', error);
        alert('An error occurred. Please try again later.');
    });
}

function updateProgramStatus(programId) {
    const programItem = document.querySelector(`.join-button[data-program-id="${programId}"]`).parentNode;
    const statusElement = programItem.querySelector('.status');

    statusElement.textContent = 'Status: Registered';
    const joinButton = programItem.querySelector('.join-button');
    joinButton.disabled = true;
    joinButton.textContent = 'Joined';
}
