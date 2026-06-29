from tensorflow.keras.models import load_model

MODEL_PATH = "model/modelo_resnet50_final.h5"

model = load_model(MODEL_PATH)

CLASS_LABELS = [
    'Degeneracion Macular por Edad',        #0
    'Miopía',                               #1
    'Catarata',                             #2
    'Retinopatia Diabetica',                #3
    'Glaucoma',                             #4
    'Sano'                                  #5
]

print("Modelo cargado")
LAST_CONV_LAYER = "conv5_block3_out"