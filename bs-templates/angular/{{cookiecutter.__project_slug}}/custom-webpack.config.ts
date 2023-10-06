import * as webpack from 'webpack';
import * as dotenv from 'dotenv';

dotenv.config();

export default (
    config: webpack.Configuration,
) => {
    const apiPort = process.env["ANGULAR_API_PORT"] ? process.env["ANGULAR_API_PORT"]: "";
    const clientPort = process.env["ANGULAR_CLIENT_PORT"] ? process.env["ANGULAR_CLIENT_PORT"]: "";
    const codeStudioHrefEnv =  `DKU_CODE_STUDIO_BROWSER_PATH_${clientPort}`;
    const backendBaseHrefEnv = `DKU_CODE_STUDIO_BROWSER_PATH_${apiPort}`;

    const codeStudioHref = process.env[codeStudioHrefEnv] || null;
    const backendBaseUrl = process.env[backendBaseHrefEnv] || null;
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