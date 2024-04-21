from models.squirrel_detection import detect_squirrels
import os

def main():
    image_folder = 'squirrel-images/'
    output_folder = 'results/'
    
    os.makedirs(output_folder, exist_ok=True)

    images = os.listdir(image_folder)
    total_images = len(images)

    for index, image_name in enumerate(images):
        image_path = os.path.join(image_folder, image_name)
        output_path = os.path.join(output_folder, 'detected_' + image_name)

        detect_squirrels(image_path, output_path)
        
        print(f"Processed {index + 1}/{total_images} images.")

if __name__ == "__main__":
    main()
