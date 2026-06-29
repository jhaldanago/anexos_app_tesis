import tensorflow as tf
import numpy as np
import cv2

from model.model_loader import model
from model.model_loader import LAST_CONV_LAYER


def generate_heatmap(img_array, pred_index):

    grad_model = tf.keras.models.Model(

        inputs=model.inputs,

        outputs=[
            model.get_layer(LAST_CONV_LAYER).output,
            model.output
        ]
    )

    with tf.GradientTape() as tape:

        conv_outputs, predictions = grad_model(img_array)
        
        if isinstance(predictions, list):
            predictions = predictions[0]
        
        class_channel = predictions[:, pred_index]

    grads = tape.gradient(
        class_channel,
        conv_outputs
    )

    pooled_grads = tf.reduce_mean(
        grads,
        axis=(0, 1, 2)
    )

    conv_outputs = conv_outputs[0]

    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]

    heatmap = tf.squeeze(heatmap)

    heatmap = tf.maximum(heatmap, 0)

    heatmap /= tf.math.reduce_max(heatmap)
    print("GradCAM OK")
    return heatmap.numpy()


def create_gradcam_image(img_path, heatmap):

    img = cv2.imread(img_path)

    img = cv2.cvtColor(
        img,
        cv2.COLOR_BGR2RGB
    )

    # tamaño original
    h, w = img.shape[:2]

    # redimensionar heatmap al tamaño original
    heatmap = cv2.resize(
        heatmap,
        (w, h)
    )

    heatmap = np.uint8(255 * heatmap)

    heatmap = cv2.applyColorMap(
        heatmap,
        cv2.COLORMAP_JET
    )

    superimposed_img = cv2.addWeighted(
        img,
        0.6,
        heatmap,
        0.4,
        0
    )

    return cv2.cvtColor(
        superimposed_img,
        cv2.COLOR_RGB2BGR
    )