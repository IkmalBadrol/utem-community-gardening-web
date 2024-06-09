document.addEventListener('DOMContentLoaded', function() {
    fetchPrograms();
});

function fetchPrograms() {
    fetch('../../../api/getLatestProgramsforMenuPage.php') // Update with the correct path to your PHP file
        .then(response => response.json())
        .then(data => {
            if (data.status === 'Success') {
                console.log('Programs:', data.programs); // Log the programs array
                displayPrograms(data.programs);
            } else {
                console.error('No programs found');
            }
        })
        .catch(error => console.error('Error fetching programs:', error));
}


function displayPrograms(programs) {
    const programsListContainer = document.querySelector('.programs');

    programs.forEach(program => {
        const programCard = document.createElement('div');
        programCard.classList.add('program-card');
        
        const programInfo = document.createElement('div');
        programInfo.classList.add('program-info');
        
        const programName = document.createElement('topName');
        programName.classList.add('program-name');
        programName.textContent = program.name;
        programInfo.appendChild(programName);
        
        const location = document.createElement('span');
        location.classList.add('location');
        location.textContent = `Place: ${program.location}`; // Modified to include "Place: "
        programInfo.appendChild(location);
        
        const ratio = document.createElement('span');
        ratio.classList.add('ratio');
        ratio.textContent = `Participant: ${program.total_participant} / ${program.participant_limit}`;
        programInfo.appendChild(ratio);
        
        const dateProgram = document.createElement('span');
        dateProgram.classList.add('date-time-program');
        dateProgram.textContent = `Date: ${new Date(program.date_time).toLocaleDateString()}`;
        programInfo.appendChild(dateProgram);
        
        const timeProgram = document.createElement('span');
        timeProgram.classList.add('date-time-program');
        timeProgram.textContent = `Time: ${new Date(program.date_time).toLocaleTimeString()}`;
        programInfo.appendChild(timeProgram);
        
    
        
        
        const programDetails = document.createElement('span');
        programDetails.classList.add('program-details');
        programDetails.textContent = program.program_details;
        programInfo.appendChild(programDetails);

        const statusProgram = document.createElement('span');
statusProgram.classList.add('status-program');
statusProgram.textContent = program.status;
statusProgram.classList.add(program.status.toLowerCase());
programInfo.appendChild(statusProgram);

        
        programCard.appendChild(programInfo);
        programsListContainer.appendChild(programCard);
        });
        
}
