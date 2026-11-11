// DOM element references
const breedSelect = document.getElementById('breed-select');
const fetchBtn = document.getElementById('fetch-btn');
const dogImg = document.getElementById('dog-img');
const statusMessage = document.getElementById('status-message');

/**
 * Fetches the list of all dog breeds and populates the dropdown.
 */
async function loadBreeds() {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/list/all');
    if (!response.ok) {
      throw new Error('Network error fetching breeds list');
    }

    const data = await response.json();
    const breeds = Object.keys(data.message);

    breeds.forEach((breed) => {
      const option = document.createElement('option');
      option.value = breed;
      // Capitalize first letter for display
      option.textContent = breed.charAt(0).toUpperCase() + breed.slice(1);
      breedSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Could not load breeds:', error);
  }
}

/**
 * Fetches a random dog image (optionally filtered by breed) and updates the UI.
 */
async function fetchDogImage() {
  const breed = breedSelect.value;
  const url = breed
    ? `https://dog.ceo/api/breed/${breed}/images/random`
    : 'https://dog.ceo/api/breeds/image/random';

  // Set loading state and disable the button
  statusMessage.textContent = 'Loading...';
  statusMessage.classList.remove('error');
  statusMessage.style.display = 'block';
  dogImg.style.display = 'none';
  fetchBtn.disabled = true;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network error fetching dog image');
    }

    const data = await response.json();
    if (data.status !== 'success') {
      throw new Error(data.message || 'API returned an error');
    }

    // Wait for the browser to download the image before displaying
    await new Promise((resolve, reject) => {
      dogImg.onload = resolve;
      dogImg.onerror = reject;
      dogImg.src = data.message;
    });

    // Display image and hide loading indicator
    statusMessage.textContent = '';
    statusMessage.style.display = 'none';
    dogImg.style.display = 'block';
  } catch (error) {
    // Show short error message and hide broken image
    statusMessage.textContent = 'Failed to load dog image. Please try again.';
    statusMessage.classList.add('error');
    statusMessage.style.display = 'block';
    dogImg.style.display = 'none';
  } finally {
    // Re-enable button after request finishes
    fetchBtn.disabled = false;
  }
}

// Event listeners
fetchBtn.addEventListener('click', fetchDogImage);
breedSelect.addEventListener('change', fetchDogImage);

// Initial load
loadBreeds();
fetchDogImage();
