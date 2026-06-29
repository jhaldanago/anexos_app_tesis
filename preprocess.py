import numpy as np

from tensorflow.keras.applications.resnet50 import preprocess_input

from PIL import Image


IMG_SIZE = 224


def resize_and_center_crop(img, target_size):

    width, height = img.size

    # escalar manteniendo proporción
    scale = target_size / min(width, height)

    new_width = int(width * scale)
    new_height = int(height * scale)

    img = img.resize(
        (new_width, new_height),
        Image.LANCZOS
    )

    # center crop
    left = (new_width - target_size) // 2
    top = (new_height - target_size) // 2

    right = left + target_size
    bottom = top + target_size

    img = img.crop((
        left,
        top,
        right,
        bottom
    ))

    return img


def preprocess_image(img_path):

    # abrir imagen original
    img = Image.open(img_path).convert("RGB")

    width, height = img.size

    # validar tamaño mínimo
    if width < 224 or height < 224:

        raise ValueError(
            "La imagen debe tener al menos 224x224 píxeles"
        )

    # aplicar mismo preprocesamiento del dataset
    img = resize_and_center_crop(
        img,
        IMG_SIZE
    )

    # convertir a array
    img_array = np.array(img)

    # agregar batch dimension
    img_array = np.expand_dims(
        img_array,
        axis=0
    )

    # preprocess ResNet50
    img_array = preprocess_input(img_array)
    print("Preprocesamiento OK")
    return img_array
