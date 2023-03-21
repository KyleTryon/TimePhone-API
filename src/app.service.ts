import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '<p>View the API documentation at <a href="/api">/api</a>.<br>View the GitHub repo at <a href="https://github.com/KyleTryon/TimePhone-API">https://github.com/KyleTryon/TimePhone-API</a></p>';
  }
}
