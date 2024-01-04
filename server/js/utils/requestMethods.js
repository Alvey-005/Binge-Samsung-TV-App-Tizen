window.baseURL = 'https://ss-staging.binge.buzz'
window.requestMethod = {
    get: function(url, params={}){

        return axios({
            url,
            baseURL: baseURL,
    
            method: 'get', // default
            headers: {
                // Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdGF0dXMiOiJGcmVlIiwiY3JlYXRlZEF0IjoiY3JlYXRlIGRhdGUiLCJ1cGRhdGVkQXQiOiJ1cGRhdGUgZGF0ZSIsInR5cGUiOiJ0b2tlbiIsImRldlR5cGUiOiJ3ZWIiLCJleHRyYSI6IjMxNDE1OTI2IiwiaWF0IjoxNzA0MTk1Nzg0LCJleHAiOjE3MDQzNjg1ODR9.xm5_X8X0lTTCItMPa6MrXgWjxFpuWSFhSV9frbsb9Xk',
                Authorization: `Bearer ${session.storage.jwtToken}`,
                'Device-Type': 'web',
                'Content-Type': 'application/json;charset=utf-8',
                // 'language': 'en',
    
            },
            data:params,
            timeout: 50000, // default is `0` (no timeout)
            withCredentials: false, // default
            responseEncoding: 'utf8', // default
            maxRedirects: 2, // default
        });
    },
    post : function(url, body){
        return axios({
            url,
            baseURL: baseURL,
        // baseURL: base_url,

        method: 'post',
        headers: {
            Authorization: `Bearer ${session.storage.jwtToken}`,
            'Device-Type': 'web',
            'Content-Type': 'application/json',
            // 'language': 'en',
        },
        data: JSON.stringify(body),
        timeout: 50000,
        withCredentials: false,
        responseEncoding: 'utf8',
        maxRedirects: 2,
        })
    },
    put: function(url, body, formData){
        const config = {
            url,
            baseURL: baseURL,

            method: 'put',
            headers: {
            Authorization: `Bearer ${session.storage.jwtToken}`,
                'Device-Type': deviceType,
                'Content-Type': formData
                    ? // eslint-disable-next-line no-underscore-dangle
                      `multipart/form-data; boundary=${body._boundary}`
                    : 'application/json',
                Accept: 'application/json',
                // 'language': 'en',
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            cache: false,
            data: formData ? body : JSON.stringify(body),
            timeout: 50000,
            withCredentials: false,
            responseEncoding: 'utf8',
            maxRedirects: 2,
            processData: false,
        };
        return axiosConfig(config);
    }
}