/** 
 * Copy this file to your application js file to be able to 
 * fetch whatever static resource by your app backend 
 **/
async function load_resources(script_urls, styles_urls) {
    function load_script(script_url) {
        return new Promise(function(resolve, reject) {
            if (load_resources.loaded.has(script_url)) {
                resolve();
            } else {
                var script = document.createElement('script');
                script.onload = resolve;
                script.src = script_url
                document.head.appendChild(script);
            }
        });
    }

    function load_link(style_url) {
        return new Promise(function(resolve, reject) {
            if (load_resources.loaded.has(style_url)) {
                resolve();
            } else {
                var link = document.createElement('link');
                link.onload = resolve;
                link.href = style_url
                link.rel = "stylesheet"
                link.type = "text/css";

                document.head.appendChild(link);
            }
        });
    }
    var promises = [];
    for (const script_url of script_urls) {
        promises.push(load_script(script_url));
    }
    for (const style_url of styles_urls) {
        promises.push(load_link(style_url));
    }
    await Promise.all(promises);
    for (const script_url of script_urls) {
        load_resources.loaded.add(script_url);
    }
    for (const style_url of styles_urls) {
        load_resources.loaded.add(style_url);
    }
}

class BSStaticResources {

    constructor() {
        load_resources.loaded = new Set();
        this.fetch_scripts = ['/fetch/commons/js/echarts/5.3.2/echarts.js',
            '/fetch/commons/js/vue/3.2.33/vue.global.js',
            '/fetch/commons/js/bootstrap/5.1.3/bootstrap.bundle.min.js'
        ];
        this.fetch_links = ['/fetch/commons/css/bootstrap/5.1.3/bootstrap.min.css'];
    }

    addScripts(my_scripts) {
        for (const my_script of my_scripts) {
            this.fetch_scripts.push(my_script)
        }
    }

    addLinks(my_links) {
        for (const my_link of my_links) {
            this.fetch_links.push(my_link)
        }
    }

    run() {
        (async () => {
            var scripts_urls = [];
            var links_urls = [];
            for (const scr of this.fetch_scripts) {
                scripts_urls.push(getWebAppBackendUrl(scr))
            }
            for (const lnk of this.fetch_links) {
                links_urls.push(getWebAppBackendUrl(lnk))
            }
            await load_resources(scripts_urls, links_urls);
        })();
    }
}

dku_bs_app = new BSStaticResources();
dku_bs_app.addScripts(['/fetch/commons/js/echarts/5.3.2/echarts.js',
    '/fetch/commons/js/vue/3.2.33/vue.global.js',
    '/fetch/commons/js/bootstrap/5.1.3/bootstrap.bundle.min.js'
])
dku_bs_app.addLinks(['/fetch/commons/css/bootstrap/5.1.3/bootstrap.min.css'])



/** 
 * add your resources here 
 * resources should be uploaded into 
 *     lib/python/project/js/MY_LIB_NAME/MY_LIB_VERSION/MY_FILE.js 
 * and 
 *.    lib/python/project/css/MY_LIB_NAME/MY_LIB_VERSION/MY_FILE.css
 *
 * dku_bs_app.addScripts([/fetch/project/js/MY_LIB_NAME/MY_LIB_VERSION/MY_FILE.js])
 * dku_bs_app.addLinks([/fetch/project/css/MY_LIB_NAME/MY_LIB_VERSION/MY_FILE.css])
 **/

/** run the app to load the scripts and links */
dku_bs_app.run()