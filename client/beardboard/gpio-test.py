import RPi.GPIO as gpio
import time


gpio.setmode(gpio.BCM)
gpio.setup(23, gpio.IN, pull_up_down=gpio.PUD_UP)
gpio.setup(17, gpio.OUT)

led_state = False


def thing(channel):

    led_state = not led_state
    print("Button pressed!")
    
    if led_state:
        gpio.output(17, gpio.HIGH)
    else:
        gpio.output(17, gpio.LOW)
    


gpio.add_event_detect(23, gpio.FALLING, callback=thing, bouncetime=300)

while True:
    time.sleep(1)



