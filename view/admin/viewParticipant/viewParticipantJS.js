document.addEventListener('DOMContentLoaded', function () {
    const programId = localStorage.getItem('program_id');
    if (programId) {
        fetchProgramDetails(programId); // Fetch program details including program_name
        fetchParticipantsByProgramId(programId);
    } else {
        console.error('No program ID found in local storage');
    }

    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button'); // Get the search button element

    searchButton.addEventListener('click', function () {
        const query = searchInput.value.toLowerCase();
        handleSearchInput(query); // Handle search input
    });

    // Print button functionality
    const printButton = document.getElementById('print-button');
    printButton.addEventListener('click', function () {
        window.print();
    });
});

function fetchProgramDetails(programId) {
    fetch(`http://localhost/utem-community-gardening/api/getProgramNameforViewParticipant.php?program_id=${encodeURIComponent(programId)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'Success') {
                displayProgramName(data.program_name);
            } else {
                console.error('Failed to fetch program details:', data.message);
            }
        })
        .catch(error => console.error('Error fetching program details:', error));
}

function displayProgramName(programName) {
    const programNameElement = document.getElementById('program-name');
    programNameElement.textContent = programName;
}

let participantsData = []; // Store the fetched participants data

function fetchParticipantsByProgramId(programId) {
    fetch(`http://localhost/utem-community-gardening/api/viewParticipant.php?program_id=${encodeURIComponent(programId)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'Success') {
                participantsData = data.participants; // Save the fetched data
                displayParticipants(participantsData);
            } else {
                console.error('No participants found');
            }
        })
        .catch(error => console.error('Error fetching participants:', error));
}

function displayParticipants(participants) {
    const participantsTableBody = document.querySelector('#participants-table tbody');
    participantsTableBody.innerHTML = ''; // Clear existing rows

    participants.forEach(participant => {
        const participantRow = document.createElement('tr');

        const studentNameCell = document.createElement('td');
        studentNameCell.textContent = participant.studentName;
        participantRow.appendChild(studentNameCell);

        const emailCell = document.createElement('td');
        emailCell.textContent = participant.email;
        participantRow.appendChild(emailCell);

        const matricNumberCell = document.createElement('td');
        matricNumberCell.textContent = participant.matric_number;
        participantRow.appendChild(matricNumberCell);

        const registerDateCell = document.createElement('td');
        registerDateCell.textContent = new Date(participant.register_date).toLocaleDateString();
        participantRow.appendChild(registerDateCell);

        const statusCell = document.createElement('td');
        statusCell.textContent = participant.status;
        participantRow.appendChild(statusCell);

        participantsTableBody.appendChild(participantRow);
    });
}

function handleSearchInput(query) {
    const filteredParticipants = participantsData.filter(participant => {
        return participant.studentName.toLowerCase().includes(query) ||
            participant.email.toLowerCase().includes(query) ||
            participant.matric_number.toLowerCase().includes(query);
    });

    displayParticipants(filteredParticipants);
}
