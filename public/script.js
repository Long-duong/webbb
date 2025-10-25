document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate trước khi gửi
    if (!validateForm()) {
        return;
    }
    
    const formData = new FormData(this);
    const data = {
        userName: formData.get('username'),
        firstName: formData.get('firstname'),
        lastName: formData.get('lastname'),
        email: formData.get('email'),
        password: formData.get('password'),
        address: formData.get('address'),
        birthday: formData.get('birthday'),
        gender: formData.get('gender')
    };

    console.log('Data to send:', data);

    // Hiện loading
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Đang đăng ký...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        console.log('Response status:', response.status);

        const result = await response.json();
        console.log('Response data:', result);
        
        const messageDiv = document.getElementById('message');
        
        if (response.ok) {
            messageDiv.className = 'success';
            messageDiv.textContent = '🎉 Đăng ký thành công! Dữ liệu đã được lưu vào database.';
            messageDiv.style.display = 'block';
            
            // Reset form
            this.reset();
            resetFieldBorders();
            
            // Ẩn thông báo sau 5 giây
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
            
        } else {
            messageDiv.className = 'error';
            messageDiv.style.display = 'block';
            if (result.errors) {
                messageDiv.textContent = '❌ ' + result.errors.map(error => error.msg).join(', ');
            } else {
                messageDiv.textContent = '❌ ' + result.message;
            }
        }
    } catch (error) {
        console.error('Error:', error);
        const messageDiv = document.getElementById('message');
        messageDiv.className = 'error';
        messageDiv.style.display = 'block';
        messageDiv.textContent = '❌ Lỗi kết nối server!';
    } finally {
        // Khôi phục button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        updateSubmitButton();
    }
});

// Validate form trước khi gửi
function validateForm() {
    const username = document.getElementById('username');
    const firstname = document.getElementById('firstname');
    const lastname = document.getElementById('lastname');
    const password = document.getElementById('password');
    const email = document.getElementById('email');
    const birthday = document.getElementById('birthday');
    const gender = document.querySelector('input[name="gender"]:checked');
    
    let isValid = true;
    const messageDiv = document.getElementById('message');
    
    // Validate User Name
    if (username.value.length < 8) {
        showError('User Name phải có ít nhất 8 ký tự');
        username.focus();
        isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username.value)) {
        showError('User Name chỉ được chứa chữ cái, số và gạch dưới');
        username.focus();
        isValid = false;
    }
    
    // Validate First Name
    else if (firstname.value.length < 8) {
        showError('First Name phải có ít nhất 8 ký tự');
        firstname.focus();
        isValid = false;
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(firstname.value)) {
        showError('First Name chỉ được chứa chữ cái');
        firstname.focus();
        isValid = false;
    }
    
    // Validate Last Name
    else if (lastname.value.length < 8) {
        showError('Last Name phải có ít nhất 8 ký tự');
        lastname.focus();
        isValid = false;
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(lastname.value)) {
        showError('Last Name chỉ được chứa chữ cái');
        lastname.focus();
        isValid = false;
    }
    
    // Validate Email
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showError('Email không hợp lệ');
        email.focus();
        isValid = false;
    }
    
    // Validate Password
    else if (password.value.length < 6) {
        showError('Password phải có ít nhất 6 ký tự');
        password.focus();
        isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password.value)) {
        showError('Password phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@$!%*?&)');
        password.focus();
        isValid = false;
    }
    
    // Validate Birthday
    else if (!birthday.value) {
        showError('Vui lòng chọn ngày sinh');
        birthday.focus();
        isValid = false;
    }
    
    // Validate Gender
    else if (!gender) {
        showError('Vui lòng chọn giới tính');
        isValid = false;
    }
    
    if (isValid) {
        messageDiv.textContent = '';
        messageDiv.className = '';
        messageDiv.style.display = 'none';
    }
    
    return isValid;
}

function showError(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.className = 'error';
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
}

// Real-time validation và disable button
function updateSubmitButton() {
    const username = document.getElementById('username').value;
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const birthday = document.getElementById('birthday').value;
    const gender = document.querySelector('input[name="gender"]:checked');
    
    const isUsernameValid = username.length >= 8 && /^[a-zA-Z0-9_]+$/.test(username);
    const isFirstnameValid = firstname.length >= 8 && /^[a-zA-ZÀ-ỹ\s]+$/.test(firstname);
    const isLastnameValid = lastname.length >= 8 && /^[a-zA-ZÀ-ỹ\s]+$/.test(lastname);
    const isPasswordValid = password.length >= 6 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password);
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isBirthdayValid = birthday !== '';
    const isGenderValid = gender !== null;
    
    const isValid = isUsernameValid && isFirstnameValid && isLastnameValid && 
                   isPasswordValid && isEmailValid && isBirthdayValid && isGenderValid;
    
    document.getElementById('submitBtn').disabled = !isValid;
}

// Real-time field validation
document.getElementById('username').addEventListener('input', function() {
    validateField(this, this.value.length >= 8 && /^[a-zA-Z0-9_]+$/.test(this.value));
    updateSubmitButton();
});

document.getElementById('firstname').addEventListener('input', function() {
    validateField(this, this.value.length >= 8 && /^[a-zA-ZÀ-ỹ\s]+$/.test(this.value));
    updateSubmitButton();
});

document.getElementById('lastname').addEventListener('input', function() {
    validateField(this, this.value.length >= 8 && /^[a-zA-ZÀ-ỹ\s]+$/.test(this.value));
    updateSubmitButton();
});

document.getElementById('password').addEventListener('input', function() {
    const hasUpper = /[A-Z]/.test(this.value);
    const hasLower = /[a-z]/.test(this.value);
    const hasNumber = /\d/.test(this.value);
    const hasSpecial = /[@$!%*?&]/.test(this.value);
    const isValid = this.value.length >= 6 && hasUpper && hasLower && hasNumber && hasSpecial;
    validateField(this, isValid);
    updateSubmitButton();
});

document.getElementById('email').addEventListener('input', function() {
    validateField(this, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value));
    updateSubmitButton();
});

document.getElementById('birthday').addEventListener('input', updateSubmitButton);
document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener('change', updateSubmitButton);
});

function validateField(field, isValid) {
    if (field.value === '') {
        field.style.borderColor = '#ddd';
    } else if (isValid) {
        field.style.borderColor = '#51cf66';
    } else {
        field.style.borderColor = '#ff6b6b';
    }
}

function resetFieldBorders() {
    const fields = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="date"]');
    fields.forEach(field => {
        field.style.borderColor = '#ddd';
    });
}

// Khởi tạo button state
updateSubmitButton();

// Thêm event listener để ẩn thông báo khi user bắt đầu nhập lại
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
        const messageDiv = document.getElementById('message');
        if (messageDiv.style.display === 'block') {
            messageDiv.style.display = 'none';
        }
    });
});

// Hiển thị hướng dẫn password khi focus
document.getElementById('password').addEventListener('focus', function() {
    const messageDiv = document.getElementById('message');
    messageDiv.className = 'success';
    messageDiv.style.display = 'block';
    messageDiv.textContent = '💡 Gợi ý: Password cần có chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&)';
});

document.getElementById('password').addEventListener('blur', function() {
    const messageDiv = document.getElementById('message');
    if (messageDiv.textContent.includes('Gợi ý:')) {
        messageDiv.style.display = 'none';
    }
});