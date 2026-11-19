


/**
* Enumeration of HoldingItem
*/
enum HoldingItem
{
     //% block="nada"
     NoItem = 0,
     //% block="un pico"
     Pickaxe = 1,
     //% block="un mapa"
     Map = 2,
     //% block="una espada"
     Sword = 3,
     //% block="una piedra"
     Stone = -1,
     //% block="un martillo"
     Hammer = -1,
     //% block="un diamante"
     Diamond = -1,
     //% block="una manzana"
     Apple = -1,
}

/**
* Enumeration of WearingHat
*/
enum WearingHat
{
     //% block="sin nada en la cabeza"
     NoHat = 4,
     //% block="con sombrero en la cabeza"
     Hat = 5,
}

/**
* Enumeration of WearingEyeware
*/
enum WearingEyeware
{
     //% block="sin gafas"
     NoEyeware = 6,
     //% block="con gafas de sol"
     WearingEyeware = 7,
}

/**
* Enumeration of Legs
*/
enum Legs
{
     //% block="2"
     TwoLegs = 8,
     //% block="4"
     FourLegs = 9,
     //% block="más de 4"
     OverFourLegs = 10,
}

/**
* Enumeration of CrestSymbol
*/
enum CrestSymbol
{
     //% block="escudo desconocido"
     UnknownCrest = 11,
     //% block="escudo real"
     RoyalCrest = 12,
     //% block="escudo enemigo"
     EnemyCrest = 13,
     //% block="sin escudo"
     NoCrest = 14,
}


//% block="Ciberseguridad"
namespace cyber {


    class Rule {
        x = 0;
        y = 0;
        z = 0;
        enabled = true;
        rule_id = ""

        public constructor(x: number, y: number, z: number, enabled: boolean, rule_id: string) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.enabled = enabled;
            this.rule_id = rule_id
        }

        public addRule(): void {
            //player.say(`Placing blocks at ${this.x} ${this.y} ${this.z}`)
            loops.pause(200);
            blocks.place(STONE, world(this.x, this.y, this.z))
        }

        public removeRule(): void {
            loops.pause(200);
            blocks.place(AIR, world(this.x, this.y, this.z))
        }
    }


    class CombinedRule extends Rule {
        rule1: Rule;
        rule2: Rule;

        public constructor(rule1: Rule, rule2: Rule) {

            super(0, 0, 0, true, "-1");
            if (parseInt(rule1.rule_id) > parseInt(rule2.rule_id)) {
                this.rule2 = rule2;
                this.rule1 = rule1;
              } else if (parseInt(rule1.rule_id) < parseInt(rule2.rule_id)) {
                this.rule1 = rule2;
                this.rule2 = rule1;
              } else {
                // If both rules are the same
                this.rule1 = rule1;
                this.rule1 = rule1;
              }

        }

        public addRule(): void {
            if (this.rule1.enabled && this.rule2.enabled){
                blocks_rules[`${this.rule1.rule_id}-${this.rule2.rule_id}`].addRule()
            }
        }

        public removeRule(): void {
            if (this.rule1.enabled && this.rule2.enabled){
                blocks_rules[`${this.rule1.rule_id}-${this.rule2.rule_id}`].removeRule()
            }
        }
    }

    class SymbolGrid{
        gridText: String
        public constructor(gridText: String){
            this.gridText = gridText;
        }
    }

    let blocks_rules: {[key: string]: Rule} = {};
    blocks_rules["-1"] = new Rule(33, 64, -24, true, "0");
    for (let i = 0; i <= 14; i++) {
        blocks_rules[`${i}`] = new Rule(35 + i, 64, -24, true, `${i}`);
        blocks_rules[`${i}-${i}`] = new Rule(35 + i, 64, -24, true, `${i}`);
    }
    for (let b = 0; b <= 14; b++) {
        for (let a = b + 1; a <= 14; a++) {
            blocks_rules[`${a}-${b}`] = new Rule(35 + b, 64, -19 + a, true, `${a}-${b}`);
        }
    }
    
    let AllowAllRule = new Rule(35, 64, -29, true, "-1")
    let DenyAllRule = new Rule(35, 64, -30, true, "-1")

    let FirewallSetupDoneRule = new Rule(37, 64, -29, true, "-1")
    let FirewallSetupStartingRule = new Rule(39, 64, -29, true, "-1")


    function setupFirewallHandler() {
        FirewallSetupStartingRule.addRule()
        //player.say("Firewall setup!")
    }

    function firewallSetupComplete(){
        // Run once the firewall is complete placing its rule blocks
        FirewallSetupDoneRule.addRule()
    }
    /**
     * Evento de configuración del cortafuegos
     */
    //% block="Configurar cortafuegos"
    //% color="#569138" weight=100
    export function setupFirewall(handler: () => void) {
        setupFirewallHandler();
        loops.pause(500)
        handler();
        firewallSetupComplete();
    }

    /**
     * Permitir todo
     */
    //% block="Permitir todo" weight=95
    export function allowAll() {
        AllowAllRule.addRule()
        //for (let block_key of Object.keys(blocks_rules)) {
        //    blocks_rules[block_key].addRule()
        //}
    }

    /**
     * Denegar todo
     */
    //% block="Denegar todo" weight=90
    export function denyAll() {
        DenyAllRule.addRule()
        //for (let block_key of Object.keys(blocks_rules)) {
        //    blocks_rules[block_key].removeRule()
        //}
    }

    /**
    * Añade una regla para permitir el paso
    */
    //% block="Añadir regla de permitir $firewallRule" weight=85
    export function addAllowFirewallRule(firewallRule: Rule | CombinedRule) {
        firewallRule.addRule()
    }


    /**
     * Añade una regla para denegar el paso
     */
    //% block="Añadir regla de denegar $firewallRule" weight=85
    export function addDenyFirewallRule(firewallRule: Rule | CombinedRule) {
        firewallRule.removeRule()
    }

    /**
     * Regla del sombrero
     */
    //% block="%hat"
    //% color="#249ca3" weight=80
    export function requireHat(hat: WearingHat): Rule {
        return blocks_rules[hat];
    }

    /**
     * Regla del objeto en la mano
     */
    //% block="en la mano: %item"
    //% color="#249ca3" weight=80
    export function requireHoldingItem(item: HoldingItem): Rule {
        return blocks_rules[item];

    }


    /**
     * Regla del número de patas
     */
    //% block="tiene %legNum patas"
    //% color="#249ca3" weight=80
    export function requireLegs(legNum: Legs): Rule {
        return blocks_rules[legNum];
    }


    /**
    * Regla de las gafas
    */
    //% block="%eyewear"
    //% color="#249ca3" weight=80
    export function requireEyewear(eyewear: WearingEyeware,): Rule {
        return blocks_rules[eyewear.toString()];

    }


    /**
     * Combinar reglas
     */
    //% block="%rule1 y %rule2"
    //% color="#ff8353" weight=81
    export function ruleAnd(rule1: Rule, rule2: Rule): CombinedRule {
        return new CombinedRule(rule1, rule2);
    }

    //% weight=75
    //% blockId=buildagrid block="escudo"
    //% imageLiteralColumns=5
    //% imageLiteralRows=5
    //% gridLiteral=1
    export function createGridString(grid: string) {
        return new SymbolGrid(grid);
    }

    /**
    * Escudo del guardia
    */
    //% block="tiene el escudo %grid"
    //% color="#249ca3" weight=80
    //% grid.shadow="buildagrid"
    export function requireCrest(grid: SymbolGrid,): Rule {
        if (grid.gridText === `
    # . . . #
    . # . # .
    . . # . .
    . # # # .
    # . # . #
    ` || grid.gridText === `
    . # # # .
    # . . . #
    # # . # #
    # . . . #
    . # . # .
    `){     
            //player.say("Royal crest added")
            return blocks_rules[CrestSymbol.RoyalCrest.toString()];
        }
        else if (grid.gridText === `
        . . # . .
        . # . # .
        # . # . #
        . # . # .
        # . . . #
        ` || grid.gridText === `
        # # . # #
        # . # . #
        . # . # .
        # . # . #
        . # # # .
        `){ 
            //player.say("Enemy crest added")
            return blocks_rules[CrestSymbol.EnemyCrest.toString()];
        }
        else{
            //player.say("Unknown crest")
            return blocks_rules[CrestSymbol.UnknownCrest.toString()];
        }

    }

}
