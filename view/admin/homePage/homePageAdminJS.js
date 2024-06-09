document.addEventListener('DOMContentLoaded', function() {
    fetchPrograms();
});

function fetchPrograms() {
    fetch('../../../api/viewAllProgram.php') // Update with the correct path to your PHP file
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
            <button class="edit-button" onclick="editProgram(${program.id})">Edit</button> 
            <button class="delete-button" onclick="deleteProgram(${program.id})">Delete</button>

        `;

        programsListContainer.appendChild(programItem);
    });
}

function editProgram(programId) {
    // Redirect to edit page with the program ID or handle edit logic here
    window.location.href = `editProgramAdmin.html?program_id=${programId}`;
}


function deleteProgram(programId) {
    if (confirm('Are you sure you want to delete this program?')) {
        fetch(`../../../api/editProgram.php?program_id=${programId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'Success') {
                alert('Program deleted successfully');
                fetchPrograms(); // Refresh the list of programs
            } else {
                alert('Failed to delete program: ' + data.message);
            }
        })
        .catch(error => console.error('Error deleting program:', error));
    }
}