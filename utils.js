export default function useFetch() {
    return ({
        endpoint,
        method,
        auth,
        setAuth,
        requestData,
        thenFunc,
        errorFunc,
        finallyFunc,
    }) => {
        fetch(`http://192.168.43.85:5555/${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth.token ? `Bearer ${auth.token}` : undefined,
            },
            body: method === 'GET' || method === 'HEAD' ? null : JSON.stringify(requestData),
        })
            .then(async (response) => {
                if (!response.ok) throw new Error((await response.json()).message);
                if (response.headers.has('Authorization')) {
                    const token = response.headers.get('Authorization');
                    setAuth({ ...auth, token });
                }
                return response.json();
            })
            .then(thenFunc || console.log)
            .catch(errorFunc || console.error)
            .finally(finallyFunc);
    };
}
