import { HttpException, HttpStatus } from "@nestjs/common";
import { Queries } from "../enumQueries";

const ValidateQueries = (queries) => {
    for (const iterator of Object.keys(queries)) {
        if (Queries.indexOf(iterator) === -1) {
          throw new HttpException('Invalid queries', HttpStatus.BAD_REQUEST);
        }
    }
    let { limit, page } = queries;
    if (limit < 1 || page < 1) {
        throw new HttpException('Invalid queries', HttpStatus.BAD_REQUEST);
    }

}

export { ValidateQueries };