import * as webpack from 'webpack';

export default (
    config: webpack.Configuration,
) => {
    const codeStudioHref = process.env["{{ cookiecutter.__code_studio_href_env }}"] || null;
    const backendBaseUrl = process.env["{{ cookiecutter.__code_studio_backend_env }}"] || null;
    const baseHref =  JSON.stringify(codeStudioHref ? `${codeStudioHref}/` : "/");
    const backendAPIURL = JSON.stringify(backendBaseUrl ? `${backendBaseUrl}/` : "/");
    config.plugins?.push(
        new webpack.DefinePlugin({
            'process.env': {
                BASE_HREF: baseHref,
                API_DEV_URL: backendAPIURL
            }
            
        })
    );
    return config;
}