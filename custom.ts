/**
 * Bloques personalizados
 */
namespace agent {
    /**
     * El agente suelta todo su inventario, objeto a objeto, en una dirección
     * @param direction la dirección en la que soltará los objetos
     */
    //% block="agente suelta todos los objetos uno a uno $direction" blockId=agentdropallitemsindividually
    export function dropAllItemsIndividually(direction: SixDirection) {
        for (let slot = 1; slot <= 27 ; slot++) {
            let count = agent.getItemCount(slot);
            for(let i = 0; i < count; i++) {
                agent.drop(direction, slot, 1);
                loops.pause(100);
            }
        }
    }
}
