
project_lib_dir = os.environ.get('PYTHONPATH', '').split(os.pathsep)[-1]


@app.route('/static/<resource_type>/<resource_lib_name>/<resource_version>/<resource_file_name>')
@app.route('/static/<resource_type>/<resource_file_name>')
@app.route('/static/<resource_file_name>')
def get_static_resource(resource_file_name, resource_type=None, resource_lib_name=None, resource_version=None):
    resource = fetch_resource(project_lib_dir, resource_type, resource_lib_name, resource_version, resource_file_name)
    file_name, file_extension = os.path.splitext('/path/to/somefile.ext')
    mime_type = 'text/html'
    if resource_type == 'js' or file_extension == 'js':
        mime_type = 'text/javascript'
    elif resource_type == 'css' or file_extension == 'css':
        mime_type = 'text/css'
    elif file_extension == 'js':
        mime_type = 'text/css'
        
    expiry_time = datetime.datetime.utcnow() + datetime.timedelta(1)
    status = resource['status']
    resp = Response(response=resource['content'], status=status, mimetype=mime_type)
    if status == 200:
        resp.headers['Cache-Control'] = 'public'
        resp.cache_control.max_age = 86400
        resp.headers["Expires"] = expiry_time.strftime("%a, %d %b %Y %H:%M:%S GMT")
    return resp
