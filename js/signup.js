// signup.js

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const nameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    const togglePasswordBtn = document.getElementById('toggle-password');
    const toggleConfirmPasswordBtn = document.getElementById('toggle-confirm-password');
    
    const signupBtn = document.getElementById('signup-btn');
    const btnText = signupBtn.querySelector('.btn-text');
    const btnIcon = signupBtn.querySelector('.fa-user-plus');
    const loader = signupBtn.querySelector('.loader');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    const formError = document.getElementById('form-error');

    // Toggle Password Visibility Function
    function setupPasswordToggle(toggleBtn, inputEl) {
        toggleBtn.addEventListener('click', () => {
            const type = inputEl.getAttribute('type') === 'password' ? 'text' : 'password';
            inputEl.setAttribute('type', type);
            
            if (type === 'text') {
                toggleBtn.classList.remove('fa-eye-slash');
                toggleBtn.classList.add('fa-eye');
            } else {
                toggleBtn.classList.remove('fa-eye');
                toggleBtn.classList.add('fa-eye-slash');
            }
        });
    }

    setupPasswordToggle(togglePasswordBtn, passwordInput);
    setupPasswordToggle(toggleConfirmPasswordBtn, confirmPasswordInput);

    // Clear errors on input
    const inputs = [
        { el: nameInput, errorEl: nameError },
        { el: emailInput, errorEl: emailError },
        { el: passwordInput, errorEl: passwordError },
        { el: confirmPasswordInput, errorEl: confirmPasswordError }
    ];

    inputs.forEach(item => {
        item.el.addEventListener('input', () => {
            clearError(item.el, item.errorEl);
            clearError(null, formError);
        });
    });

    // Handle Form Submit
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset previous errors
        inputs.forEach(item => clearError(item.el, item.errorEl));
        clearError(null, formError);
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        
        let isValid = true;

        // Validate Name
        if (!name) {
            showError(nameInput, nameError, 'Full Name is required');
            isValid = false;
        }

        // Validate Email
        if (!email) {
            showError(emailInput, emailError, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError(emailInput, emailError, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate Password
        if (!password) {
            showError(passwordInput, passwordError, 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showError(passwordInput, passwordError, 'Password must be at least 6 characters');
            isValid = false;
        }

        // Validate Confirm Password
        if (!confirmPassword) {
            showError(confirmPasswordInput, confirmPasswordError, 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError(confirmPasswordInput, confirmPasswordError, 'Passwords do not match');
            isValid = false;
        }

        if (!isValid) {
            signupForm.classList.add('shake');
            setTimeout(() => signupForm.classList.remove('shake'), 500);
            return;
        }

        // Show loading state
        setLoadingState(true);

        // Registration with Python Backend
        try {
            const response = await fetch('http://127.0.0.1:5000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Success
                alert('Account created successfully! You can now login.');
                window.location.href = 'login.html';
            } else {
                // Handle API error
                setLoadingState(false);
                showError(emailInput, emailError, data.error || 'Signup failed');
                signupForm.classList.add('shake');
                setTimeout(() => signupForm.classList.remove('shake'), 500);
            }
        } catch (error) {
            console.error('Signup error:', error);
            setLoadingState(false);
            showError(null, formError, 'Network error. Make sure the server is running.');
            signupForm.classList.add('shake');
            setTimeout(() => signupForm.classList.remove('shake'), 500);
        }
    });

    // Helper Functions
    function showError(inputElement, errorElement, message) {
        if (inputElement) {
            inputElement.closest('.input-field').classList.add('error');
        }
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    }

    function clearError(inputElement, errorElement) {
        if (inputElement) {
            inputElement.closest('.input-field').classList.remove('error');
        }
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            signupBtn.disabled = true;
            btnText.style.display = 'none';
            btnIcon.style.display = 'none';
            loader.style.display = 'inline-block';
        } else {
            signupBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnIcon.style.display = 'inline-block';
            loader.style.display = 'none';
        }
    }
});
