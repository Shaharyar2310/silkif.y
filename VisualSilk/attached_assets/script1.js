let originalImage = "https://via.placeholder.com/600x400?text=Original";
let loggedIn = false;

const uploadArea = document.getElementById("uploadArea");
const beforeImage = document.getElementById("beforeImage");
const afterImage = document.getElementById("afterImage");
const compareSlider = document.getElementById("compareSlider");

uploadArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  uploadArea.style.borderColor = "#2196F3";
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.style.borderColor = "var(--button-bg)";
});

uploadArea.addEventListener("drop", (event) => {
  event.preventDefault();
  uploadArea.style.borderColor = "var(--button-bg)";

  const files = event.dataTransfer.files;
  if (files.length > 0) {
    handleFileUpload({ target: { files: files } });
  }
});

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    originalImage = e.target.result;
    beforeImage.src = originalImage;
    afterImage.src = originalImage;
    resetControls();
  };
  reader.readAsDataURL(file);
}

function resetControls() {
  document.getElementById("brightness").value = 0;
  document.getElementById("contrast").value = 0;
  document.getElementById("sharpness").value = 0;
  document.getElementById("autoEnhance").checked = false;
  document.getElementById("denoise").checked = false;
  document.getElementById("upscale").checked = false;
  document.getElementById("bgRemove").checked = false;
  document.getElementById("faceRetouch").checked = false;
  updateImage();
}

function updateImage() {
  const brightness = parseInt(document.getElementById("brightness").value);
  const contrast = parseInt(document.getElementById("contrast").value);
  const sharpness = parseInt(document.getElementById("sharpness").value);

  const autoEnhance = document.getElementById("autoEnhance").checked;
  const denoise = document.getElementById("denoise").checked;
  const upscale = document.getElementById("upscale").checked; // No effect visually here, placeholder for actual AI upscale
  const bgRemove = document.getElementById("bgRemove").checked;
  const faceRetouch = document.getElementById("faceRetouch").checked;

  let filterStr = `brightness(${brightness + 100}%) contrast(${contrast + 100}%)`;

  if (sharpness > 0) {
    const sharpVal = sharpness / 50;
    filterStr += ` saturate(${1 + sharpVal}) contrast(${1 + sharpVal})`;
  }

  if (autoEnhance) {
    filterStr += " saturate(1.2) brightness(1.1) contrast(1.1)";
  }
  if (denoise) {
    filterStr += " blur(0.3px)";
  }
  if (bgRemove) {
    filterStr += " grayscale(0.3)";
  }
  if (faceRetouch) {
    filterStr += " brightness(1.05) contrast(1.1) saturate(1.2)";
  }

  afterImage.style.filter = filterStr;
}

// Comparison slider handling
compareSlider.addEventListener("input", () => {
  const val = compareSlider.value;
  afterImage.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
});

// Initialize slider position
compareSlider.value = 50;
afterImage.style.clipPath = `inset(0 50% 0 0)`;

function downloadImage() {
  // Create canvas and draw enhanced image with filters applied
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = originalImage;

  img.onload = function () {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Apply filters from afterImage style in canvas context
    let filterList = [];

    // Extract brightness, contrast, saturate, blur, grayscale from CSS filter string
    let cssFilter = afterImage.style.filter;
    const regex = /(\w+)\(([^)]+)\)/g;
    let match;
    while ((match = regex.exec(cssFilter)) !== null) {
      let name = match[1];
      let value = match[2];
      if (name === "brightness") {
        filterList.push(`brightness(${value})`);
      } else if (name === "contrast") {
        filterList.push(`contrast(${value})`);
      } else if (name === "saturate") {
        filterList.push(`saturate(${value})`);
      } else if (name === "blur") {
        filterList.push(`blur(${value})`);
      } else if (name === "grayscale") {
        filterList.push(`grayscale(${value})`);
      }
    }

    ctx.filter = filterList.join(" ") || "none";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(function(blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'enhanced-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  img.onerror = function () {
    alert("Failed to load image for download.");
  }
}

function toggleLogin() {
  loggedIn = !loggedIn;

  const loginButton = document.getElementById("loginButton");
  const guestInfo = document.querySelector(".guest");

  if (loggedIn) {
    loginButton.textContent = "Logout";
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
    loginButton.textContent = "Login";
    guestInfo.textContent = "Logged in as: Guest";
  }
}

document.getElementById("themeToggle").addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("open");
}
