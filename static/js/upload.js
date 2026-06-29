/* CARGA DE IMAGEN */

imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if(!file) return;

    selectedFile = file;

    const reader = new FileReader();

    reader.onload = () => {

        imageData = reader.result;

        imagePreview.src =
        imageData;

        originalImage.src =
        imageData;

        uploadBox.classList.add("hidden");

        previewContainer.classList.remove("hidden");

        predictBtn.disabled = false;

        resetBtn.disabled = false;

        document
            .getElementById("mainContent")
            .scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
    };

    reader.readAsDataURL(file);

});