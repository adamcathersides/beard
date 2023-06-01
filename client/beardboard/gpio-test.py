import RPi.GPIO as gpio
import time

gpio.setmode(gpio.BCM)
gpio.setup(23, gpio.IN, pull_up_down=gpio.PUD_UP)


def thing(channel):
    print("Button pressed!")


gpio.add_event_detect(23, gpio.FALLING, callback=thing, bouncetime=300)

while True:
    time.sleep(1)



