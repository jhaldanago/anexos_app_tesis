/* PREDICCION IA */

predictBtn.onclick = async () => {

    if(!selectedFile) return;

    predictBtn.disabled = true;

    predictText.textContent =
    "Analizando...";

    startProgress();

    const startTime =
    performance.now();

    const formData =
    new FormData();

    formData.append(
        "image",
        selectedFile
    );

    try{

        const response =
        await fetch("/predict",{

            method:"POST",

            body:formData
        });

        const data =
        await response.json();

        if (!response.ok) {

            throw new Error(
                data.error || "Error en servidor"
            );
        }

        renderResults(data);

        const endTime =
        performance.now();

        const seconds =
        ((endTime - startTime)/1000)
        .toFixed(2);

        inferenceTime.textContent =
        `${seconds} s`;

    }

    catch(error){

        console.error(error);

        alert(
            "Error al procesar imagen."
        );
    }

    finally{

        stopProgress();

        predictText.textContent =
        "Predecir Enfermedad";

        predictBtn.disabled = false;
    }
};

/* RENDER RESULTADOS */
const diseaseDescriptions = {

    "Degeneracion Macular por Edad": {
        description:
            "Es una enfermedad ocular que afecta la mácula, la zona central de la retina responsable de la visión detallada.",

        features: [
            "Pérdida progresiva de la visión central",
            "Dificultad para leer o reconocer rostros",
            "Distorsión de líneas rectas"
        ]
    },

    "Miopía": {
        description:
            "Trastorno refractivo que provoca visión borrosa de objetos lejanos debido a que la imagen se enfoca delante de la retina.",

        features: [
            "Visión borrosa a distancia",
            "Necesidad de entrecerrar los ojos",
            "Fatiga visual frecuente"
        ]
    },

    "Catarata": {
        description:
            "Opacidad progresiva del cristalino que reduce la calidad visual y dificulta la entrada adecuada de luz al ojo.",

        features: [
            "Visión nublada",
            "Sensibilidad a la luz",
            "Dificultad para ver de noche"
        ]
    },

    "Retinopatia Diabetica": {
        description:
            "Complicación de la diabetes que afecta los vasos sanguíneos de la retina y puede provocar pérdida visual.",

        features: [
            "Manchas o puntos flotantes",
            "Visión borrosa",
            "Pérdida progresiva de la visión"
        ]
    },

    "Glaucoma": {
        description:
            "Grupo de enfermedades que dañan el nervio óptico, generalmente asociadas a presión intraocular elevada.",

        features: [
            "Pérdida gradual del campo visual",
            "Daño irreversible del nervio óptico",
            "Puede no presentar síntomas iniciales"
        ]
    },

    "Sano": {
        description:
            "No se identificaron indicios relevantes de las patologías contempladas por el modelo.",

        features: [
            "Estructuras retinianas conservadas",
            "Ausencia de signos evidentes de enfermedad",
            "Resultado compatible con normalidad"
        ]
    }

};


function renderResults(data){

    predictionsDiv.innerHTML = "";

    const sorted =
    [...data.predictions]
    .sort(
        (a,b)=>
        b.probability -
        a.probability
    );

    sorted.forEach(item => {

        predictionsDiv.innerHTML += `

        <div class="result-item">

            <div class="result-header">

                <span>
                    ${item.disease}
                </span>

                <strong>
                    ${item.probability.toFixed(2)}%
                </strong>

            </div>

            <div class="bar-bg">

                <div
                    class="bar-fill"
                    style="width:${item.probability}%">
                </div>

            </div>

        </div>

        `;
    });

    bestDiagnosis.textContent =
    data.best_class;

    const diseaseInfo =
    document.getElementById(
        "diseaseInfo"
    );

    const info =
    diseaseDescriptions[
        data.best_class
    ];

    if(info){

        diseaseInfo.innerHTML = `

            <div class="diagnosis-card">

                <!-- <h3>
                    ${data.best_class}
                </h3> -->

                <p>
                    ${info.description}
                </p>

                <h4>
                    Características principales
                </h4>
                <h2></h2>
                <ul>
                    ${info.features
                        .map(
                            feature =>
                            `<li>${feature}</li>`
                        )
                        .join("")
                    }
                </ul>

                <div class="medical-disclaimer">

                    <strong>
                        Aviso importante:
                    </strong>

                    Esta clasificación ha sido generada mediante un modelo de Inteligencia Artificial a partir de la imagen analizada. Los resultados son únicamente de apoyo y no sustituyen una evaluación clínica profesional. Se recomienda consultar a un médico oftalmólogo para obtener un diagnóstico definitivo y orientación especializada.

                </div>

            </div>

        `;
    }

    confidenceValue.textContent =
    sorted[0].probability.toFixed(2)
    + "%";

    gradcamImage.src =
    data.gradcam_image;

    emptyState.classList.add(
        "hidden"
    );

    resultsBox.classList.remove(
        "hidden"
    );

    updateRisk(
        sorted[0].probability
    );
}

/* NIVEL DE RIESGO */

function updateRisk(confidence){

    riskBadge.className =
    "risk-badge";

    if(confidence >= 80){

        riskBadge.classList.add(
            "high"
        );

        riskBadge.textContent =
        "Precisión alta";
    }

    else if(confidence >= 60){

        riskBadge.classList.add(
            "medium"
        );

        riskBadge.textContent =
        "Precisión media";
    }

    else{

        riskBadge.classList.add(
            "low"
        );

        riskBadge.textContent =
        "Baja precisión";
    }
}