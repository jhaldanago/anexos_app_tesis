/* ELEMENTOS */

const imageInput =
document.getElementById("imageInput");

const uploadBox =
document.getElementById("uploadBox");

const previewContainer =
document.getElementById("previewContainer");

const imagePreview =
document.getElementById("imagePreview");

const originalImage =
document.getElementById("originalImage");

const clearBtn =
document.getElementById("clearBtn");

const predictBtn =
document.getElementById("predictBtn");

const resetBtn =
document.getElementById("resetBtn");

const predictText =
document.getElementById("predictText");

const progress =
document.getElementById("progress");

const progressBar =
document.getElementById("progressBar");

const emptyState =
document.getElementById("emptyState");

const resultsBox =
document.getElementById("results");

const predictionsDiv =
document.getElementById("predictions");

const gradcamImage =
document.getElementById("gradcamImage");

const bestDiagnosis =
document.getElementById("bestDiagnosis");

const confidenceValue =
document.getElementById("confidenceValue");

const inferenceTime =
document.getElementById("inferenceTime");

const riskBadge =
document.getElementById("riskBadge");

/* VARIABLES GLOBALES */

let selectedFile = null;

let imageData = null;

/* RESET GENERAL */

function resetAll(){

    imageInput.value = "";

    selectedFile = null;

    imageData = null;

    uploadBox.classList.remove("hidden");

    previewContainer.classList.add("hidden");

    emptyState.classList.remove("hidden");

    resultsBox.classList.add("hidden");

    predictBtn.disabled = true;

    resetBtn.disabled = true;

    progressBar.style.width = "0%";

    confidenceValue.textContent = "0%";

    inferenceTime.textContent = "0.00 s";

    bestDiagnosis.textContent = "";

    predictionsDiv.innerHTML = "";

    gradcamImage.src = "";

    originalImage.src = "";

    riskBadge.className = "risk-badge";

    riskBadge.textContent = "Riesgo";
}

clearBtn.onclick = resetAll;

resetBtn.onclick = resetAll;