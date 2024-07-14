import HttpMethod from "../../enum/httpMethod";
import Handler from "../../handlers/handler";
import { Interaction } from "../../utility/interaction";

const MeHandler: Handler = {
    httpMethod: HttpMethod.GET,
    requireAuth: true,
    execute: function (interaction: Interaction): void {
       if(!interaction.user) {
        interaction.res.status(400).json({message: "A user was not found with this token"});
       }
       console.log(interaction.user);
       interaction.res.status(200).json(interaction.user);

    }
}

export default MeHandler;