from cookiecutter.main import cookiecutter


def fetch_ui_version_choices():
    return ["v1.1", "v1.3"]


if __name__ == "__main__":
    print("CALLLLLEEEEEED")
    ui_choices = fetch_ui_version_choices()

    cookiecutter("./bs", extra_context={"ui_choices": ui_choices})
