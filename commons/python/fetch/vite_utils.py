from textwrap import dedent
from flask import Response


def make_vite_header_tag():
    # TODO : ADD tags in prod mode
    return dedent(
        """
            <!-- FLASK_VITE_HEADER -->
            <script type="module" src="http://localhost:5173/@vite/client"></script>
            <script type="module" src="http://localhost:5173/main.js"></script>
        """
    )

def after_request(response : Response):
    if response.status_code != 200:
            return response

    mimetype = response.mimetype or ""
    if not mimetype.startswith("text/html"):
        return response
    
    if not isinstance(response.response, list):
        return response
    
    body = b"".join(response.response).decode()
    tag = make_vite_header_tag()
    body = body.replace("</head>", f"{tag}\n</head>")
    response.response = [body.encode("utf8")]
    response.content_length = len(response.response[0])
    return response