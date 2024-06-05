document.addEventListener('DOMContentLoaded', function () {
    const fetchButton = document.getElementById('fetch-button');
    fetchButton.addEventListener('click', function () {
        const programName = document.getElementById('program-name-input').value;
        console.log('User Program Name:', programName);
        if (programName) {
            fetchParticipantsByProgramName(programName);
        } else {
            console.error('Program name not provided by user');
        }
    });
});

let participantsData = []; // Store the fetched participants data

function fetchParticipantsByProgramName(programName) {
    fetch(`http://localhost/utem-community-gardening/api/viewParticipant.php?program_name=${encodeURIComponent(programName)}`)
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
    const participantsListContainer = document.getElementById('participants-list-container');
    participantsListContainer.innerHTML = '<h2>Participants List</h2>'; // Keep the title

    participants.forEach(participant => {
        const participantItem = document.createElement('div');
        participantItem.className = 'participant-item';

        participantItem.innerHTML = `
            <h3>${participant.studentName}</h3>
            <p>Email: ${participant.email}</p>
            <p>Matric Number: ${participant.matric_number}</p>
            <p>Register Date: ${new Date(participant.register_date).toLocaleDateString()}</p>
            <p>Status: ${participant.status}</p>
        `;

        participantsListContainer.appendChild(participantItem);
    });
}

function searchParticipants(query) {
    const filteredParticipants = participantsData.filter(participant => {
        return participant.studentName.toLowerCase().includes(query) ||
            participant.email.toLowerCase().includes(query) ||
            participant.matric_number.toLowerCase().includes(query);
    });

    displayParticipants(filteredParticipants);
}
