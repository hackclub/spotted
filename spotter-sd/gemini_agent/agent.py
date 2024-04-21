from uagents import Agent, Context, Protocol
import aiohttp
import google.generativeai as genai
import PIL
from PIL import Image
import subprocess
import io

squirrelgetter = Agent(
    name="squirrelgetter"
    port=8000,
    seed="squirrelgetter seed",
    endpoint=["http://127.0.0.1:8000/squirrelnum"]
)

async def generate_response(model, prompt):
    response = await model.generate_content(prompt)
    return response['text'] if response else None

@squirrelgetter.on_event("startup")
async def process_image(ctx: Context):
    ctx.logger.info('squirrelgetter online')

    image_url = 'https://cloud-8vxv0s664-hack-club-bot.vercel.app/1squirrel2.jpeg'
    genai.configure(api_key = 'api key here')

    curl_command = f"curl -o image.jpg {image_url}"
    subprocess.run(curl_command, shell=True)

    img = PIL.Image.open('image.jpg')

    if img:
        ctx.logger.info('image fetched successfully')

        model = genai.GenerativeModel('models/gemini-pro-vision')

        response = model.generate_content(["If there are no squirrels in the image, output 0 and nothing else, no text. If there are squirrels in the image, please count the number of squirrels in this image. You may reason to yourself, but please put the final answer in curly braces and include just the number, nothing else.", img], stream=True)
        response.resolve()
        ctx.logger.info(response.text)
        print(response.text)

if __name__ == "__main__":
    squirrelgetter.run()
