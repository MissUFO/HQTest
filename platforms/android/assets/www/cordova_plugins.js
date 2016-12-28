cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.jcjee.plugins.emailcomposer/www/EmailComposer.js",
        "id": "com.jcjee.plugins.emailcomposer.EmailComposer",
        "clobbers": [
            "EmailComposer"
        ]
    },
    {
        "file": "plugins/nl.x-services.plugins.socialsharing/www/SocialSharing.js",
        "id": "nl.x-services.plugins.socialsharing.SocialSharing",
        "clobbers": [
            "window.plugins.socialsharing"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.jcjee.plugins.emailcomposer": "1.4.6",
    "nl.x-services.plugins.socialsharing": "4.3.17"
}
// BOTTOM OF METADATA
});