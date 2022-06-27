/** load business solution resources */
dku_bs_resources.load_resources(run()).then(console.log(' Business solutions resources loaded '));

//callback when resources are loaded
function run(){

    setTimeout(function(){
        $.getJSON(getWebAppBackendUrl('getData'), function(dashboard) {
            console.log("this is running now");
            charts_generator.createOrUpdateDashboard(dashboard);
        });
    }, 500);

}


