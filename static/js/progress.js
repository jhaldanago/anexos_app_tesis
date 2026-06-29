/* BARRA DE PROGRESO FAKE */

let fakeProgress = null;

function startProgress(){

    progress.classList.remove("hidden");

    progressBar.style.width = "0%";

    let width = 0;

    fakeProgress = setInterval(() => {

        width += 5;

        if(width <= 90){

            progressBar.style.width =
            width + "%";
        }

    },200);
}

function stopProgress(){

    clearInterval(fakeProgress);

    progressBar.style.width = "100%";

    setTimeout(() => {

        progress.classList.add("hidden");

        progressBar.style.width = "0%";

    },300);
}