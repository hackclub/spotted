from PIL import ImageDraw

def draw_boxes(image, results, output_path):
    draw = ImageDraw.Draw(image)
    for result in results:
        box = result['box']
        draw.rectangle(box, outline='red')
    image.save(output_path)
