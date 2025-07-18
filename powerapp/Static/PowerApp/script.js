let slides = [];
let currentSlideIndex = 0;
let slideCounter = 0;

function createSlide() {
    slideCounter += 1;
    const slideId = 'slide' + slideCounter;
    const slide = {
        id: slideId,
        content: {
            text: 'Nuova diapositiva',
            images: []
        }
    };
    slides.push(slide);
    renderSlides();
    goToSlide(slides.length - 1);
}

function renderSlides() {
    const container = document.getElementById('slide-container');
    container.innerHTML = '';
    slides.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'slide' + (index === currentSlideIndex ? ' active' : '');
        slideDiv.id = slide.id;

        // Testo
        const p = document.createElement('p');
        p.contentEditable = true;
        p.innerText = slide.content.text;
        p.oninput = () => {
            slide.content.text = p.innerText;
        };
        slideDiv.appendChild(p);

        // Immagini
        slide.content.images.forEach(imgSrc => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.style.maxWidth = '100px';
            img.style.margin = '5px';
            slideDiv.appendChild(img);
        });

        // Click per selezionare
        slideDiv.onclick = () => {
            goToSlide(index);
        };

        container.appendChild(slideDiv);
    });
}

function goToSlide(index) {
    currentSlideIndex = index;
    renderSlides();
}

function nextSlide() {
    if (currentSlideIndex < slides.length - 1) {
        currentSlideIndex++;
        renderSlides();
    }
}

function prevSlide() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        renderSlides();
    }
}

function addSlide() {
    createSlide();
}

function deleteSlide() {
    if (slides.length > 0) {
        slides.splice(currentSlideIndex, 1);
        if (currentSlideIndex >= slides.length) {
            currentSlideIndex = slides.length - 1;
        }
        renderSlides();
    }
}

function insertText() {
    document.getElementById('text-input').value = '';
    document.getElementById('text-modal').style.display = 'block';
}

function applyText() {
    const text = document.getElementById('text-input').value;
    if (slides.length > 0) {
        slides[currentSlideIndex].content.text = text;
        renderSlides();
    }
    closeModal();
}

function openImageUploader() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            if (slides.length > 0) {
                slides[currentSlideIndex].content.images.push(event.target.result);
                renderSlides();
            }
        };
        reader.readAsDataURL(file);
    };
    input.click();
}

function exportSlides() {
    if (slides.length === 0) {
        alert('Nessuna diapositiva da esportare.');
        return;
    }
    // Usa html2canvas per catturare
    importHtml2CanvasAndDownload();
}

function importHtml2CanvasAndDownload() {
    // Per semplicità, usiamo html2canvas via CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    script.onload = () => {
        const slide = document.querySelector('.slide.active');
        html2canvas(slide).then(canvas => {
            const dataUrl = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = 'slide.png';
            a.click();
        });
    };
    document.head.appendChild(script);
}

function savePresentation() {
    fetch('/save/', {
        method: 'POST',
        body: JSON.stringify({ id: 'default', slides: slides }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(data => {
        alert('Presentazione salvata!');
    });
}

function loadPresentation() {
    document.getElementById('load-modal').style.display = 'block';
}

function confirmLoad() {
    const id = document.getElementById('load-id').value;
    fetch('/load/?id=' + encodeURIComponent(id))
        .then(res => res.json())
        .then(data => {
            if (data.slides) {
                slides = data.slides;
                currentSlideIndex = 0;
                renderSlides();
            } else {
                alert('Nessuna presentazione trovata con quell\'ID.');
            }
        });
    closeLoadModal();
}

function closeModal() {
    document.getElementById('text-modal').style.display = 'none';
}

function closeLoadModal() {
    document.getElementById('load-modal').style.display = 'none';
}

// Inizializza
createSlide();
