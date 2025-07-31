document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const profilePhotoInput = document.getElementById('profilePhoto');
    const fileNameDisplay = document.querySelector('.file-upload-group .file-name');

    if (profilePhotoInput && fileNameDisplay) {
        profilePhotoInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                fileNameDisplay.textContent = this.files[0].name;
            } else {
                fileNameDisplay.textContent = 'No file chosen';
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            // Basic Form Validation (you can expand this)
            const fullName = document.getElementById('fullName').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const aadhaar = document.getElementById('aadhaar').value.trim();
            const house = document.getElementById('house').value.trim();
            const district = document.getElementById('district').value.trim();
            const state = document.getElementById('state').value.trim();
            const pincode = document.getElementById('pincode').value.trim();
            const profilePhoto = document.getElementById('profilePhoto').files[0];

            if (!fullName || !phone || !aadhaar || !house || !district || !state || !pincode || !profilePhoto) {
                alert('Please fill in all required fields and upload your profile photo.');
                return;
            }

            if (!/^[0-9]{10}$/.test(phone)) {
                alert('Please enter a valid 10-digit phone number (e.g., 9876543210).');
                return;
            }

            if (!/^[0-9]{12}$/.test(aadhaar)) {
                alert('Please enter a valid 12-digit Aadhaar number.');
                return;
            }

            if (!/^[0-9]{6}$/.test(pincode)) {
                alert('Please enter a valid 6-digit Pincode.');
                return;
            }

            // Simulate form data collection for Razorpay
            const formData = {
                fullName: fullName,
                phone: phone,
                aadhaar: aadhaar,
                house: house,
                landmark: document.getElementById('landmark').value.trim(),
                district: district,
                state: state,
                pincode: pincode,
                profilePhotoName: profilePhoto ? profilePhoto.name : 'No photo uploaded'
            };

            console.log('Form Data:', formData); // Log form data for simulation

            // Initialize Razorpay
            // IMPORTANT: Your LIVE Razorpay Key ID is used here.
            // NEVER expose your Key Secret (XRKEjAb12GugSeeqiKET6mR6) in frontend code.
            const razorpayKeyId = 'rzp_live_O5cLSrbymHw5Dj';

            const options = {
                key: razorpayKeyId,
                amount: 4900, // Amount in paise (₹49 = 4900 paise)
                currency: 'INR',
                name: 'BSHub',
                description: 'Service Provider Account Verification',
                image: 'img/bshub-logo-dark.svg', // Optional: BSHub logo on payment popup
                handler: function (response) {
                    // This function is called after successful payment
                    console.log('Razorpay Payment Success:', response);
                    // In a real application, you would send 'response.razorpay_payment_id'
                    // and other data to your backend for server-side verification.
                    // For now, we redirect to success dashboard page
                    window.location.href = 'success.html';
                },
                prefill: {
                    name: formData.fullName,
                    contact: formData.phone,
                    email: '' // You might want to add an email input to the form
                },
                notes: {
                    address: `${formData.house}, ${formData.landmark}, ${formData.district}, ${formData.state} - ${formData.pincode}`,
                    aadhaar_no: formData.aadhaar
                },
                theme: {
                    color: '#101010' // Deeper black theme for Razorpay checkout
                },
                modal: {
                    // Optional: customize modal behavior
                    ondismiss: function() {
                        console.log('Payment window closed by user.');
                        alert('Payment was not completed. Please try again.');
                    }
                }
            };

            const rzp = new Razorpay(options);
            rzp.on('payment.failed', function (response){
                alert('Payment failed: ' + response.error.code + ' - ' + response.error.description);
                console.error('Razorpay Payment Failed:', response.error);
            });
            rzp.open();
        });
    }
});