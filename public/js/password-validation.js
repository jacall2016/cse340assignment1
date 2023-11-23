// password-validation.js

document.addEventListener('DOMContentLoaded', function () {
    // Function to validate the password
    window.validatePassword = function (passwordInputId, passwordMessageClass, passwordPattern) {
        const passwordInput = document.getElementById(passwordInputId);
        const passwordMessage = document.querySelector(`.${passwordMessageClass}`);

        // Check if the password meets the criteria
        if (!passwordPattern.test(passwordInput.value)) {
            // Show the password message
            passwordMessage.style.visibility = 'visible';

            // Prevent form submission
            return false;
        }

        // Hide the password message
        passwordMessage.style.visibility = 'hidden';

        // Continue with the form submission
        return true;
    };
});
