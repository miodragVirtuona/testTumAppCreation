var APP_CONF = {
    currentAppConfiguration: null,
    currentAppConfigurationUri: null
};

//set view name in this variable
var T_VIEW_NAME = "";

function onInit() {
    $("#tasor-app").show();

    $("body").hideBusy();

	//change name of variable view, and variable T_VIEW_NAME
    var appNav = new TasorAppNavigation();
    var view = new TasorAppView(T_VIEW_NAME);
    appNav.addView(view);
    appNav.setDefaultView(T_VIEW_NAME);
    appNav.showInitView();
}

$(function () {
    /*---SAFE PLACE TO START CALLING TASOR API---*/
    function onTasorLoaded() {
        console.log("Tasor Loaded");
        Language.replaceAllLanguageKeys();
        // Initialization of application.
        var userAppConf = new UserAppConf();
        userAppConf.getUserAppConfiguration(APP_VOC.TasorApplication.GENERIC_APP_STATE_CONF, function (confUri) {
            APP_CONF.currentAppConfigurationUri = confUri;
            userAppConf.setAppConfiguration(confUri, function (options) {
                APP_CONF.currentAppConfigurationUri = options.confUri;
                APP_CONF.currentAppConfiguration = options.data;
                onInit();
            }, function () {
                onInit();
            });
        });
        // onInit();
    };
    /*------*/

    var PROJECT_URI = APP.APP_KB_PROJ;
    var LANGUAGE = null;

    function onTasorError(tex) {

        // On user login refresh page
        $(Tagleen).on(Tagleen.events.user.LOGGED_IN, function (ev) {
            console.log("Login Username: " + ev.name);
            window.location.reload();
        });
        /*---ERRORS IN TASOR INITIALIZATION---*/
        if (tex.name == Tagleen.error.PROJECT_NOT_FOUND) {
            //if project is not found then we can show login (maybe project is not public)
            TagleenUser.showLogin(function () {
                //refresh page after login so we can try to set project again
                window.location.reload();
            }, function () {
                alert("login error");
            });
        } else {
            alert("Error Loading Tasor");
        }
        return false;
    }

    $(document).bind(Tagleen.events.init.TAGLEEN_LOADED, function () {
        var languageLoaded = function () {
            Language.replaceAllLanguageKeys({
                "element": $("html")
            });

            // On user login refresh page
            $(Tagleen).on(Tagleen.events.user.LOGGED_IN, function (ev) {
                console.log("Login Username: " + ev.name);
                window.location.reload();
            });

            onTasorLoaded();
            $("body").hideBusy();
        }

        /*---load language---*/
        LANGUAGE = Language.getLanguageToLoad();
        Language.loadLanguage(LANGUAGE, languageLoaded, function () {
            talert("Failed to load language");
        });

        /*---ext links---*/
        ExternalLinks.replaceAllExtLinks();

		// Initialization of vocabulary.
        /*---vocabular---*/
        if (isset(APP_VOC)) {
            APP_VOC.init();
        }

    });

    $("body").showBusy("Loading Tasor");
    Tagleen.init({
        errorFunc: onTasorError,
        project: PROJECT_URI
    });
});