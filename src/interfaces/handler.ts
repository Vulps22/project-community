import HttpMethod from '../enum/httpMethod';
import { Interaction } from '../utility/interaction';

interface Handler {
    httpMethod: HttpMethod,
    requireAuth: boolean,
    execute(interaction: Interaction): void;
}

export default Handler;