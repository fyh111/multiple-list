var CookieUtil = {
    get: function (name) {
        var cookieName = encodeURIComponent(name) + "=",
            cookieStart = document.cookie.indexOf(cookieName),
            cookieEnd,
            cookieValue = null;
        if (cookieStart > -1) {
            cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd == -1) {
                cookieEnd = document.cookie.length;
            }
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd))
        }
        return cookieValue;
    },
    set: function (name, value, expires, path, domain, secure) {
        var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
        if (Object.prototype.toString.call(expires) == "[object Date]") {
            cookieText += ";expires=" + expires.toGMTString();
        }
        if (path) {
            cookieText += ";path=" + path;
        }
        if (domain) {
            cookieText += ";domain=" + domain;
        }
        if (secure) {
            cookieText += ";secure";
        }
        document.cookie = cookieText;
    },
    unset: function (name, path, domain, secure) {
        this.set(name, "", new Date(0), path, domain, secure);
    }
};
var subCookieUtil = {
    getAll: function (name) {
        var cookieName = encodeURIComponent(name) + "=",
            cookieStart = document.cookie.indexOf(cookieName),
            cookieEnd,
            cookieValue,
            subCookie,
            parts,
            result = {};
        if(cookieStart > -1){
            cookieEnd = document.cookie.indexOf(";", cookieStart);
            if(cookieEnd == -1){
                cookieEnd = document.cookie.length;
            }
            cookieValue = document.cookie.substring(cookieStart+cookieName.length, cookieEnd);
            if(cookieValue.length >0){
                subCookie = cookieValue.split("&");
                for(var i in subCookie){
                    parts = subCookie[i].split("=");
                    result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
                }
                return result;
            }
        }
        return null;
    },
    get: function(name, subname){
        var subcookies = this.getAll(name);
        if(subcookies){
            return subcookies[subname];
        }else{
            return null;
        }
    },
    set: function(name, subname, value, expires, path, domain, secure){
        var subcookies = this.getAll(name) || {};
        subcookies[subname] = value;
        this.setAll(name, subcookies, expires, path, domain, secure);
    },
    setAll: function(name, subcookies, expires, path, domain, secure){
        var subArray = new Array(),
            cookieText = encodeURIComponent(name) + "=",
            subname;
        for (subname in subcookies){
            if(subname.length > 0 && subcookies.hasOwnProperty(subname)){
                subArray.push(encodeURIComponent(subname)+"="+encodeURIComponent(subcookies[subname]));
            }
        }
            if(subArray.length >0){
                cookieText += subArray.join("&");
                
                if(Object.prototype.toString.call(expires) == "[object Date]"){
                    cookieText += ";expires=" + expires.toGMTString();
                }
                if(path){
                    cookieText += ";path=" + path;
                }
                if(domain){
                    cookieText += ";domain=" + domain;
                }
                if(secure){
                    cookieText += ";secure";
                }
            }else{
                cookieText += ";expires=" + (new Date(0)).toGMTString();
            }
            document.cookie = cookieText;
    },
    unset: function(name, subname, path, domain, secure){
        var subcookies = this.getAll(name);
        if(subcookies){
            delete subcookies[subname];
            this.setAll(name, subcookies, null, path, domain, secure);
        }
    },
    unsetAll: function(name, path, domain, secure){
        this.setAll(name, null, new Date(0), path, domain, secure);
    }
}
