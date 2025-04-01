const writers = {
    "রাজা রামমোহন রায়": [
        "বেদান্তগ্রন্থ", "বেদান্তসার", "পথ্যপ্রদান", "ভট্টাচার্যের সহিত বিচার", "গোস্বামীর সহিত বিচার", "প্রবর্তক ও নিবর্তকের সম্বাদ"
    ],
    "প্যারীচাঁদ মিত্র": [
        "আধ্যাত্মিকা", "মদ খাওয়া বড় দায় - জাত কি থাকার উপায়", "রামারঙ্গিকা", "বামাতশিনি"
    ],
    "ঈশ্বরচন্দ্র বিদ্যাসাগর": [
        "প্রভাবতী সম্ভাষণ", "বিদ্যাসাগর চরিত বা আত্নচরিত", "বিধবাবিবাহ প্রচলিত হওয়া উচিত কিনা এতদ্বিষয়ক প্রস্তাব",
        "বহুবিবাহ রহিত হওয়া উচিত কিনা এতদ্বিষয়ক প্রস্তাব", "আবার অতি অল্প হাইল", "ব্রজবিলাস", "বেতালপঞ্চবিংশতি",
        "ভ্রান্তিবিলাস", "সীতার বনবাস", "শকুন্তলা", "বর্ণপরিচয়", "শব্দমঞ্জুরি", "অ্যাখ্যানমঞ্জুরি", "বোধোদয়"
    ],
    "মাইকেল মধুসূদন দত্ত": [
        "মেঘনাবদ কাব্য", "হেক্টরবধ", "The captive ladie", "Visions of the past", "তিলত্তমাসম্ভব কাব্য",
        "বঙ্গভাষা", "কপতক্ষ নদ", "আশা", "বঙ্গদেশে এক মান্য বন্ধুর উপলক্ষে", "বীরাঙ্গনা", "ব্রজংগনা",
        "বঙ্গভূমির প্রতি", "রসাল ও স্বর্ণলতিকা", "শমিস্থা", "পদ্মবতি", "কৃষ্ণকুমারী", "একেই কি বলে সভ্যতা",
        "বুড়ো শালিকের ঘাড়ে রো"
    ],
    "দীনবন্ধু মিত্র": [
        "নীলদর্পণ", "নবীনতপিন্নি", "লীলাবতী", "কমলে কামিনি", "সধবার একাদশী", "বিয়ে পাগলা বুড়ো", "জামাই বারিক"
    ]
};

let score = 0;
let writerIndex = 0;
const writerNames = Object.keys(writers);
let usedBooks = new Set();

function getNextWriter() {
    selectedWriter = writerNames[writerIndex];
    document.querySelector(".title").textContent = selectedWriter;
    writerIndex = (writerIndex + 1) % writerNames.length; // Loop back after last writer
    usedBooks.clear(); // Reset used books for new writer
    generateGrid();
}

function generateGrid() {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    let allBooks = Object.values(writers).flat();
    let correctBooks = writers[selectedWriter].filter(book => !usedBooks.has(book));
    
    if (correctBooks.length === 0) {
        getNextWriter();
        return;
    }

    let correctCount = Math.min(correctBooks.length, 4);
    let selectedCorrectBooks = shuffleArray(correctBooks).slice(0, correctCount);
    
    selectedCorrectBooks.forEach(book => usedBooks.add(book));

    let wrongBooks = shuffleArray(allBooks.filter(book => !selectedCorrectBooks.includes(book) && !writers[selectedWriter].includes(book)))
                      .slice(0, 16 - correctCount);
    let finalBooks = shuffleArray([...selectedCorrectBooks, ...wrongBooks]);

    finalBooks.forEach(book => {
        const button = document.createElement("button");
        button.textContent = book;
        button.classList.add("option");
        button.addEventListener("click", () => handleSelection(button, book, selectedCorrectBooks));
        grid.appendChild(button);
    });

    if (usedBooks.size >= writers[selectedWriter].length) {
        getNextWriter();
    }
}

function handleSelection(button, book, correctBooks) {
    if (correctBooks.includes(book)) {
        button.style.backgroundColor = "green";
        score += 10;
    } else {
        button.style.backgroundColor = "red";
        score -= 5;
    }

    button.disabled = true;

    setTimeout(() => {
        button.style.backgroundColor = "#f0f0f0";
        button.textContent = getNewBookOption(correctBooks);
        button.disabled = false;
    }, 1000);
}

function getNewBookOption(correctBooks) {
    let allBooks = Object.values(writers).flat();
    let randomBook;
    do {
        randomBook = allBooks[Math.floor(Math.random() * allBooks.length)];
    } while (correctBooks.includes(randomBook)); 
    return randomBook;
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

document.querySelector(".shuffle").addEventListener("click", generateGrid);
document.querySelector(".deselect").addEventListener("click", () => {
    document.querySelectorAll(".grid button").forEach(btn => {
        btn.style.backgroundColor = "#f0f0f0";
        btn.disabled = false;
    });
});

document.querySelector(".submit").addEventListener("click", () => {
    alert(`Your Final Score: ${score}`);
    score = 0;
});

getNextWriter();
