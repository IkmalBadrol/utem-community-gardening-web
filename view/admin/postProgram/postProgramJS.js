document.addEventListener('DOMContentLoaded', ()=> {
    const postProgramForm = document.getElementById('post-program-form');

    postProgramForm.addEventListener('submit',(event)=>{
        event.preventDefault();

        const name = document.getElementById('name').value;
        const dateTime = document.getElementById('datetime').value;
        const participantLimit = document.getElementById('participant-limit').value;
        const location = document.getElementById('location').value;
        //const status = document.getElementById('status').value;

        console.log('name1',name); 

        fetch('../../../api/postProgram.php', {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({
                name: name,
                date_time: dateTime,
                participant_limit: participantLimit,
                location: location,
                //status: status,
            }),

        }).then(response =>{
            console.log('Response Recieved', response);
            console.log('name',name);
            return response.json();
        }).then(data => {
            console.log('Data received', data);
            if (data.status === 'Success') {
                console.log('Login successful, redirecting to homePage');
                alert('Login successful!');
                console.log('status:', data.status);
                window.location.href = '../homePage/homePageAdmin.html'; 
            } else {
                console.error('Login failed:', data.message);
                alert('Error: ' + data.message);
            }
        }).catch((error) => {
            console.error('Error:', error);
            alert('An unexpected error occurred. Please try again later.');
        });

    });
});