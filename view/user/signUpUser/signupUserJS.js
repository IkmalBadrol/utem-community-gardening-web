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

    const validateForm = (form) => {
        const formData = new FormData(form);
        const namePattern = /^[A-Za-z\s]+$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^[0-9]{10,11}$/;
        const icPattern = /^[0-9]{12}$/;
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const errors = {};

        // Clear previous error messages
        form.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        if (!formData.get('fullName') || !namePattern.test(formData.get('fullName'))) {
            errors.fullName = 'Full name is required and can only consist of alphabets.';
        }
        if (!formData.get('password') || !passwordPattern.test(formData.get('password'))) {
            errors.password = 'Password must be at least 8 characters long, contain at least one number, one uppercase letter, and one special character.';
        }
        if (!formData.get('email') || !emailPattern.test(formData.get('email'))) {
            errors.email = 'Valid email is required.';
        }
        if (!formData.get('phoneNumber') || !phonePattern.test(formData.get('phoneNumber'))) {
            errors.phoneNumber = 'Valid phone number is required (10-11 digits).';
        }
        if (!formData.get('icNumber') || !icPattern.test(formData.get('icNumber'))) {
            errors.icNumber = 'IC number is required and must be exactly 12 digits.';
        }
        if (form === studentForm && !formData.get('matricNumber')) {
            errors.matricNumber = 'Matric number is required for students.';
        }
        if (form === staffForm && !formData.get('staffNumber')) {
            errors.staffNumber = 'Staff number is required for staff.';
        }

        return errors;
    };

    const displayErrors = (form, errors) => {
        Object.keys(errors).forEach(key => {
            const inputGroup = form.querySelector(`[name="${key}"]`).closest('.input-group');
            let errorElement = inputGroup.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.classList.add('error-message');
                inputGroup.appendChild(errorElement);
            }
            errorElement.textContent = errors[key];
        });
    };

    const registerUser = async (form) => {
        const errors = validateForm(form);

        if (Object.keys(errors).length > 0) {
            displayErrors(form, errors);
            return;
        }

        const formData = new FormData(form);

        const data = {
            name: formData.get('fullName'),
            ic_number: formData.get('icNumber'),
            email: formData.get('email'),
            phone_number: formData.get('phoneNumber'),
            password: formData.get('password')
        };

        if (form === studentForm) {
            data.matric_number = formData.get('matricNumber');
            data.role_id = 'Student';
        } else if (form === staffForm) {
            data.staff_number = formData.get('staffNumber');
            data.role_id = 'Staff';
        }

        console.log('role id : ', data.role_id);

        try {
            const response = await fetch('../../../api/registerUser.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            console.log('json data : ', response);

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
