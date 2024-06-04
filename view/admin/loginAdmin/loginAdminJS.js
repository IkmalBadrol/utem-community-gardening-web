document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    const loginForm = document.querySelector('.login-box form');
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        console.log('Form submission triggered');

        const staffNumber = document.getElementById('staff-number').value;
        const password = document.getElementById('password').value;

        console.log('Staff Number:', staffNumber);
        console.log('Password:', password);

        fetch('../../../api/loginAdmin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                staff_number: staffNumber,
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
               
                sessionStorage.setItem('adminId', data.Admin.id); 
                const adminId = sessionStorage.getItem('adminId');
                console.log('admin ID:', adminId);

                window.location.href = '../homePage/homePageAdmin.html'; 
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
