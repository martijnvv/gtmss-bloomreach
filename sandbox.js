// open the API gates
const encodeUriComponent = require('encodeUriComponent');
const decodeUriComponent = require('decodeUriComponent');
const getCookieValues = require('getCookieValues');
const setCookie = require('setCookie');
const queryPermission = require('queryPermission');
const sendHttpGet = require('sendHttpGet');
const getTimestampMillis = require('getTimestampMillis');
const generateRandom = require('generateRandom');
const makeNumber = require('makeNumber');
const JSON = require('JSON');
const logToConsole = require('logToConsole');
const parseUrl = require('parseUrl');
const getEventData = require('getEventData');
const makeInteger = require('makeInteger');
const getType = require('getType');
const activateLogs = data.activateLogs;

// function to check if value is empty
function isNotEmpty(obj) {
  if(obj == undefined || obj == null || obj.toString() == "" ) {
    return false;
  } else {
    return obj;
  }
}

// we work on the cookie part of the code
// we get the uid to keep it for existing cookies and hc (hit count) parameter to increment with 1 and update the cookie
const page_location = parseUrl(getEventData('page_location'));
const cookieDomain = page_location.hostname.indexOf('www.') == 0 ? page_location.hostname.replace('www.', '.') : page_location.hostname;


let cookieValue = getCookieValues('_br_uid_2');
const timestampSeconds = makeInteger(getTimestampMillis() / 1000);

function incrementHcValue(cookie2) {
    // Check if the value is not an array, get the string value instead
    if (getType(cookie2) === 'array') {
        cookie2 = cookie2[0];
    }

    // Decode cookie2 value
    var decoded = decodeUriComponent(cookie2);

    // Function to pull value from parameter
    function getParameterValue(decoded, paramName) {
        var paramIndex = decoded.indexOf(paramName + "=");
        if (paramIndex === -1) {
            return null;
        }

        var start = paramIndex + paramName.length + 1; // after the "=" character
        var end = decoded.indexOf(":", start);
        if (end === -1) {
            end = decoded.length;
        }

        var value = decoded.substring(start, end);
        return value;
    }

    // pull uid and hc paramater values
    var uidValue = getParameterValue(decoded, "uid");
    var hcValue = makeInteger(getParameterValue(decoded, "hc"), 10);

    // Check if uid and hc are correct parameters
    if (!uidValue) {
        if(activateLogs){logToConsole("invalid uid-value");}
    }

    if (!hcValue) {
        if(activateLogs){logToConsole("invalid hc-value");}
    }

    // increment the value with one to update hit count
    var newHcValue = hcValue + 1;
   
    return {
        uid: uidValue,
        newHcValue: newHcValue
    };
}

const options = {
    'domain': cookieDomain, 
    'path': '/',
    'max-age': 60*60*24*365,
    'secure': true
};

if(isNotEmpty(cookieValue)){
  const cookieValues = incrementHcValue(cookieValue);
  const h2_new = cookieValues.newHcValue;
  const uid_current = cookieValues.uid;  
  setCookie('_br_uid_2', "uid=" + uid_current + ":v=15.0:ts=" + timestampSeconds + ":hc=" + h2_new,  options);
}else if(!isNotEmpty(cookieValue)){
  setCookie('_br_uid_2', "uid=" + generateRandom(100000000000, 9999999999999) + ":v=15.0:ts=" + timestampSeconds + ":hc=1", options);
  cookieValue = "uid=" + generateRandom(100000000000, 9999999999999) + ":v=15.0:ts=" + timestampSeconds + ":hc=1"; 
  if(activateLogs){logToConsole('Cookie is empty... Created a new cookie value' + cookieValue);}
}

// generate random number
let random_number = generateRandom(100000000000, 9999999999999);

// check the items object in GA4 format
let items_data;
if(isNotEmpty(getEventData('items'))){
  items_data = getEventData('items');
}

let items_name = () => {  
  let result = "";
  if(isNotEmpty(data.items)){
    items_data = data.items;
  }
  if(data.prodidGa) {
    if (items_data) {
      items_data.forEach(function(item, i) {
        let name = item.item_name || '';
        name = name.split('!').join('');        
        result += name;
        if (i < items_data.length - 1) {
          result += ',';
        }   
      });
    }
  }
  return result;
};

let items_id = () => {  
  let result = "";
  if(isNotEmpty(data.items)){
    items_data = data.items;
  }
  if(data.prodidGa) {
    if (items_data) {
      items_data.forEach(function(item, i) {
        result += item.item_id;
        if (i < items_data.length - 1) {
          result += ',';
        }   
      });
    }
  }
  return result;
};

// create the basket parameter from the GA4 items object on the purchase event
function generateBasketParameter(items) {
    return items.map(item => {
        const productId = item.item_id;
        const skuId = item.item_id; // product ID is identical
        const productName = encodeUriComponent(item.item_name ? item.item_name.split('!').join('') : '');
        const price = makeNumber(item.price); // price with decimals
        const quantity = item.quantity; // Number of products

        // Format product by product in this function
        return "!iSKU_" + productId + "'sSKU_" + skuId + "'n" + productName + "'p" + price + "'q" + quantity;
    }).join('');
}

let event_group = undefined;
  if(data.event_type === 'click-add'){
     event_group = 'cart';
   }else if(data.event_type === 'click' || data.event_type === 'submit'){
     event_group = 'suggest';
   }else if(data.event_type === 'quickview'){
     event_group = 'product';
   }

let params = {};
// required variables
params.acct_id = data.account_id;
params.debug = data.debug;
params.test_data = data.test_data;
params.version = data.version || '15.0';
//params.tzo = '-120'; // how do we set this up? Is it required?
params.cookie2 = cookieValue;
params.sid = 'undefined';
params.origin_source = 'gtmss';
params.domain_key = data.domain_key; 
params.rand = random_number;
params.type = data.type; 
params.lang = isNotEmpty(data.user_language) || getEventData('user_language_navigator');
params.title = isNotEmpty(data.page_title) || getEventData('page_title');
params.url = isNotEmpty(data.page_location) || getEventData('page_location');
params.ref = isNotEmpty(data.referrer) || getEventData('page_referrer') || 'https://www' + cookieDomain;
params.orig_ref_url = isNotEmpty(data.referrer) || getEventData('page_referrer') || 'https://www' + cookieDomain;
params.ptype = data.page_type || 'other';
if(params.type == 'event'){
  params.etype = data.event_type;
  params.group = event_group;
}
params.prod_id = items_id() || getEventData('items[0].item_id');
params.prod_name = items_name() || getEventData('items[0].item_name');
params.sku = items_id() || getEventData('items[0].item_id');
params.e_sku = items_id() || getEventData('items[0].item_id');
params.e_prod_id = items_id() || getEventData('items[0].item_id');
if(params.group == 'suggest'){
  params.q = data.query || getEventData('search_term'); 
  params.aq = data.actual_query || getEventData('search_term'); 
}
if(params.ptype == 'content'){
  params.content_id = data.content_id || getEventData('content_id');
  params.content_name = data.content_name || getEventData('content_name');
  params.catalogs = 'cat0=' + data.catalogs;
}
if(params.ptype == 'search'){
  params.search_term = data.search_term || getEventData('search_term');  
  params.catalogs = 'cat0=' + data.catalogs;
}
if(params.ptype == 'category'){
  params.cat_id = data.category_id;
  params.cat = data.category_name;
}
if(params.ptype == 'conversion'){
  params.is_conversion = data.is_conversion;
  params.order_id = data.transaction_id || getEventData('transaction_id');
  params.basket_value = data.basket_value|| getEventData('value');
  params.basket = generateBasketParameter(items_data);
}

// check the logs if the box is ticked
if (data.activateLogs) {
  logToConsole("Params: " + JSON.stringify(params));  
}

// generating the pixel for events
let url = 'https://p-eu.brsrvr.com/pix.gif?';

let all_params = "";
if (isNotEmpty(params)) {
  for (var key in params) {
    if (params[key] == undefined || params[key] == null) {
      continue;
    }
    all_params += key + "=" + encodeUriComponent(params[key]) + "&";
  }
  // Remove the last '&' if it exists
  if (all_params.length > 0 && all_params[all_params.length - 1] === "&") {
    all_params = all_params.slice(0, -1);
  }
  url += all_params;
}
if (data.activateLogs) {
  if(activateLogs){logToConsole('URL: ' + url);}
}

// send to server
return sendHttpGet(url, {
  headers: {
      'content-type': 'image/gif', 
      'user-agent': getEventData('user_agent'), 
      'referrer': getEventData('page_location'), 
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      //'X-Forwarded-For': getEventData('ip_override'),
      'Host': 'p-eu.brsrvr.com'
  },
  timeout: 15000,
}).then((result) => {
  if (result.statusCode >= 200 && result.statusCode < 300) {
    if(activateLogs){logToConsole('Bloomreach Result: Success');}
    data.gtmOnSuccess();
  } else {
    if(activateLogs){logToConsole('Bloomreach Error: ' + result.statusCode);}
    data.gtmOnFailure();
  }
});
