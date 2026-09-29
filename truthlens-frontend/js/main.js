/* =========================================================
   TRUTHLENS - MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   ELEMENTS
   ========================================================= */

const modal = document.getElementById("analysisModal");

const modalIcon = document.getElementById("modalIcon");
const modalLabel = document.getElementById("modalLabel");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");

const textInputArea = document.getElementById("textInputArea");
const imageInputArea = document.getElementById("imageInputArea");
const videoInputArea = document.getElementById("videoInputArea");

const resultArea = document.getElementById("resultArea");

const newsText = document.getElementById("newsText");

const resultBadge = document.getElementById("resultBadge");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");

const confidenceValue = document.getElementById("confidenceValue");
const confidenceFill = document.getElementById("confidenceFill");


/* =========================================================
   OPEN ANALYSIS MODAL
   ========================================================= */

function openAnalysis(type) {

    modal.classList.add("active");

    /* Hide all input areas */

    textInputArea.classList.add("hidden");
    imageInputArea.classList.add("hidden");
    videoInputArea.classList.add("hidden");

    /* Hide previous result */

    resultArea.classList.add("hidden");

    /* Reset modal */

    resetResult();


    /* ================= TEXT ================= */

    if (type === "text") {

        modalIcon.textContent = "T";

        modalLabel.textContent = "TEXT ANALYSIS";

        modalTitle.textContent = "Analyze News Text";

        modalDescription.textContent =
            "Enter a news article, headline, or claim below.";

        textInputArea.classList.remove("hidden");

    }


    /* ================= IMAGE ================= */

    else if (type === "image") {

        modalIcon.textContent = "◫";

        modalLabel.textContent = "IMAGE ANALYSIS";

        modalTitle.textContent = "Analyze News Image";

        modalDescription.textContent =
            "Upload a news image to examine its content.";

        imageInputArea.classList.remove("hidden");

    }


    /* ================= VIDEO ================= */

    else if (type === "video") {

        modalIcon.textContent = "▶";

        modalLabel.textContent = "VIDEO ANALYSIS";

        modalTitle.textContent = "Analyze News Video";

        modalDescription.textContent =
            "Upload a news video to begin the analysis.";

        videoInputArea.classList.remove("hidden");

    }

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeModal() {

    modal.classList.remove("active");

}


/* =========================================================
   CLOSE WHEN CLICKING OUTSIDE MODAL
   ========================================================= */

modal.addEventListener("click", function (event) {

    if (event.target === modal) {

        closeModal();

    }

});


/* =========================================================
   ESC KEY CLOSES MODAL
   ========================================================= */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        closeModal();

    }

});


/* =========================================================
   SCROLL TO ANALYSIS
   ========================================================= */

function scrollToAnalysis() {

    const section = document.getElementById("analysis");

    section.scrollIntoView({
        behavior: "smooth"
    });

}


/* =========================================================
   HOW IT WORKS BUTTON
   ========================================================= */

function showHowItWorks() {

    const section = document.getElementById("how-it-works");

    section.scrollIntoView({
        behavior: "smooth"
    });

}


/* =========================================================
   RESET RESULT
   ========================================================= */

function resetResult() {

    resultArea.classList.remove("result-fake");
    resultArea.classList.remove("result-real");

    resultBadge.textContent = "ANALYSIS RESULT";

    resultTitle.textContent = "Analysis Result";

    resultMessage.textContent =
        "Your analysis result will appear here.";

    confidenceValue.textContent = "0%";

    confidenceFill.style.width = "0%";

}


/* =========================================================
   TEXT ANALYSIS
   ========================================================= */

async function analyzeText() {

    const text = newsText.value.trim();


    /* Check empty input */

    if (!text) {

        alert("Please enter some news text before analyzing.");

        return;

    }


    /* Get analyze button */

    const button =
        textInputArea.querySelector(".analyze-btn");


    /* Loading state */

    button.disabled = true;

    button.innerHTML = "Analyzing...";


    try {

        /*
         * TruthLens backend endpoint.
         *
         * Change this URL later if your backend
         * runs on another port.
         */

        const response = await fetch(
            "http://127.0.0.1:8000/analyze-text",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    text: text
                })
            }
        );


        /* Check server response */

        if (!response.ok) {

            throw new Error(
                "Server returned an error."
            );

        }


        const data = await response.json();


        /*
         * Expected backend response:
         *
         * {
         *   label: "Fake",
         *   confidence: 79.45,
         *   message: "potentially misleading or fake."
         * }
         */


        const label =
            data.label || "Unknown";

        const confidence =
            Number(data.confidence) || 0;

        const message =
            data.message ||
            "Analysis completed.";


        showResult(
            label,
            confidence,
            message
        );

    }


    catch (error) {

        console.error(
            "TruthLens analysis error:",
            error
        );


        /*
         * Backend is not connected.
         */

        showConnectionError();

    }


    finally {

        button.disabled = false;

        button.innerHTML =
            'Analyze Text <span>→</span>';

    }

}


/* =========================================================
   SHOW RESULT
   ========================================================= */

function showResult(
    label,
    confidence,
    message
) {

    resultArea.classList.remove("hidden");

    resultArea.classList.remove("result-fake");
    resultArea.classList.remove("result-real");


    const normalizedLabel =
        String(label).toLowerCase();


    /* ================= FAKE ================= */

    if (
        normalizedLabel.includes("fake") ||
        normalizedLabel.includes("false") ||
        normalizedLabel.includes("misleading")
    ) {

        resultArea.classList.add("result-fake");

        resultBadge.textContent =
            "POTENTIALLY MISLEADING";

        resultTitle.textContent =
            "Potentially Fake / Misleading";

    }


    /* ================= REAL ================= */

    else if (
        normalizedLabel.includes("real") ||
        normalizedLabel.includes("true")
    ) {

        resultArea.classList.add("result-real");

        resultBadge.textContent =
            "CREDIBILITY SIGNAL";

        resultTitle.textContent =
            "Potentially Reliable";

    }


    /* ================= UNKNOWN ================= */

    else {

        resultBadge.textContent =
            "ANALYSIS COMPLETED";

        resultTitle.textContent =
            label;

    }


    resultMessage.textContent =
        message;


    /* Keep confidence between 0 and 100 */

    let safeConfidence =
        Math.max(
            0,
            Math.min(
                100,
                confidence
            )
        );


    confidenceValue.textContent =
        safeConfidence.toFixed(2) + "%";


    /*
     * Small delay makes the confidence
     * bar animation visible.
     */

    setTimeout(function () {

        confidenceFill.style.width =
            safeConfidence + "%";

    }, 100);


    /* Scroll result into view */

    setTimeout(function () {

        resultArea.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }, 150);

}


/* =========================================================
   BACKEND CONNECTION ERROR
   ========================================================= */

function showConnectionError() {

    resultArea.classList.remove("hidden");

    resultArea.classList.remove("result-real");

    resultArea.classList.add("result-fake");


    resultBadge.textContent =
        "BACKEND NOT CONNECTED";


    resultTitle.textContent =
        "Unable to Analyze";


    resultMessage.textContent =
        "TruthLens could not connect to the analysis server. Please make sure the backend is running on http://127.0.0.1:8000.";


    confidenceValue.textContent =
        "—";


    confidenceFill.style.width =
        "0%";

}


/* =========================================================
   IMAGE FILE PREVIEW
   ========================================================= */

const imageFile =
    document.getElementById("imageFile");


if (imageFile) {

    imageFile.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            if (!file) {
                return;
            }

            console.log(
                "Selected image:",
                file.name
            );

        }
    );

}


/* =========================================================
   VIDEO FILE PREVIEW
   ========================================================= */

const videoFile =
    document.getElementById("videoFile");


if (videoFile) {

    videoFile.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            if (!file) {
                return;
            }

            console.log(
                "Selected video:",
                file.name
            );

        }
    );

}


/* =========================================================
   INITIAL PAGE MESSAGE
   ========================================================= */

console.log(
    "TruthLens frontend loaded successfully."
);