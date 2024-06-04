document.getElementById('post-program-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather the form data
    const name = document.getElementById('name').value;
    const datetime = document.getElementById('datetime').value;
    const participantLimit = document.getElementById('participant-limit').value;
    const location = document.getElementById('location').value;
    const programDetail = document.getElementById('details').value;

    const adminId = sessionStorage.getItem('adminId');
    console.log('admin id: ', adminId);

    // Create the data object to be sent to the PHP backend
    const programData = {
        name: name,
        date_time: datetime,
        participant_limit: participantLimit,
        location: location,
        // Assuming total_participant and status are not inputs in the form but default values
        total_participant: 0,
        status: 'Open',
        program_details : programDetail,
        admin_id : adminId
    };

    // Send the data to the PHP backend using fetch
    fetch('../../../api/postProgram.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(programData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'Success') {
            alert('Program added successfully!');
            // Optionally, you can redirect the user or reset the form
            window.location.href = '../homePage/homePageAdmin.html';
            document.getElementById('post-program-form').reset();
        } else {
            alert('Failed to add program: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while adding the program.');
    });
});
