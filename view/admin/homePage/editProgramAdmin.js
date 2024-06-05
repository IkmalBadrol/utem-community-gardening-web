document.addEventListener('DOMContentLoaded', function() {
    let initialProgramData = {}; // Object to store the initial data

    fetchProgramDetails();

    const editProgramForm = document.getElementById('edit-program-form');
    editProgramForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        
        // Extract programId from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const programId = urlParams.get('program_id');

        // Call editProgram function with programId
        editProgram(programId, initialProgramData);
    });

    function fetchProgramDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const programId = urlParams.get('program_id');

        if (!programId) {
            console.error('Program ID is missing from the URL');
            return;
        }

        fetch(`../../../api/editProgram.php?program_id=${programId}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'Success') {
                    const program = data.programs[0];
                    initialProgramData = {
                        name: program.name,
                        program_details: program.program_details,
                        date_time: program.date_time.replace(' ', 'T'),
                        participant_limit: program.participant_limit.toString(),
                        location: program.location
                    }; // Store initial data with correct formats
                    document.getElementById('name').value = program.name;
                    document.getElementById('program-details').value = program.program_details;
                    document.getElementById('datetime').value = program.date_time.replace(' ', 'T');
                    document.getElementById('participant-limit').value = program.participant_limit;
                    document.getElementById('location').value = program.location;
                } else {
                    console.error('No programs found');
                }
            })
            .catch(error => console.error('Error fetching program details:', error));
    }

    function editProgram(programId, initialData) {
        const programData = {
            name: document.getElementById('name').value,
            program_details: document.getElementById('program-details').value,
            date_time: document.getElementById('datetime').value,
            participant_limit: document.getElementById('participant-limit').value,
            location: document.getElementById('location').value
        };

        // Log the formData for debugging
        console.log('Form Data:', programData);
        console.log('Initial Data:', initialData);

        // Check if there are any changes
        const changes = {};
        for (const key in programData) {
            if (programData[key] !== initialData[key]) {
                changes[key] = programData[key];
            }
        }

        // Log the changes for debugging
        console.log('Changes:', changes);

        if (Object.keys(changes).length === 0) {
            alert('No changes detected.');
            return;
        }

        // Send the updated program data
        fetch(`../../../api/editProgram.php?program_id=${programId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(changes)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'Success') {
                alert('Program updated successfully');
                window.location.href = '../homePage/homePageAdmin.html';
            } else {
                alert('Failed to update program: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error updating program:', error);
            alert('Error updating program. Please try again later.');
        });
    }
});
