document.addEventListener('DOMContentLoaded', function () {
    fetchPrograms();
});

function fetchPrograms() {
    fetch('http://localhost/utem-community-gardening/api/viewRegisteredProgram.php')
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
            <h3>${program.name}</h3>
            <p>Date: ${new Date(program.date_time).toLocaleDateString()}</p>
            <p>Time: ${new Date(program.date_time).toLocaleTimeString()}</p>
            <p>Participants: ${program.total_participant} / ${program.participant_limit}</p>
            <p>Location: ${program.location}</p>
            <p class="status">Status: ${status}</p>
        `;

        programsListContainer.appendChild(programItem);
    });
}
