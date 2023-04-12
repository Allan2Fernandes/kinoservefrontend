import http from 'k6/http'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js"
export const options = {
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<200'],
    },
    duration:'10s',
    vus:1,
};

export default function(){
    var res = http.get('http://127.0.0.1:5200/', { headers: { "Accept": "*/*" } });
}

export function handleSummary(data) {
    return {
        "summary.html": htmlReport(data),
    };
}
