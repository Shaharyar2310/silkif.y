let styleUseCount = 0;
const MAX_FREE_STYLES = 3;
let originalImage = "https://via.placeholder.com/600x400?text=Upload+Preview";
let loggedIn = false;

// Drag and Drop Functionality
const uploadArea = document.getElementById('uploadArea');

uploadArea.addEventListener('dragover', (event) => {
  event.preventDefault(); // Prevent default behavior
  uploadArea.style.borderColor = '#2196F3'; // Change border color on drag over
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.style.borderColor = 'var(--button-bg)'; // Reset border color when leaving
});

uploadArea.addEventListener('drop', (event) => {
  event.preventDefault(); // Prevent default behavior
  uploadArea.style.borderColor = 'var(--button-bg)'; // Reset border color

  const files = event.dataTransfer.files; // Get the dropped files
  if (files.length > 0) {
    handleFileUpload({ target: { files: files } }); // Call the existing file upload handler
  }
});

function applyStyle(button, styleName) {
  if (!loggedIn && styleUseCount >= MAX_FREE_STYLES) {
    alert("You’ve reached the free style limit. Please login to continue.");
    return;
  }

  document.querySelectorAll('.style-options button').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');

  const preview = document.getElementById('previewImage');
  preview.classList.add('fade-in');

  setTimeout(() => {
    preview.src = originalImage;
    preview.className = 'preview-img ' + styleName;
    preview.classList.remove('fade-in');
  }, 200);

  addToHistory(styleName);
  if (!loggedIn) styleUseCount++;
}

function addToHistory(styleName) {
  const historyList = document.getElementById('historyList');
  const item = document.createElement('li');

  const img = document.createElement('img');
  img.src = originalImage;

  const label = document.createElement('span');
  label.textContent = styleName;

  item.appendChild(img);
  item.appendChild(label);

  // Make history item clickable
  item.style.cursor = "pointer";
  item.addEventListener('click', () => {
    const preview = document.getElementById('previewImage');
    preview.src = originalImage;
    preview.className = 'preview-img ' + styleName;

    document.querySelectorAll('.style-options button').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.includes(styleName));
    });
  });

  historyList.appendChild(item);
}

function resetImage() {
  const preview = document.getElementById('previewImage');
  preview.src = originalImage;
  preview.className = 'preview-img';
  document.querySelectorAll('.style-options button').forEach(btn => btn.classList.remove('active'));
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const preview = document.getElementById('previewImage');
    preview.src = e.target.result;
    originalImage = e.target.result;
    styleUseCount = 0;
  };
  reader.readAsDataURL(file);
}

function toggleLogin() {
  loggedIn = !loggedIn;

  const loginButton = document.getElementById('loginButton');
  const guestInfo = document.querySelector('.guest');

  if (loggedIn) {
    loginButton.textContent = 'Logout';
    guestInfo.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; justify-content: center;">
        <div style="
          background-color: #ffffff;
          color: #6440ff;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;">U</div>
        <span style="font-size: 14px;">Logged in as: User</span>
      </div>
    `;
  } else {
    loginButton.textContent = 'Login';
    guestInfo.textContent = 'Logged in as: Guest';
    styleUseCount = 0;
  }
}

document.getElementById('themeToggle').addEventListener('change', () => {
  document.body.classList.toggle('dark');
});

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}

function downloadImage() {
  const preview = document.getElementById('previewImage');

  // Create a canvas to draw the styled image
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set canvas size to match image
  canvas.width = preview.naturalWidth;
  canvas.height = preview.naturalHeight;

  // Create a new image with applied styles via CSS class
  const tempImage = new Image();
  tempImage.crossOrigin = 'anonymous';
  tempImage.src = preview.src;

  tempImage.onload = function () {
    // Draw the original image on canvas
    ctx.drawImage(tempImage, 0, 0);

    // Apply the styles to the canvas
    const styleClass = preview.className.split(' ').find(cls => cls !== 'preview-img');
    if (styleClass) {
      ctx.filter = getComputedStyle(preview).filter; // Get the filter applied to the image
      ctx.drawImage(tempImage, 0, 0); // Redraw the image with the filter
    }

    // Convert to data URL and trigger download
    const link = document.createElement('a');
    link.download = 'styled-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
}
