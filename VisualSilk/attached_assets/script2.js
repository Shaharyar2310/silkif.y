// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark', darkModeToggle.checked);
});

// Mobile Menu Toggle
document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});

const historyList = document.getElementById('historyList');

function addToHistory(prompt, imageUrl) {
  let history = JSON.parse(localStorage.getItem('silkifyHistory')) || [];
  history.unshift({ prompt, imageUrl });
  if (history.length > 20) history.pop();
  localStorage.setItem('silkifyHistory', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  let history = JSON.parse(localStorage.getItem('silkifyHistory')) || [];
  historyList.innerHTML = '';
  history.forEach(({ prompt, imageUrl }) => {
    const li = document.createElement('li');
    li.title = prompt;
    li.innerHTML = `<img src="${imageUrl}" alt="history" /><span>${prompt}</span>`;
    li.onclick = () => {
      const generatedImage = document.getElementById('generatedImage');
      const imageOutputArea = document.getElementById('imageOutputArea');
      const viewBtn = document.getElementById('viewBtn');
      generatedImage.src = imageUrl;
      generatedImage.style.display = 'block';
      imageOutputArea.style.display = 'block';
      // Show view button and open image in new tab on click
      viewBtn.style.display = 'inline-block';
      viewBtn.onclick = () => {
        window.open(imageUrl, '_blank', 'noopener');
      };
    };
    historyList.appendChild(li);
  });
}

renderHistory();

async function generateImage() {
  const prompt = document.getElementById('promptInput').value.trim();
  if (!prompt) {
    alert('Please enter a prompt!');
    return;
  }

  const imageOutputArea = document.getElementById('imageOutputArea');
  const generatedImage = document.getElementById('generatedImage');
  const viewBtn = document.getElementById('viewBtn');

  generatedImage.style.display = 'none';
  viewBtn.style.display = 'none';
  imageOutputArea.style.display = 'block';
  imageOutputArea.querySelector('h3').textContent = 'Generating image...';

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' // Replace with your actual API key
      },
      body: JSON.stringify({
        prompt: prompt,
        n: 1,
        size: "512x512"
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message || 'Failed to generate image');
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;

    generatedImage.src = imageUrl;
    generatedImage.style.display = 'block';
    imageOutputArea.querySelector('h3').textContent = 'Generated Image:';

    // Show view button and set it to open image in new tab
    viewBtn.style.display = 'inline-block';
    viewBtn.onclick = () => {
      window.open(imageUrl, '_blank', 'noopener');
    };

    addToHistory(prompt, imageUrl);
  } catch (error) {
    alert('Error generating image: ' + error.message);
    console.error(error);
  }
}

