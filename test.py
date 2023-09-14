import re

test = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="./vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue + TS</title>
    <script type="module" crossorigin src="./assets/index-461a91fc.js"></script>
    <link rel="stylesheet" href="./assets/index-c322ae43.css">
  </head>
  <body>
    <div id="app"></div>
    
  </body>
</html>
""".encode(
    "utf-8"
)


def __make_base_tag(lib_url, content: bytes):
    html_content = content.decode("utf-8")
    new_href = f"{lib_url}/"
    base_tag = f'<base href="{new_href}">'
    head_pattern = r"<head[^>]*>"
    # Check if <head> tag exists, and if not, create one
    if re.search(head_pattern, html_content) is None:
        html_content = f"<head>{base_tag}</head>\n" + html_content
    else:
        # If <head> tag exists, add or replace <base> tag inside it
        html_content = re.sub(r"<base[^>]*>", "", html_content)
        html_content = re.sub(head_pattern, f"\\g<0>{base_tag}", html_content)
    return html_content.encode("utf-8")


print(__make_base_tag("a/b/c", test))
