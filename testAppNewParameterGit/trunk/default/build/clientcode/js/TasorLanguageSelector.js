/**
 * Tasor Language Selector
 */

function TasorLanguageSelector(renderEl) {
    this.existingLanguages = [];
    this.defaultLanguage = null;
    this._constructor = function() {

        if (renderEl.length) {

            if (APP.EXISTING_LANGUAGES != null) {
                for (var i = 0; i < APP.EXISTING_LANGUAGES.length; i++) {
                    this.existingLanguages.push(APP.EXISTING_LANGUAGES[i]);
                }
            } else {
                this.existingLanguages.push('en');
            }

            this.defaultLanguage = Tagleen.getDefaultLanguage();

            // Set language in navbar.
            if (this.existingLanguages.length > 0) {
                renderEl.find("li a").html(this.defaultLanguage + '<span class="caret"></span>');

                var repoEl = renderEl.find("li ul");

                // Set dropdown list
                for (var i = 0; i < this.existingLanguages.length; i++) {

                    var thisLang = "";

                    if (this.existingLanguages[i] == this.defaultLanguage) {
                        thisLang = '<li><a href="" data-language="' + this.existingLanguages[i] + '" class="activeLanguage">' + this.existingLanguages[i] + '</a></li>';
                    } else {
                        thisLang = '<li><a href="" data-language="' + this.existingLanguages[i] + '">' + this.existingLanguages[i] + '</a></li>';
                    }

                    $(thisLang).appendTo(repoEl);
                }
            } else {
                renderEl.find("li a").html(this.defaultLanguage);
            }

            renderEl.find(".dropdown-menu").on("click", "li a", function(event) {
                event.preventDefault();

                if (!$(this).hasClass("activeLanguage")) {
                    $("body").showBusy();

                    renderEl.find(".dropdown-menu li a").removeClass("activeLanguage");
                    $(this).addClass("activeLanguage");
                    var selectedLanguage = $(this).attr("data-language");

                    function onLoadLanguage() {
                        renderEl.find("li a.dropdown-toggle").html(selectedLanguage + '<span class="caret"></span>');
                        Tagleen.setDefaultLanguage(selectedLanguage);
                        // Language.replaceAllLanguageKeys();
                        $("body").hideBusy();
                        location.reload();
                    }

                    Language.loadLanguage(selectedLanguage, onLoadLanguage, function() {
                        log.debug("Language from file failed to load.");
                        onLoadLanguage();

                        /*
                        $("body").hideBusy();
                        tconfirm("Failed to load language. Please reload the page and try again.", function () {
                        	location.reload();
                        }, function () {
                        	
                        });
                        */
                    });
                }
            });

            renderEl.show();

        } else {
            // throw exception
        }

        return {
            setDefaultLanguage: function() {

            },
            getDefaultLanguage: function() {

            }
        };
    }
    this._constructor();
}