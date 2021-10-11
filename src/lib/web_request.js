const COMAKE_API_VERSION = "v1";
const FETCH_REQUEST_DEFAULT_ARGS = {
  mode: 'cors',
  redirect: 'follow',
  headers: {
    "Accept": "application/json",
    'Content-Type': 'application/json'
  }
}

class WebRequest {
  static verifyLoginEmail(reqData={}) {
    return this.get({ url: `/${COMAKE_API_VERSION}/users/verify_login_email`, data: reqData });
  }

  static getMe(reqData={}) {
    return this.get({ url: `/${COMAKE_API_VERSION}/users/me`, data: reqData });
  }

  static get(args) {
    return this.performFetchRequest('GET', args);
  }

  static performFetchRequest(method, args) {
    const params = { ...FETCH_REQUEST_DEFAULT_ARGS, method: method }

    let query = ''
    if (method == 'GET' && args.data) {
      query += `?${this.JSONParamsToUrlString(args.data)}`
    } else if (args.data) {
      params.body = JSON.stringify(args.data)
    }

    return new Promise((resolve, reject) => {
      fetch(`https://api.comake.io${args.url}${query}`, params)
        .then((response, textStatus, xhr) => {
          const responseJSONPromise = response.json()
          if (response.ok) {
            resolve(responseJSONPromise)
          } else {
            responseJSONPromise.then(
              data => {
                this.handleFetchRequestFailure(response, data)
                reject(data)
              }, (error) => {
                reject({ status: response.status, statusText: response.statusText, error })
              }
            )
          }
        })
        .catch((xhr, textStatus, errorThrown) => {
          reject(xhr, textStatus, errorThrown)
        })
    })
  }

  static handleFetchRequestFailure(response, data) {
    // TODO
  }

  static JSONParamsToUrlString(params, parentKeys=[]) {
    const paramsIsArray = Array.isArray(params)
    const paramStrings = Object.keys(params).map((paramName, i) => {
      let paramValue = params[paramName];
      const paramValueType = Object.prototype.toString.call(paramValue);
      if (['[object Array]', '[object Object]'].includes(paramValueType)) {
        return this.arrayOrObjectParamToUrlString(paramName, paramValue, i, paramsIsArray, parentKeys)
      } else {
        return this.nonArrayOrObjectParamToUrlString(paramName, paramValue, paramsIsArray, parentKeys)
      }
    })

    parentKeys.pop()
    return paramStrings.join('&')
  }

  static arrayOrObjectParamToUrlString(paramName, paramValue, paramIndex, parentIsArray, parentKeys) {
    if (parentIsArray) {
      parentKeys.push(paramIndex)
    } else {
      parentKeys.push(paramName)
    }
    return this.JSONParamsToUrlString(paramValue, parentKeys)
  }

  static nonArrayOrObjectParamToUrlString(paramName, paramValue, paramsIsArray, parentKeys) {
    let paramKey;
    if (parentKeys.length > 0) {
      const keys = paramsIsArray ? parentKeys : [...parentKeys, paramName];
      paramKey = `${keys[0]}${keys.slice(1).map(key => `[${key}]`).join('')}`
    } else {
      paramKey = paramName;
    }

    const encodedParamValue = encodeURIComponent(paramValue)
    if (paramsIsArray) {
      return `${paramKey}[]=${encodedParamValue}`
    } else {
      return `${paramKey}=${encodedParamValue}`
    }
  }
}

export default WebRequest;
