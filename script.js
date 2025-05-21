    // Load TensorFlow.js Model (COCO-SSD)
    let cocoSsdModel;

    cocoSsd.load()
    .then((loadedModel) => {
        cocoSsdModel = loadedModel;
        console.log("COCO-SSD Loaded Successfully.");
        document.getElementById("loading").style.display = "none";
    })
    .catch((err) => {
        console.error("Error loading COCO-SSD:", err);
        document.getElementById("detectedObjects").innerHTML = "<li>Model loading failed</li>";
        document.getElementById("loading").style.display = "none";
    });

    // DOM Elements
    const imageUpload = document.getElementById("imageUpload");
    const uploadedImage = document.getElementById("uploadedImage");
    const detectedObjectsList = document.getElementById("detectedObjects");
    const speakBtn = document.getElementById("speakBtn");
    const loadingDiv = document.getElementById("loading");

    // Handle Image Upload
    imageUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        loadingDiv.style.display = "block";
        const reader = new FileReader();
        reader.onload = function (event) {
        uploadedImage.src = event.target.result;
        uploadedImage.style.display = "block";
        uploadedImage.onload = detectObjects;
        };
        reader.readAsDataURL(file);
        uploadedImage.onerror = () => {
        console.error("Failed to load image.");
        detectedObjectsList.innerHTML = "<li>Failed to load image</li>";
        loadingDiv.style.display = "none";
        };
    }
    });

    // Object Detection Function
    async function detectObjects() {
    if (!cocoSsdModel) {
        detectedObjectsList.innerHTML = "<li>Model not loaded</li>";
        loadingDiv.style.display = "none";
        return;
    }
    if (!uploadedImage.complete || uploadedImage.naturalWidth === 0) {
        detectedObjectsList.innerHTML = "<li>Image not loaded properly</li>";
        loadingDiv.style.display = "none";
        return;
    }

    const predictions = await cocoSsdModel.detect(uploadedImage);
    const detectedObjects = [];

    for (const prediction of predictions) {
        if (prediction.score > 0.7) {
        let label = prediction.class;
        let confidence = (prediction.score * 100).toFixed(2);

        if (label === "person") {
            const gender = await classifyGender(uploadedImage, prediction.bbox);
            label = gender ? `${gender} person` : "person";
        }

        detectedObjects.push({ label, confidence });
        }
    }

    detectedObjectsList.innerHTML = detectedObjects
        .map((obj) => `<li>${obj.label} (${obj.confidence}%)</li>`)
        .join("");

    if (detectedObjects.length > 0) {
        const firstLabel = detectedObjects[0].label;
        getKannadaTranslation(firstLabel);
    } else {
        detectedObjectsList.innerHTML = "<li>No objects detected</li>";
        speakBtn.disabled = true;
        loadingDiv.style.display = "none";
    }
    }

    // Placeholder for Gender Classification
    async function classifyGender(image, bbox) {
    return "male"; // Placeholder; replace with actual gender classification if needed
    }

    // Fetch Kannada Translation & Generate Kanglish
    function getKannadaTranslation(text) {
    const localTranslations = {
        dog: "ನಾಯಿ", cat: "ಬೆಕ್ಕು", horse: "ಕುದುರೆ", cow: "ಹಸು", sheep: "ಕುರಿ",
        goat: "ಮೇಕೆ", pig: "ಹಂದಿ", elephant: "ಆನೆ", tiger: "ಹುಲಿ", lion: "ಸಿಂಹ",
        bear: "ಕರಡಿ", monkey: "ಕೋತಿ", snake: "ಹಾವು", fish: "ಮೀನು", bird: "ಪಕ್ಷಿ",
        chicken: "ಕೋಳಿ", duck: "ಬಾತುಕೋಳಿ", rabbit: "ಮೊಲ", car: "ಕಾರು", bus: "ಬಸ್",
        bicycle: "ಸೈಕಲ್", motorbike: "ಮೋಟಾರ್ ಬೈಕ್", train: "ರೈಲು", airplane: "ವಿಮಾನ",
        boat: "ದೋಣಿ", truck: "ಟ್ರಕ್", chair: "ಕುರ್ಚಿ", table: "ಮೇಜು", "dining table": "ಊಟದ ಮೇಜು",
        sofa: "ಸೋಫಾ", bed: "ಹಾಸಿಗೆ", desk: "ಮೇಜು", wardrobe: "ಬೀರು", bottle: "ಸೀಸೆ",
        cup: "ಕಪ್", plate: "ತಟ್ಟೆ", spoon: "ಚಮಚ", fork: "ಫೋರ್ಕ್", knife: "ಚಾಕು",
        bowl: "ಬಟ್ಟಲು", clock: "ಗಡಿಯಾರ", lamp: "ದೀಪ", television: "ಟೆಲಿವಿಷನ್",
        "tv monitor": "ಟಿವಿ ಮಾನಿಟರ್", computer: "ಕಂಪ್ಯೂಟರ್", phone: "ಫೋನ್",
        refrigerator: "ಫ್ರಿಜ್", microwave: "ಮೈಕ್ರೋವೇವ್", oven: "ಓವನ್", tree: "ಮರ",
        flower: "ಹೂವು", grass: "ಹುಲ್ಲು", mountain: "ಪರ್ವತ", river: "ನದಿ", ocean: "ಸಮುದ್ರ",
        lake: "ಸರೋವರ", forest: "ಅರಣ್ಯ", sky: "ಆಕಾಶ", sun: "ಸೂರ್ಯ", moon: "ಚಂದ್ರ",
        star: "ನಕ್ಷತ್ರ", cloud: "ಮೋಡ", apple: "ಸೇಬು", banana: "ಬಾಳೆಹಣ್ಣು", orange: "ಕಿತ್ತಳೆ",
        mango: "ಮಾವಿನ ಹಣ್ಣು", grape: "ದ್ರಾಕ್ಷಿ", carrot: "ಕ್ಯಾರೆಟ್", potato: "ಆಲೂಗಡ್ಡೆ",
        tomato: "ಟೊಮೇಟೊ", onion: "ಈರುಳ್ಳಿ", bread: "ಬ್ರೆಡ್", rice: "ಅಕ್ಕಿ", milk: "ಹಾಲು",
        water: "ನೀರು", juice: "ರಸ", coffee: "ಕಾಫಿ", tea: "ಚಹಾ", book: "ಪುಸ್ತಕ", pen: "ಪೆನ್ನು",
        pencil: "ಪೆನ್ಸಿಲ್", notebook: "ನೋಟ್ಬುಕ್", paper: "ಕಾಗದ", eraser: "ಅಳಿಸುವ ಗಮ್",
        ruler: "ಸ್ಕೇಲು", scissors: "ಕತ್ತರಿ", person: "ವ್ಯಕ್ತಿ", maleperson: "ಪುರುಷ", female: "ಮಹಿಳೆ",
        child: "ಮಗು", baby: "ಶಿಶು", teacher: "ಶಿಕ್ಷಕ", student: "ವಿದ್ಯಾರ್ಥಿ", doctor: "ವೈದ್ಯ",
        farmer: "ರೈತ", house: "ಮನೆ", school: "ಶಾಲೆ", hospital: "ಆಸ್ಪತ್ರೆ", shop: "ಅಂಗಡಿ",
        park: "ಉದ್ಯಾನ", road: "ರಸ್ತೆ", bridge: "ಸೇತುವೆ", "potted plant": "ಗಿಡದ ಕುಂಡ",
        umbrella: "ಛತ್ರಿ", bag: "ಚೀಲ"
    };

    const apiUrl = "https://libretranslate.de/translate";
    const requestBody = {
        q: text,
        source: "en",
        target: "kn",
        format: "text"
    };

    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    })
        .then((response) => response.json())
        .then((data) => {
        let kannadaWord = "---";
        if (data.translatedText && data.translatedText !== text) {
            kannadaWord = data.translatedText;
        } else {
            kannadaWord = localTranslations[text.toLowerCase()] || "ಅನುವಾದ ಇಲ್ಲ";
        }

        const kannadaTranslation = kannadaWord;
        const kanglishTranslation = kannadaWord === "ಅನುವಾದ ಇಲ್ಲ" ? "No translation" : convertToKanglish(kannadaWord);
        detectedObjectsList.innerHTML += `<li class="kannada-translation">🌍 Kannada: ${kannadaTranslation}</li>
            <li>🔤 Kanglish: ${kanglishTranslation}</li>`;
        speakBtn.setAttribute("data-kannada", kannadaTranslation);
        speakBtn.setAttribute("data-kanglish", kanglishTranslation);
        speakBtn.disabled = (kannadaTranslation === "ಅನುವಾದ ಇಲ್ಲ" || kannadaTranslation === "---");
        loadingDiv.style.display = "none";
        })
        .catch((error) => {
        console.error("Translation error:", error);
        const fallbackKannada = localTranslations[text.toLowerCase()] || "ಅನುವಾದ ಇಲ್ಲ";
        const kanglishTranslation = fallbackKannada === "ಅನುವಾದ ಇಲ್ಲ" ? "No translation" : convertToKanglish(fallbackKannada);
        detectedObjectsList.innerHTML += `<li class="kannada-translation">🌍 Kannada: ${fallbackKannada}</li>
            <li>🔤 Kanglish: ${kanglishTranslation}</li>`;
        speakBtn.setAttribute("data-kannada", fallbackKannada);
        speakBtn.setAttribute("data-kanglish", kanglishTranslation);
        speakBtn.disabled = (fallbackKannada === "ಅನುವಾದ ಇಲ್ಲ");
        loadingDiv.style.display = "none";
        });
    }

    // Advanced Kanglish Conversion Function
    function convertToKanglish(kannadaText) {
    const vowels = "ಅಆಇಈಉಊಋಎಏಐಒಓಔ";
    const map = {
        'ಅ': 'a', 'ಆ': 'aa', 'ಇ': 'i', 'ಈ': 'ii', 'ಉ': 'u', 'ಊ': 'uu', 'ಋ': 'ru',
        'ಎ': 'e', 'ಏ': 'ee', 'ಐ': 'ai', 'ಒ': 'o', 'ಓ': 'oo', 'ಔ': 'au',
        'ಕ': 'ka', 'ಖ': 'kha', 'ಗ': 'ga', 'ಘ': 'gha', 'ಙ': 'nga',
        'ಚ': 'cha', 'ಛ': 'chha', 'ಜ': 'ja', 'ಝ': 'jha', 'ಞ': 'nya',
        'ಟ': 'ta', 'ಠ': 'tha', 'ಡ': 'da', 'ಢ': 'dha', 'ಣ': 'na',
        'ತ': 'ta', 'ಥ': 'tha', 'ದ': 'da', 'ಧ': 'dha', 'ನ': 'na',
        'ಪ': 'pa', 'ಫ': 'pha', 'ಬ': 'ba', 'ಭ': 'bha', 'ಮ': 'ma',
        'ಯ': 'ya', 'ರ': 'ra', 'ಲ': 'la', 'ವ': 'va',
        'ಶ': 'sha', 'ಷ': 'sha', 'ಸ': 'sa', 'ಹ': 'ha', 'ಳ': 'la',
        'ಕ್ಷ': 'ksha', 'ಜ್ಞ': 'jna'
    };
    const diacritics = {
        'ಾ': 'aa', 'ಿ': 'i', 'ೀ': 'ii', 'ು': 'u', 'ೂ': 'uu', 'ೃ': 'ru',
        'ೆ': 'e', 'ೇ': 'ee', 'ೈ': 'ai', 'ೊ': 'o', 'ೋ': 'oo', 'ೌ': 'au'
    };
    const virama = '್';

    let result = '';
    let i = 0;
    while (i < kannadaText.length) {
        let char = kannadaText[i];
        if (vowels.includes(char)) {
        result += map[char] || char;
        i++;
        continue;
        }
        if (map[char]) {
        let transliteration = map[char];
        if (i + 1 < kannadaText.length && kannadaText[i + 1] === virama) {
            result += transliteration.slice(0, -1);
            i += 2;
        } else if (i + 1 < kannadaText.length && diacritics[kannadaText[i + 1]]) {
            result += transliteration.slice(0, -1) + diacritics[kannadaText[i + 1]];
            i += 2;
        } else {
            result += transliteration;
            i++;
        }
        continue;
        }
        if (diacritics[char]) {
        result += diacritics[char];
        i++;
        continue;
        }
        result += char;
        i++;
    }
    return result;
    }

    // Load Speech Synthesis Voices
    function loadVoices() {
    return new Promise((resolve) => {
        let voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
        resolve(voices);
        } else {
        window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            console.log("Available voices:", voices);
            resolve(voices);
        };
        }
    });
    }

    // Pronounce Kannada or Kanglish Text
    speakBtn.addEventListener("click", async () => {
    const kannadaText = speakBtn.getAttribute("data-kannada");
    const kanglishText = speakBtn.getAttribute("data-kanglish");

    if (!kannadaText || kannadaText === "ಅನುವಾದ ಇಲ್ಲ" || kannadaText === "---") {
        alert("No valid Kannada translation to pronounce.");
        return;
    }

    const voices = await loadVoices();
    const kannadaVoice = voices.find((voice) => voice.lang === "kn-IN");

    if (kannadaVoice) {
        const utterance = new SpeechSynthesisUtterance(kannadaText);
        utterance.lang = "kn-IN";
        utterance.voice = kannadaVoice;
        utterance.rate = 0.9;
        utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event.error);
        alert("Failed to pronounce in Kannada. Check browser settings.");
        };
        window.speechSynthesis.speak(utterance);
    } else {
        const englishVoice = voices.find((voice) => voice.lang === "en-US");
        if (englishVoice && kanglishText !== "No translation") {
        const utterance = new SpeechSynthesisUtterance(kanglishText);
        utterance.lang = "en-US";
        utterance.voice = englishVoice;
        utterance.rate = 0.9;
        utterance.onerror = (event) => {
            console.error("Speech synthesis error:", event.error);
            alert("Failed to pronounce Kanglish. Check browser settings.");
        };
        window.speechSynthesis.speak(utterance);
        } else {
        alert("No suitable voice found for pronunciation. Please install Kannada language support in your browser or OS.");
        }
    }
    });

    // Preload voices
    window.speechSynthesis.getVoices();