export class AbortControllerService{
    static abortControllers: Map<string, AbortController> = new Map<string, AbortController>();
    static addAbortController(key: string, abortController: AbortController){
        this.abortControllers.set(key, abortController);
    }
    static getAbortController(key: string): AbortController | undefined{
        return this.abortControllers.get(key);
    }
    static removeAbortController(key: string){
        this.abortControllers.delete(key);
    }
    static abortAll(){
        this.abortControllers.forEach((abortController: AbortController) => {
            abortController.abort();
        });
    }
}
