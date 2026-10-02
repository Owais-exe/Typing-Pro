/* =========================================================
   TYPENOVA
   MAIN GAME ENGINE
========================================================= */


/* ================= TEXT DATABASE ================= */

const paragraphs = [

    "Technology is changing the way we learn work communicate and create. The most valuable skill is not knowing everything but being able to learn something new quickly. Every small improvement becomes useful when you practice consistently.",

    "Success is usually built from many small actions repeated every day. You do not need to become perfect immediately. Focus on improving one skill at a time and allow your progress to become visible through patience practice and consistency.",

    "The internet has transformed the world into a connected place where information can be shared within seconds. Learning how to use technology responsibly can help students create websites programs businesses games and many other useful things.",

    "Programming teaches you how to break a difficult problem into smaller pieces. When a program does not work the mistake is not the end of the journey. Debugging teaches patience logical thinking and the ability to keep searching for a better solution."

];


const sentences = [

    "Learning becomes easier when you practice every day.",
    "Small improvements can create huge results over time.",
    "Programming is a powerful way to solve problems.",
    "Typing faster helps you communicate more efficiently.",
    "Consistency is more important than short bursts of motivation.",
    "Technology gives students many opportunities to create.",
    "Practice turns difficult skills into familiar skills.",
    "Every mistake can teach you something useful.",
    "Good habits are built one decision at a time.",
    "Focus on progress instead of trying to be perfect."

];


const words = [

    "technology",
    "computer",
    "programming",
    "javascript",
    "website",
    "keyboard",
    "internet",
    "learning",
    "practice",
    "student",
    "future",
    "success",
    "creative",
    "development",
    "software",
    "gaming",
    "science",
    "mathematics",
    "knowledge",
    "education",
    "communication",
    "discipline",
    "consistency",
    "challenge",
    "improvement",
    "performance",
    "developer",
    "algorithm",
    "project",
    "experience"

];


/* ================= DOM ELEMENTS ================= */

const typingText = document.getElementById("typingText");
const typingInput = document.getElementById("typingInput");

const timeDisplay = document.getElementById("timeDisplay");
const wpmDisplay = document.getElementById("wpmDisplay");
const accuracyDisplay = document.getElementById("accuracyDisplay");
const errorsDisplay = document.getElementById("errorsDisplay");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const liveStatus = document.getElementById("liveStatus");

const bestWpmElement = document.getElementById("bestWpm");

const restartButton = document.getElementById("restartButton");

const themeButton = document.getElementById("themeButton");
const settingsButton = document.getElementById("settingsButton");

const themeMenu = document.getElementById("themeMenu");
const settingsMenu = document.getElementById("settingsMenu");

const themeOptions =
    document.querySelectorAll(".theme-option");

const timeButtons =
    document.querySelectorAll(".time-btn");

const modeButtons =
    document.querySelectorAll(".mode-btn");

const soundToggle =
    document.getElementById("soundToggle");

const errorToggle =
    document.getElementById("errorToggle");

const autoFocusToggle =
    document.getElementById("autoFocusToggle");


/* ================= RESULT MODAL ================= */

const resultModal =
    document.getElementById("resultModal");

const closeResult =
    document.getElementById("closeResult");

const modalRestart =
    document.getElementById("modalRestart");

const resultWpm =
    document.getElementById("resultWpm");

const resultAccuracy =
    document.getElementById("resultAccuracy");

const resultErrors =
    document.getElementById("resultErrors");

const resultCharacters =
    document.getElementById("resultCharacters");


/* ================= CUSTOM TIMER ================= */

const customTimeButton =
    document.getElementById("customTimeButton");

const customModal =
    document.getElementById("customModal");

const closeCustom =
    document.getElementById("closeCustom");

const customTimeInput =
    document.getElementById("customTimeInput");

const applyCustom =
    document.getElementById("applyCustom");


/* ================= GAME STATE ================= */

let selectedTime = 15;

let remainingTime = 15;

let selectedMode = "paragraph";

let currentText = "";

let currentIndex = 0;

let correctCharacters = 0;

let totalTyped = 0;

let errors = 0;

let timer = null;

let gameStarted = false;

let gameFinished = false;

let elapsedSeconds = 0;

let bestWpm =
    Number(localStorage.getItem("typenovaBestWpm")) || 0;

let currentTheme =
    localStorage.getItem("typenovaTheme") || "nova";


/* ================= SETTINGS ================= */

let soundEnabled =
    localStorage.getItem("typenovaSound") === "true";

let showErrors =
    localStorage.getItem("typenovaErrors") !== "false";

let autoFocus =
    localStorage.getItem("typenovaAutoFocus") !== "false";


soundToggle.checked = soundEnabled;

errorToggle.checked = showErrors;

autoFocusToggle.checked = autoFocus;


/* ================= INITIAL SETUP ================= */

document.body.dataset.theme = currentTheme;

bestWpmElement.textContent =
    bestWpm;

updateThemeButtons();

generateText();

updateStats();

focusInput();


/* =========================================================
   TEXT GENERATION
========================================================= */

function generateText() {

    if (selectedMode === "paragraph") {

        currentText =
            randomItem(paragraphs);

    }

    else if (selectedMode === "sentences") {

        currentText =
            generateSentences(5);

    }

    else if (selectedMode === "words") {

        currentText =
            generateWords(45);

    }


    currentIndex = 0;

    renderText();

    updateProgress();
}


/* ================= RANDOM ITEM ================= */

function randomItem(array) {

    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];

}


/* ================= GENERATE SENTENCES ================= */

function generateSentences(count) {

    let result = [];

    let used = new Set();

    while (result.length < count) {

        const sentence =
            randomItem(sentences);

        if (!used.has(sentence)) {

            used.add(sentence);

            result.push(sentence);

        }

    }

    return result.join(" ");

}


/* ================= GENERATE WORDS ================= */

function generateWords(count) {

    let result = [];

    for (let i = 0; i < count; i++) {

        result.push(
            randomItem(words)
        );

    }

    return result.join(" ");

}


/* =========================================================
   RENDER TEXT
========================================================= */

function renderText() {

    typingText.innerHTML = "";

    for (
        let i = 0;
        i < currentText.length;
        i++
    ) {

        const span =
            document.createElement("span");

        span.textContent =
            currentText[i];

        span.dataset.index = i;

        if (i === 0) {

            span.classList.add("current");

        }

        typingText.appendChild(span);

    }

}


/* =========================================================
   INPUT HANDLING
========================================================= */

typingInput.addEventListener(
    "input",
    handleInput
);


function handleInput(event) {

    if (gameFinished) {

        return;

    }


    const value =
        typingInput.value;


    if (!gameStarted && value.length > 0) {

        startGame();

    }


    /*
       Process only the newly typed characters.
       This prevents old characters from being counted
       repeatedly.
    */

    const newCharacters =
        value.slice(
            Math.max(
                0,
                value.length - 1
            )
        );


    /*
       Normally the input contains one character.
       We handle it safely here.
    */

    if (value.length === 0) {

        return;

    }


    const typedCharacter =
        value[value.length - 1];


    /*
       Prevent typing beyond the text.
    */

    if (
        currentIndex >=
        currentText.length
    ) {

        typingInput.value = "";

        return;

    }


    const expectedCharacter =
        currentText[currentIndex];


    const span =
        typingText.children[currentIndex];


    totalTyped++;


    if (
        typedCharacter ===
        expectedCharacter
    ) {

        correctCharacters++;

        span.classList.remove("current");
        span.classList.add("correct");

    }

    else {

        errors++;

        if (showErrors) {

            span.classList.remove("current");
            span.classList.add("wrong");

        }

        else {

            span.classList.remove("current");
            span.classList.add("correct");

        }

    }


    currentIndex++;


    /*
       Clear input after processing.
       This gives us complete control over the
       virtual typing cursor.
    */

    typingInput.value = "";


    if (
        currentIndex >=
        currentText.length
    ) {

        if (selectedMode === "paragraph") {

            generateText();

        }

        else {

            generateText();

        }

    }

    else {

        updateCurrentCharacter();

    }


    updateStats();

    updateProgress();

    playTypeSound();

}


/* =========================================================
   CURRENT CHARACTER
========================================================= */

function updateCurrentCharacter() {

    const spans =
        typingText.children;


    for (let i = 0; i < spans.length; i++) {

        spans[i].classList.remove("current");

    }


    if (
        spans[currentIndex]
    ) {

        spans[currentIndex]
            .classList.add("current");

        scrollCurrentCharacter();

    }

}


/* ================= SCROLL CHARACTER ================= */

function scrollCurrentCharacter() {

    const current =
        typingText.children[currentIndex];

    if (!current) {

        return;

    }


    const cardRect =
        typingCard.getBoundingClientRect();

    const charRect =
        current.getBoundingClientRect();


    if (
        charRect.bottom >
        cardRect.bottom - 100
    ) {

        current.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

}


/* =========================================================
   TIMER
========================================================= */

function startGame() {

    if (gameStarted) {

        return;

    }


    gameStarted = true;

    gameFinished = false;

    elapsedSeconds = 0;

    liveStatus.textContent =
        "● RUNNING";

    liveStatus.classList.add(
        "running"
    );


    timer =
        setInterval(
            tick,
            1000
        );

}


/* ================= TIMER TICK ================= */

function tick() {

    if (!gameStarted) {

        return;

    }


    remainingTime--;

    elapsedSeconds++;


    if (
        remainingTime <= 0
    ) {

        remainingTime = 0;

        finishGame();

    }


    updateStats();

}


/* =========================================================
   FINISH GAME
========================================================= */

function finishGame() {

    clearInterval(timer);

    timer = null;

    gameStarted = false;

    gameFinished = true;


    liveStatus.textContent =
        "● FINISHED";

    liveStatus.classList.remove(
        "running"
    );

    liveStatus.classList.add(
        "finished"
    );


    typingInput.blur();


    const finalWpm =
        calculateWPM();


    const finalAccuracy =
        calculateAccuracy();


    if (finalWpm > bestWpm) {

        bestWpm = finalWpm;

        localStorage.setItem(
            "typenovaBestWpm",
            bestWpm
        );

        bestWpmElement.textContent =
            bestWpm;

    }


    resultWpm.textContent =
        finalWpm;

    resultAccuracy.textContent =
        `${finalAccuracy}%`;

    resultErrors.textContent =
        errors;

    resultCharacters.textContent =
        totalTyped;


    setTimeout(() => {

        resultModal.classList.add(
            "show"
        );

    }, 250);

}


/* =========================================================
   WPM
========================================================= */

function calculateWPM() {

    let seconds =
        elapsedSeconds;


    if (seconds <= 0) {

        seconds = 1;

    }


    /*
       Standard typing formula:
       characters / 5 = words
    */

    const wordsTyped =
        correctCharacters / 5;


    const minutes =
        seconds / 60;


    return Math.max(
        0,
        Math.round(
            wordsTyped / minutes
        )
    );

}


/* =========================================================
   ACCURACY
========================================================= */

function calculateAccuracy() {

    if (totalTyped === 0) {

        return 100;

    }


    return Math.max(
        0,
        Math.round(
            (
                correctCharacters /
                totalTyped
            ) * 100
        )
    );

}


/* =========================================================
   STATS
========================================================= */

function updateStats() {

    timeDisplay.textContent =
        remainingTime;

    wpmDisplay.textContent =
        calculateWPM();

    accuracyDisplay.textContent =
        `${calculateAccuracy()}%`;

    errorsDisplay.textContent =
        errors;

}


/* =========================================================
   PROGRESS
========================================================= */

function updateProgress() {

    if (
        currentText.length === 0
    ) {

        return;

    }


    const progress =
        Math.min(
            100,
            Math.round(
                (
                    currentIndex /
                    currentText.length
                ) * 100
            )
        );


    progressFill.style.width =
        `${progress}%`;

    progressText.textContent =
        `${progress}%`;

}


/* =========================================================
   RESTART
========================================================= */

function restartGame() {

    clearInterval(timer);

    timer = null;

    gameStarted = false;

    gameFinished = false;

    remainingTime =
        selectedTime;

    elapsedSeconds = 0;

    currentIndex = 0;

    correctCharacters = 0;

    totalTyped = 0;

    errors = 0;


    typingInput.value = "";


    liveStatus.textContent =
        "● READY";

    liveStatus.classList.remove(
        "running",
        "finished"
    );


    resultModal.classList.remove(
        "show"
    );


    generateText();

    updateStats();

    updateProgress();


    if (autoFocus) {

        focusInput();

    }

}


/* =========================================================
   TIME SELECTION
========================================================= */

timeButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            if (
                button.id ===
                "customTimeButton"
            ) {

                customModal.classList.add(
                    "show"
                );

                customTimeInput.focus();

                return;

            }


            const value =
                Number(
                    button.dataset.time
                );


            selectTime(value);

        }
    );

});


function selectTime(seconds) {

    selectedTime = seconds;

    customTimeButton.textContent =
        "Custom";

    customTimeButton.classList.remove(
        "active"
    );


    timeButtons.forEach(button => {

        button.classList.remove(
            "active"
        );

        if (
            Number(button.dataset.time) ===
            seconds
        ) {

            button.classList.add(
                "active"
            );

        }

    });


    restartGame();

}


/* =========================================================
   CUSTOM TIME
========================================================= */

applyCustom.addEventListener(
    "click",
    () => {

        let value =
            Number(
                customTimeInput.value
            );


        if (Number.isNaN(value)) {

            value = 90;

        }


        value =
            Math.max(
                5,
                Math.min(
                    600,
                    value
                )
            );


        selectedTime = value;


        timeButtons.forEach(button => {

            button.classList.remove(
                "active"
            );

        });


        customTimeButton.classList.add(
            "active"
        );


        customTimeButton.textContent =
            `${value}s`;


        customModal.classList.remove(
            "show"
        );


        restartGame();

    }
);


/* =========================================================
   MODE SELECTION
========================================================= */

modeButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            selectedMode =
                button.dataset.mode;


            modeButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            button.classList.add(
                "active"
            );


            restartGame();

        }
    );

});


/* =========================================================
   THEME SYSTEM
========================================================= */

themeButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        settingsMenu.classList.remove(
            "show"
        );

        themeMenu.classList.toggle(
            "show"
        );

    }
);


settingsButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        themeMenu.classList.remove(
            "show"
        );

        settingsMenu.classList.toggle(
            "show"
        );

    }
);


/* ================= THEME OPTIONS ================= */

themeOptions.forEach(option => {

    option.addEventListener(
        "click",
        () => {

            const theme =
                option.dataset.theme;


            currentTheme = theme;


            document.body.dataset.theme =
                theme;


            localStorage.setItem(
                "typenovaTheme",
                theme
            );


            updateThemeButtons();

            themeMenu.classList.remove(
                "show"
            );

        }
    );

});


function updateThemeButtons() {

    themeOptions.forEach(option => {

        option.classList.toggle(
            "active",
            option.dataset.theme ===
            currentTheme
        );

    });

}


/* =========================================================
   SETTINGS
========================================================= */

soundToggle.addEventListener(
    "change",
    () => {

        soundEnabled =
            soundToggle.checked;


        localStorage.setItem(
            "typenovaSound",
            soundEnabled
        );

    }
);


errorToggle.addEventListener(
    "change",
    () => {

        showErrors =
            errorToggle.checked;


        localStorage.setItem(
            "typenovaErrors",
            showErrors
        );

    }
);


autoFocusToggle.addEventListener(
    "change",
    () => {

        autoFocus =
            autoFocusToggle.checked;


        localStorage.setItem(
            "typenovaAutoFocus",
            autoFocus
        );

    }
);


/* =========================================================
   SOUND
========================================================= */

function playTypeSound() {

    if (!soundEnabled) {

        return;

    }


    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) {

            return;

        }


        const audio =
            new AudioContext();


        const oscillator =
            audio.createOscillator();

        const gain =
            audio.createGain();


        oscillator.frequency.value =
            550;

        oscillator.type =
            "sine";


        gain.gain.setValueAtTime(
            0.025,
            audio.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audio.currentTime + 0.04
        );


        oscillator.connect(gain);

        gain.connect(
            audio.destination
        );


        oscillator.start();

        oscillator.stop(
            audio.currentTime + 0.04
        );

    }

    catch (error) {

        // Audio is optional.

    }

}


/* =========================================================
   FOCUS
========================================================= */

function focusInput() {

    if (!autoFocus) {

        return;

    }


    setTimeout(() => {

        typingInput.focus();

    }, 50);

}


/* =========================================================
   CLICK TYPING AREA
========================================================= */

const typingCard =
    document.getElementById("typingCard");


typingCard.addEventListener(
    "click",
    () => {

        focusInput();

    }
);


typingText.addEventListener(
    "click",
    () => {

        focusInput();

    }
);


/* =========================================================
   RESTART BUTTON
========================================================= */

restartButton.addEventListener(
    "click",
    restartGame
);


modalRestart.addEventListener(
    "click",
    restartGame
);


/* =========================================================
   RESULT MODAL
========================================================= */

closeResult.addEventListener(
    "click",
    () => {

        resultModal.classList.remove(
            "show"
        );

        focusInput();

    }
);


/* =========================================================
   CUSTOM MODAL
========================================================= */

closeCustom.addEventListener(
    "click",
    () => {

        customModal.classList.remove(
            "show"
        );

        focusInput();

    }
);


/* =========================================================
   CLOSE MENUS WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            !themeMenu.contains(event.target) &&
            !themeButton.contains(event.target)
        ) {

            themeMenu.classList.remove(
                "show"
            );

        }


        if (
            !settingsMenu.contains(event.target) &&
            !settingsButton.contains(event.target)
        ) {

            settingsMenu.classList.remove(
                "show"
            );

        }

    }
);


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        /*
           TAB = Restart
        */

        if (
            event.key === "Tab"
        ) {

            event.preventDefault();

            restartGame();

            return;

        }


        /*
           ESC = Reset
        */

        if (
            event.key === "Escape"
        ) {

            resultModal.classList.remove(
                "show"
            );

            customModal.classList.remove(
                "show"
            );

            themeMenu.classList.remove(
                "show"
            );

            settingsMenu.classList.remove(
                "show"
            );

            restartGame();

            return;

        }


        /*
           T = Theme
        */

        if (
            event.key.toLowerCase() === "t" &&
            document.activeElement !== typingInput
        ) {

            themeMenu.classList.toggle(
                "show"
            );

            settingsMenu.classList.remove(
                "show"
            );

        }


        /*
           Space = focus typing
        */

        if (
            event.code === "Space" &&
            document.activeElement !== typingInput
        ) {

            event.preventDefault();

            focusInput();

        }

    }
);


/* =========================================================
   PREVENT ACCIDENTAL FORM BEHAVIOUR
========================================================= */

typingInput.addEventListener(
    "keydown",
    event => {

        /*
           We use our own virtual input system.
           Only normal printable characters are needed.
        */

        if (
            event.key === "Backspace" ||
            event.key === "Delete" ||
            event.key === "ArrowLeft" ||
            event.key === "ArrowRight" ||
            event.key === "ArrowUp" ||
            event.key === "ArrowDown"
        ) {

            event.preventDefault();

        }

    }
);


/* =========================================================
   KEEP INPUT FOCUSED
========================================================= */

typingInput.addEventListener(
    "blur",
    () => {

        if (
            autoFocus &&
            !gameFinished
        ) {

            setTimeout(
                focusInput,
                100
            );

        }

    }
);


/* =========================================================
   START SCREEN
========================================================= */

updateStats();

updateProgress();

console.log(
    "TypeNova initialized successfully."
);