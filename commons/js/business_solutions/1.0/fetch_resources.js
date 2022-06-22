/** 
 * Copy this to your application js file to be able to 
 * fetch whatever static resource by your app backend 
 **/
class BSStaticResources {
    constructor() {
        this.loaded = new Set();
        this.fetch_scripts = ['/fetch/commons/js/echarts/5.3.2/echarts.js',
            '/fetch/commons/js/vue/3.2.33/vue.global.js',
            '/fetch/commons/js/bootstrap/5.1.3/bootstrap.bundle.min.js'
        ];
        this.fetch_links = ['/fetch/commons/css/bootstrap/5.1.3/bootstrap.min.css'];
    }
    addScripts(my_scripts) {
        for (const my_script of my_scripts) {
            if (this.fetch_scripts.includes(my_script)) {
                console.log('BSStaticResources: [' + my_script + '] already registered')
            } else {
                console.log('BSStaticResources: registering [' + my_script + ']')
                this.fetch_scripts.push(my_script)
            }
        }
    }

    addLinks(my_links) {
        for (const my_link of my_links) {
            if (this.fetch_links.includes(my_link)) {
                console.log('BSStaticResources: [' + my_link + '] already registered')
            } else {
                console.log('BSStaticResources: registering [' + my_link + ']')
                this.fetch_links.push(my_link)
            }
        }
    }

    load_script(my_script, loaded) {
        return new Promise(function(resolve, reject) {
            if (loaded.has(my_script)) {
                resolve();
            } else {
                var script = document.createElement('script');
                script.onload = resolve;
                script.src = getWebAppBackendUrl(my_script);
                document.head.appendChild(script);
            }
        });
    }

    load_link(my_link, loaded) {
        return new Promise(function(resolve, reject) {
            if (loaded.has(my_link)) {
                resolve();
            } else {
                var link = document.createElement('link');
                link.onload = resolve;
                link.href = getWebAppBackendUrl(my_link);
                link.rel = "stylesheet"
                link.type = "text/css";
                document.head.appendChild(link);
            }
        });
    }

    async load_resources(callback) {
        var promises = [];
        for (const my_script of this.fetch_scripts) {
            promises.push(this.load_script(my_script, this.loaded));
        }
        for (const my_link of this.fetch_links) {
            promises.push(this.load_link(my_link, this.loaded));
        }
        await Promise.all(promises);
        for (const my_script of this.fetch_scripts) {
            this.loaded.add(my_script);
        }
        for (const my_link of this.fetch_links) {
            this.loaded.add(my_link);
        }
        //wait for echarts to be available 
        var interval = setInterval(function() {
            if (typeof echarts == 'undefined') {
                console.log('echarts object not yet defined, waiting')
                return;
            }
            clearInterval(interval);
            callback();
        }, 10);
     }
}

dku_bs_resources = new BSStaticResources();

/** 
 * ADD your resources  
 * resources should be uploaded into 
 *     lib/python/project/js/MY_LIB_NAME/MY_LIB_VERSION/MY_FILE.js 
 * and 
 *.    lib/python/project/css/MY_LIB_NAME/MY_LIB_VERSION/MY_FILE.css
 *

 * a callback is to be provided to load_resources and it will be called back once resources are loaded and libs are initialized

    var bs_init_script = document.createElement("script");
    bs_init_script.type = "text/javascript";
    bs_init_script.src = getWebAppBackendUrl('/fetch/commons/js/business_solutions/1.0/fetch_resources.js');
    $("head").append(bs_init_script);
    dku_bs_resources.addScripts(['/fetch/project/js/MY_LIB_NAME/MY_LIB_VERSION/MY_FILE.js'])
    // Add your own resources
    dku_bs_resources.addLinks(['/fetch/project/css/MY_LIB_NAME/MY_LIB_VERSION/MY_FILE.css'])
    // Load resources
    dku_bs_resources.load_resources(callback).then(console.log(' Business solutions resources loaded '));

 **/


