import { Response } from 'express';

interface IHttpResponse {
    code: number;
    message: string;
    data?: unknown;
}

const HttpResponse = (res: Response, data: IHttpResponse) => {
    return res.status(data.code).json(data);
};

export default HttpResponse;
