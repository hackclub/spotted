from PIL import Image, ImageDraw
from transformers import DetrImageProcessor, DetrForObjectDetection
import torch

def detect_squirrels(image_path, output_path):
    image = Image.open(image_path)
    processor = DetrImageProcessor.from_pretrained("facebook/detr-resnet-50", revision="no_timm")
    model = DetrForObjectDetection.from_pretrained("facebook/detr-resnet-50", revision="no_timm")
    
    inputs = processor(images=image, return_tensors="pt")
    outputs = model(**inputs)
    
    target_sizes = torch.tensor([image.size[::-1]])
    results = processor.post_process_object_detection(outputs, target_sizes=target_sizes, threshold=0.1)[0]

    draw = ImageDraw.Draw(image)
    for score, label, box in zip(results["scores"], results["labels"], results["boxes"]):
        box = [round(i, 2) for i in box.tolist()]
        label_name = model.config.id2label[label.item()]
        print(
            f"Detected {label_name} with confidence {round(score.item(), 3)} at location {box}"
        )

        if label_name == 'squirrel': 
            draw.rectangle(box, outline="red", width=3)

    image.save(output_path)
