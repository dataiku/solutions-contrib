import setuptools
from os.path import join, dirname

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

with open(join(dirname(__file__), "requirements.txt"), "r") as f:
    install_requires = f.read().split("\n")

setuptools.setup(
    name="webaiku",
    version="0.0.1",
    license="Apache 2.0",
    author="Anas Laaroussi",
    description="Web application tools for Dataiku DSS",
    long_description=long_description,
    long_description_content_type="text/markdown",
    include_package_data=True,
    python_requires=">=3.6",
    install_requires=install_requires,
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
    ],
)
