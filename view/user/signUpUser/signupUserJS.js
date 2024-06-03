document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('studentSignUpForm');
    const staffForm = document.getElementById('staffSignUpForm');
    const studentBtn = document.getElementById('studentBtn');
    const staffBtn = document.getElementById('staffBtn');

    // Toggle form display based on user role
    studentBtn.addEventListener('click', () => {
        studentForm.style.display = 'block';
        staffForm.style.display = 'none';
        studentBtn.classList.add('active');
        staffBtn.classList.remove('active');
    });


    staffBtn.addEventListener('click', () => {
        staffForm.style.display = 'block';
        studentForm.style.display = 'none';
        staffBtn.classList.add('active');
        studentBtn.classList.remove('active');
    });

    const registerUser = async (form) => {
        const formData = new FormData(form);

        const data = {
            name: formData.get('fullName'),
            ic_number: formData.get('icNumber'),
            email: formData.get('email'),
            phone_number: formData.get('phoneNumber'),
            //matric_number: formData.get('matricNumber') || formData.get('staffNumber'),
            password: formData.get('password')
            //role_id: roleId
        };

        if (form === studentForm) {
            // If student form, set role_id to 2
            data.matric_number = formData.get('matricNumber');
            data.role_id = 'Student';
        } else if (form === staffForm) {
            // If staff form, set role_id to 1
            data.staff_number = formData.get('staffNumber');
            data.role_id = 'Staff';
        }

        console.log('role id : ');
       console.log(data.role_id);

        try {
            const response = await fetch('../../../api/registerUser.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            console.log('json data : ');
            console.log(response);

            const result = await response.json();

            console.log(result);

            if (result.status === 'Success') {
                alert('Registration successful!');
                // Redirect to login or another page
                window.location.href = '../loginUser/loginUser.html';
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during registration. Please try again.');
        }

        console.log('masuk sini 4');

    };

    studentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        registerUser(studentForm);
    });

    staffForm.addEventListener('submit', (event) => {
        event.preventDefault();
        registerUser(staffForm);
    });
});
