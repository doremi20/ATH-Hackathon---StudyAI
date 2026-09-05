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

        // Authentication with Python Backend
        try {
            const response = await fetch('http://127.0.0.1:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Success
                localStorage.setItem('studyai_currentUser', JSON.stringify(data.user));
                window.location.href = 'dashboard.html';
            } else {
                // Failure
                setLoadingState(false);
                showError(null, formError, data.error || 'Invalid email or password.');
                // Add shake animation to form
                loginForm.classList.add('shake');
                setTimeout(() => loginForm.classList.remove('shake'), 500);
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoadingState(false);
            showError(null, formError, 'Network error. Make sure the server is running.');
            loginForm.classList.add('shake');
            setTimeout(() => loginForm.classList.remove('shake'), 500);
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
