document.getElementById('post-program-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const name = document.getElementById('name').value;
    const datetime = document.getElementById('datetime').value;
    const participantLimit = document.getElementById('participant-limit').value;
    const location = document.getElementById('location').value;
    const programDetail = document.getElementById('details').value;

    const adminId = sessionStorage.getItem('adminId');
    console.log('admin id: ', adminId);

    const programData = {
        name: name,
        date_time: datetime,
        participant_limit: participantLimit,
        location: location,
        total_participant: 0,
        status: 'Open',
        program_details : programDetail,
        admin_id : adminId
    };

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
