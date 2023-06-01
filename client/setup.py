from setuptools import setup, find_packages

setup(
    name = "beardboard",
    version = "0.0.1",
    author = "Adam Cathersides",
    author_email = "adamcathersides@gmail.com",
    description = ("Client for the beard pedal board"),
    packages = ['beardboard'],
    include_package_data = True,
    install_requires = [
        'click',
        'pyyaml',
        'requests',
        'aiohttp'
    ],
    classifiers = [
        "Development Status :: 3 - Alpha",
        "Topic :: Utilities",
    ],
    entry_points={
          'console_scripts': [
              'beardboard = beardboard.beardboard:main'
          ]
      }
)
