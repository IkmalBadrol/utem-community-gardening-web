document.addEventListener('DOMContentLoaded', function() {
    fetchPrograms();
});

function fetchPrograms() {
    fetch('../../../api/viewProgramAdmin.php') // Update with the correct path to your PHP file
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
    programsListContainer.innerHTML = ''; // Clear previous content

    programs.forEach(program => {
        const programItem = document.createElement('div');
        programItem.className = 'program-item';

        const status = program.total_participant >= program.participant_limit ? 'Closed' : 'Open';

        programItem.innerHTML = `
            <h3>${program.name}</h3>
            <p> ${program.program_details}</p>
            <p>Date: ${new Date(program.date_time).toLocaleDateString()}</p>
            <p>Time: ${new Date(program.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p>Participants: ${program.total_participant} / ${program.participant_limit}</p>
            <p>Location: ${program.location}</p>
            <p>Details: ${program.program_details}</p>
            <p class="status">Status: ${status}</p>
            <button class="edit-button" onclick="viewParticipants(${program.id})">View Participants</button>

        `;

        programsListContainer.appendChild(programItem);
    });
}

function editProgram(programId) {
    // Redirect to edit page with the program ID or handle edit logic here
    window.location.href = `editProgramAdmin.html?program_id=${programId}`;
}


function viewParticipants(programId) {
    localStorage.setItem('program_id', programId);
    window.location.href = 'viewParticipant.html';
}
