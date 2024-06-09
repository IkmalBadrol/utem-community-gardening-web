document.addEventListener('DOMContentLoaded', function () {
    fetchPrograms();
});

function fetchPrograms() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        alert('You need to log in first to view the programs.');
        window.location.href = '../loginUser/loginUser.html'; // Redirect to login page
        return;
    }

    fetch('http://localhost/utem-community-gardening/api/viewAllProgram.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: userId
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
            <button class="join-button" data-program-id="${program.id}" ${program.is_registered ? 'disabled' : ''}>
                ${program.is_registered ? 'Joined' : 'Join'}
            </button>
        `;

        programsListContainer.appendChild(programItem);

        if (!program.is_registered) {
            const joinButton = programItem.querySelector('.join-button');
            joinButton.addEventListener('click', () => handleJoinProgram(program.id));
        }
    });
}

function handleJoinProgram(programId) {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
        alert('You need to log in first to join the program.');
        window.location.href = '../loginUser/loginUser.html';
        return;
    }

    fetch('http://localhost/utem-community-gardening/api/registerProgram.php', {
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
