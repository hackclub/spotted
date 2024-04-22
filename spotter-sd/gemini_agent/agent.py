import base64
from uagents import Agent, Context, Protocol
import aiohttp
import google.generativeai as genai
import PIL
from PIL import Image
import io

squirrelgetter = Agent(name="squirrelgetter")

async def generate_response(model, prompt):
    response = await model.generate_content(prompt)
    return response['text'] if response else None

@squirrelgetter.on_event("startup")
async def process_image(ctx: Context, request):
    ctx.logger.info('squirrelgetter online')

    request_body = await request.read()

    image_data = io.BytesIO(request_body)

    img = PIL.Image.open(image_data)
    
    genai.configure(api_key = 'no more api key womp womp')


    if img:
        ctx.logger.info('Image fetched successfully')

        buffered = io.BytesIO()
        img.save(buffered, format="JPEG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

        model = genai.GenerativeModel('models/gemini-pro-vision')

        response = model.generate_content(["If there are no squirrels in the image, output 0 and nothing else, no text. If there are squirrels in the image, please count the number of squirrels in this image. You may reason to yourself, but please put the final answer in curly braces and include just the number, nothing else.", 
                                           
                                           {
                                               "mimeType": "image/jpeg",
                                                  "data": img_base64
                                           }], stream=True)
        response.resolve()
        ctx.logger.info(response.text)
        print(response.text)

if __name__ == "__main__":
    squirrelgetter.run()
