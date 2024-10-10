/**
 * @whatItDoes Represents an Decision Support instance.
 *
 * @description
 *  This is the Class that holds an instance of a process being carried out.
 *
*/

export class DecisionSupport {
    constructor( entityId: number, label: string, processId: number) {
        this.entityId = entityId;
        this.label = label;
        this.processId = processId;
    }
    
    /**
     * The id of the decision support.
     */
    entityId: number;
    
    /**
     * The name of the decision support.
     */
    label: string;
    
    /**
     * ID of the process that the decision support was created to carry out.
     */
    processId: number;
}