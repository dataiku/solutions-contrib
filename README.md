# Solutions Contrib

[![Tests](https://github.com/dataiku/solutions-contrib/actions/workflows/tests.yml/badge.svg?branch=main&event=push)](https://github.com/dataiku/solutions-contrib/actions/workflows/tests.yml)

This repository contains Webaiku, our Python backend powered by Flask, which serves as a toolbox for users, enabling the rendering of advanced JavaScript frameworks for DSS WebApps.

For detailed instructions on setting up Code Studio and using Webaiku within DSS WebApps, please refer to the [documentation](https://developer.dataiku.com/latest/tutorials/webapps/code-studio/index.html).

## Tests

The Tests workflow runs the Webaiku suite with Flask and FastAPI on Python
3.9–3.14 for pull requests and every push to `main`. Live DSS tests are excluded.

To test a branch manually, open **Actions → Tests → Run workflow**, select the
branch, and click **Run workflow**. You can also use the CLI:

```sh
gh workflow run tests.yml --ref your-branch
```

To run the same suite locally in a Python virtual environment:

```sh
cd bs-infra
python -m pip install ".[dev]"
python -m pytest -m "not live" -q
```
