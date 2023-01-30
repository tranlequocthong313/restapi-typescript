import { Response } from 'express';

interface IHttpResponse {
    code: number;
    message: string;
    data?: unknown;
}

const HttpResponse = (callback: Response, data: IHttpResponse) => {
    return callback.status(data.code).json(data);
};

export default HttpResponse;
