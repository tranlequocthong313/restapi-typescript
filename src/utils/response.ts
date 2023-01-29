import { Response } from 'express';

interface IHttpResponse {
    code: number;
    message: string;
    data?: unknown;
}

class HttpResponse {
    constructor(public callback: Response, public data: IHttpResponse) {
        this.callback = callback;
        this.data = data;

        this.response();
    }

    response() {
        this.callback.status(this.data.code).json(this.data);
    }
}

export default HttpResponse;
