document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.form');
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');

    // Tab switching functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            forms.forEach(form => form.classList.remove('active'));

            button.classList.add('active');
            const formId = `${button.dataset.tab}-form`;
            document.getElementById(formId).classList.add('active');
        });
    });

    // Handle signin form submission
    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        try {
            const response = await fetch('http://localhost:5000/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Sign in successful!');
                console.log('Sign In Response:', data);

                // Store token in localStorage
                localStorage.setItem('token', data.token);

                // ✅ Redirect to index.html after successful sign-in
                window.location.href = 'index.html';
            } else {
                alert(data.message || 'Sign in failed.');
            }
        } catch (err) {
            console.error('Signin error:', err);
            alert('An error occurred during sign in.');
        }
    });

    // Handle signup form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fullName = document.getElementById('fullname').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const termsAccepted = document.getElementById('terms').checked;

        if (!termsAccepted) {
            alert('Please accept the terms and conditions');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Account created successfully!');
                console.log('Sign Up Response:', data);

                // ✅ Switch to the Sign In tab after successful registration
                tabButtons.forEach(button => button.classList.remove('active'));
                document.querySelector('[data-tab="signin"]').classList.add('active');
                document.getElementById('signin-form').classList.add('active');
            } else {
                alert(data.message || 'Sign up failed.');
            }
        } catch (err) {
            console.error('Signup error:', err);
            alert('An error occurred during sign up.');
        }
    });

});








