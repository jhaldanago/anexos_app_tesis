import numpy as np

from model.model_loader import model
from model.model_loader import CLASS_LABELS

def predict_image(img_array):

    preds = model.predict(img_array)

    probs = preds[0]

    predicted_index = np.argmax(probs)

    predicted_class = CLASS_LABELS[predicted_index]

    results = []

    for i, prob in enumerate(probs):

        results.append({
            "disease": CLASS_LABELS[i],
            "probability": float(prob * 100)
        })

    results = sorted(
        results,
        key=lambda x: x["probability"],
        reverse=True
    )
    print("Predicción OK")
    return {
        "predicted_class": predicted_class,
        "predicted_index": predicted_index,
        "results": results
    }