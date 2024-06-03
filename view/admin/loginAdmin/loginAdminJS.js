document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    const loginForm = document.querySelector('.login-box form');
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        console.log('Form submission triggered');

        const matricNumber = document.getElementById('matric-number').value;
        const password = document.getElementById('password').value;

        console.log('Matric Number:', matricNumber);
        console.log('Password betul:', password);

        fetch('../../../api/loginUser.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                matric_number: matricNumber,
                password: password,
            }),
        })
        .then(response => {
            console.log('Response received', response);
            return response.json();
        })
        .then(data => {
            console.log('Data received', data);
            if (data.status === 'Success') {
                console.log('Login successful, redirecting to dashboard');
                alert('Login successful!');
                window.location.href = '../homepage/homepageUser.html'; // Replace 'dashboard.html' with the desired page
            } else {
                console.error('Login failed:', data.message);
                alert('Error: ' + data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An unexpected error occurred. Please try again later.');
        });
    });
});
