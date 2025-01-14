import axios from "axios";
export const fetchHTML = async (url) => {
    try {
        url = new URL(url).href;

        const res = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            },
            maxRedirects: 10,
            timeout: 100000,
            validateStatus: (status) => status >= 200 && status < 400,
        });

        if (res.request.res.responseUrl && !res.request.res.responseUrl.includes(url)) {
            console.warn(`Redirected to: ${res.request.res.responseUrl}`);
        }

        return res.data;
    } catch (error) {
        console.error(`Error Fetching HTML from Domain: ${url}`, error.message);
        return null;
    }
};
