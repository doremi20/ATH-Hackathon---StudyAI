// login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const loginBtn = document.getElementById('login-btn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnIcon = loginBtn.querySelector('.fa-arrow-right');
    const loader = loginBtn.querySelector('.loader');

    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const formError = document.getElementById('form-error');

    // Toggle Password Visibility
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle icon
        if (type === 'text') {
            togglePasswordBtn.classList.remove('fa-eye-slash');
            togglePasswordBtn.classList.add('fa-eye');
        } else {
            togglePasswordBtn.classList.remove('fa-eye');
            togglePasswordBtn.classList.add('fa-eye-slash');
        }
    });

    // Clear errors on input
    emailInput.addEventListener('input', () => {
        clearError(emailInput, emailError);
        clearError(null, formError);
    });

    passwordInput.addEventListener('input', () => {
        clearError(passwordInput, passwordError);
        clearError(null, formError);
    });

    // Handle Form Submit
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset previous errors
        clearError(emailInput, emailError);
        clearError(passwordInput, passwordError);
        clearError(null, formError);
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        let isValid = true;

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

        if (!isValid) return;

        // Show loading state
        setLoadingState(true);

        // Authentication Simulation with LocalStorage
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('studyai_users')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Success from local storage
                localStorage.setItem('studyai_currentUser', JSON.stringify(user));
                window.location.href = 'index.html';
            } else if (email === 'student@studyai.com' && password === '123456') {
                // Fallback default user
                localStorage.setItem('studyai_currentUser', JSON.stringify({ name: 'Student', email }));
                window.location.href = 'index.html';
            } else {
                // Failure
                setLoadingState(false);
                showError(null, formError, 'Invalid email or password.');
                // Add shake animation to form
                loginForm.classList.add('shake');
                setTimeout(() => loginForm.classList.remove('shake'), 500);
            }
        }, 1500); // 1.5s delay to simulate network request
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
            loginBtn.disabled = true;
            btnText.style.display = 'none';
            btnIcon.style.display = 'none';
            loader.style.display = 'inline-block';
        } else {
            loginBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnIcon.style.display = 'inline-block';
            loader.style.display = 'none';
        }
    }
});
