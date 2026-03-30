// Selecting Form Elements and Preview Elements
const inputConfigs = [
    { inputId: 'fullName', previewId: 'cv-name', defaultText: 'John Doe' },
    { inputId: 'jobTitle', previewId: 'cv-title', defaultText: 'Senior Frontend Developer' },
    { inputId: 'email', previewId: 'cv-email', icon: '<i class="fa-solid fa-envelope"></i>', defaultText: 'john@example.com' },
    { inputId: 'phone', previewId: 'cv-phone', icon: '<i class="fa-solid fa-phone"></i>', defaultText: '+1 234 567 890' },
    { inputId: 'location', previewId: 'cv-location', icon: '<i class="fa-solid fa-location-dot"></i>', defaultText: 'New York, USA' },
    { inputId: 'portfolio', previewId: 'cv-portfolio', icon: '<i class="fa-solid fa-link"></i>', defaultText: 'linkedin.com/in/johndoe' },
    { inputId: 'summary', previewId: 'cv-summary', defaultText: 'Passionate software engineer with 5+ years of experience in building scalable web applications. Dedicated to creating extraordinary user experiences.' },
    { inputId: 'expJobTitle', previewId: 'cv-exp-title', defaultText: 'Software Engineer' },
    { inputId: 'expCompany', previewId: 'cv-exp-company', defaultText: 'Tech Corp Inc.' },
    { inputId: 'expDates', previewId: 'cv-exp-date', defaultText: '2020 - Present' },
    { inputId: 'expDesc', previewId: 'cv-exp-desc', defaultText: 'Developed key features handling millions of requests.', isHtml: true },
    { inputId: 'eduDegree', previewId: 'cv-edu-degree', defaultText: 'B.S. Computer Science' },
    { inputId: 'eduSchool', previewId: 'cv-edu-school', defaultText: 'University of Technology' },
    { inputId: 'eduYear', previewId: 'cv-edu-year', defaultText: '2019' }
];

// Initialize listeners for text inputs
function initializeLivePreview() {
    inputConfigs.forEach(config => {
        const inputField = document.getElementById(config.inputId);
        const previewElement = document.getElementById(config.previewId);

        if (inputField && previewElement) {
            inputField.addEventListener('input', (e) => {
                const value = e.target.value.trim();
                
                if (value === '') {
                    // Revert to default text if deleted
                    const content = config.icon ? `${config.icon} ${config.defaultText}` : config.defaultText;
                    previewElement.innerHTML = content;
                } else {
                    // Update layout securely
                    if(config.isHtml) {
                        // Very simple formatting for newline chars to break tags
                        const htmlContent = value.replace(/\n/g, '<br>');
                        previewElement.innerHTML = htmlContent;
                    } else if (config.icon) {
                        previewElement.innerHTML = `${config.icon} ${value}`;
                    } else {
                        previewElement.textContent = value;
                    }
                }
            });
        }
    });

    // Special handler for Skills (comma separated to tags)
    const skillsInput = document.getElementById('skills');
    const skillsListPreview = document.getElementById('cv-skills-list');

    if (skillsInput && skillsListPreview) {
        skillsInput.addEventListener('input', (e) => {
            const skillsStr = e.target.value.trim();
            skillsListPreview.innerHTML = ''; // Clear current skills

            if (skillsStr === '') {
                // Default skills
                const defaults = ['JavaScript', 'React', 'CSS', 'Node.js'];
                defaults.forEach(skill => {
                    const span = document.createElement('span');
                    span.className = 'skill-tag';
                    span.textContent = skill;
                    skillsListPreview.appendChild(span);
                });
            } else {
                // Split by comma and create tags
                const tokens = skillsStr.split(',');
                tokens.forEach(token => {
                    const skillName = token.trim();
                    if (skillName) {
                        const span = document.createElement('span');
                        span.className = 'skill-tag';
                        span.textContent = skillName;
                        skillsListPreview.appendChild(span);
                    }
                });
            }
        });
    }
}

// Handle Profile Picture Upload
// Handle Profile Picture Upload
function setupPhotoUpload() {
    const photoInput = document.getElementById('profilePicInput');
    const photoDisplay = document.getElementById('photoDisplay');
    const photoImg = document.getElementById('cv-photo-img');

    if (photoInput && photoImg) {
        photoInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    photoImg.src = e.target.result;
                    photoDisplay.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                photoDisplay.style.display = 'none';
            }
        });
    }
}

// Template Selection Logic
function initializeTemplateSwitcher() {
    const templateSelect = document.getElementById('templateSelect');
    const resumePreview = document.getElementById('resumePreview');

    if (templateSelect && resumePreview) {
        templateSelect.addEventListener('change', (e) => {
            const selectedTemplate = e.target.value;
            // Keep the base class and add the selected template class
            resumePreview.className = `resume-paper ${selectedTemplate}`;
        });
    }
}

// Download PDF functionality
function setupDownloadButton() {
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Trigger browser's native print dialog
            // Our CSS @media print query ensures only the resume is exported
            window.print();
        });
    }
}

// Wait for DOM to load fully before initializing
document.addEventListener('DOMContentLoaded', () => {
    initializeLivePreview();
    setupPhotoUpload();
    initializeTemplateSwitcher();
    setupDownloadButton();
});
