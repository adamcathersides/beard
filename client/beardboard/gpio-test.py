import RPi.GPIO as gpio
import time
import requests


gpio.setmode(gpio.BCM)
gpio.setup(23, gpio.IN, pull_up_down=gpio.PUD_UP)
gpio.setup(17, gpio.OUT)

led_state = False

full_state = requests.get('http://192.168.1.199:8081/state')
electric =full_state.json()["adam"]["electric"]["state"]

if electric:
    gpio.output(17, gpio.HIGH)
else:
    gpio.output(17, gpio.LOW)


def thing(channel):

    r = requests.get('http://192.168.1.199:8081/input/guitar/adam/electric')
    led_state = r.json()["adam"]["electric"]["state"]
    
    print(led_state)
    print("Button pressed!")
    if led_state: 
        gpio.output(17, gpio.HIGH)
    else:
        gpio.output(17, gpio.LOW)


gpio.add_event_detect(23, gpio.FALLING, callback=thing, bouncetime=300)

try:  
    while True:
        time.sleep(10)
  
except KeyboardInterrupt:  
    gpio.cleanup()       # clean up GPIO on CTRL+C exit  



