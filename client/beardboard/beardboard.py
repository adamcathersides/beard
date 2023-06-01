import requests
import asyncio
import aiohttp

config = {
    'server':'127.0.0.1',
    'port':'8081',
    'person':'dave'
}

base_url = "{}:{}".format(config['server'], config['port'])


async def run():

    async with aiohttp.ClientSession() as session:
        async with session.get("http://{}/input/person/dave/dist".format(base_url), params={'enabled':'true'}) as response:

            print("Status:", response.status)
            print("Content-type:", response.headers['content-type'])

            response_data = await response.text()
            print(response_data)

def main():
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run())




#def run():
#    r = requests.get("http://{}/input/person/dave/dist".format(base_url), params={'enabled':'true'})



